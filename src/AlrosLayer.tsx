import { GeoJSONSource } from "maplibre-gl";
import { RoutingAPI } from "mobility-toolbox-js/ol";
import { RoutingResponse } from "mobility-toolbox-js/types";
import { GeoJSON } from "ol/format";
// import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
// import { Stroke, Style } from "ol/style";
import { useEffect } from "react";

import {
  ALROS_LAYER_SOURCE_ID,
  EMPTY_FEATURE_COLLECTION,
  FIT_OPTIONS,
} from "./Constant";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import { AlternativeRoutePart } from "./types";

const routingApi = new RoutingAPI({
  apiKey: import.meta.env.VITE_API_KEY,
});

function AlrosLayer() {
  const { alros } = useAlroContext();
  const { alrosLayer, map } = useMapContext();

  useEffect(() => {
    const format = new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    const source = new VectorSource();
    // const layer = new Vector({
    //   source,
    //   style: () => {
    //     return new Style({
    //       stroke: new Stroke({ color: "green", width: 10 }),
    //     });
    //   },
    // });
    const abortController = new AbortController();
    const sourceGeojson = alrosLayer?.maplibreLayer?.mapLibreMap?.getSource(
      ALROS_LAYER_SOURCE_ID,
    ) as GeoJSONSource;
    if (!map || !alros?.length) {
      return;
    }
    const routeParts: AlternativeRoutePart[] = [];
    alros.map((alro) => {
      routeParts.push(...alro.alternativeRouteParts);
    });
    const abortControllers = routeParts.map(() => {
      return new AbortController();
    });
    const promises = routeParts.map((part) => {
      return routingApi.route(
        {
          mot: "rail",
          // @ts-expect-error - bad type definition
          prefagencies: "db",
          via: "!" + part.from.evaNumber + "|!" + part.to.evaNumber,
        },
        { signal: abortController.signal },
      );
    });
    Promise.all(promises).then((responses: RoutingResponse[]) => {
      // @ts-expect-error - bad type definition
      const featureCollection = responses.reduce((acc, response) => {
        const features = Array.isArray(acc?.features) ? acc.features : [];
        return {
          ...acc,
          features: [
            ...features,
            ...(Array.isArray(response.features) ? response.features : []),
          ],
        };
      });
      source.clear();
      if (featureCollection) {
        source.addFeatures(format.readFeatures(featureCollection));
        // layer.setMap(map);
        map.getView().cancelAnimations();
        map.getView().fit(source.getExtent(), { ...FIT_OPTIONS });
        console.log("ici");
        sourceGeojson?.setData(
          (featureCollection as GeoJSON.GeoJSON) || EMPTY_FEATURE_COLLECTION,
        );
        alrosLayer?.setVisible(true);
      }
    });

    return () => {
      abortControllers?.forEach((abortController) => {
        return abortController.abort();
      });
      source.clear();
      // layer.setMap(null);
      alrosLayer?.setVisible(false);
      sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
    };
  }, [map, alros, alrosLayer?.maplibreLayer?.mapLibreMap, alrosLayer]);
  return null;
}

export default AlrosLayer;

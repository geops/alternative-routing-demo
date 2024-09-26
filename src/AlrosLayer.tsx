import { RoutingAPI } from "mobility-toolbox-js/ol";
import { RoutingResponse } from "mobility-toolbox-js/types";
import { GeoJSON } from "ol/format";
import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import { useEffect } from "react";

import { FIT_OPTIONS } from "./Constant";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import { AlternativeRoutePart } from "./types";

const routingApi = new RoutingAPI({
  apiKey: import.meta.env.VITE_API_KEY,
});

function AlrosLayer() {
  const { alros, setLoading } = useAlroContext();
  const { map } = useMapContext();

  useEffect(() => {
    const format = new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    const source = new VectorSource();
    const layer = new Vector({
      source,
      style: () => {
        return new Style({
          stroke: new Stroke({ color: "green", width: 10 }),
        });
      },
    });
    const abortController = new AbortController();

    if (!map || !alros?.length) {
      return;
    }
    setLoading(true);
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
        layer.setMap(map);
        map.getView().cancelAnimations();
        map.getView().fit(source.getExtent(), { ...FIT_OPTIONS });
      }
      setLoading(false);
    });

    return () => {
      setLoading(false);
      abortControllers?.forEach((abortController) => {
        return abortController.abort();
      });
      source.clear();
      layer.setMap(null);
    };
  }, [map, alros, setLoading]);
  return null;
}

export default AlrosLayer;

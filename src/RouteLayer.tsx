import { RoutingAPI } from "mobility-toolbox-js/ol";
import { RoutingResponse } from "mobility-toolbox-js/types";
import { GeoJSON } from "ol/format";
import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import { useEffect } from "react";

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
    const routeParts: AlternativeRoutePart[] = [alros.alternativeRouteParts[0]];
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
          prefagencies: "db",
          via: "!" + part.from.evaNumber + "|!" + part.to.evaNumber,
        },
        { signal: abortController.signal },
      );
    });
    Promise.all(promises).then((responses: RoutingResponse[]) => {
      const featureCollection = responses.reduce((acc, response) => {
        return {
          ...acc,
          features: [...acc.features, ...response.features],
        };
      });
      source.clear();
      if (featureCollection?.features?.length > 0) {
        source.addFeatures(format.readFeatures(featureCollection));
        layer.setMap(map);
        map.getView().fit(source.getExtent(), { padding: [50, 50, 50, 50] });
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

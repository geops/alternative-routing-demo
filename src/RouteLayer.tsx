import { GeoJSONSource } from "maplibre-gl";
import { RoutingAPI } from "mobility-toolbox-js/ol";
import { RoutingResponse } from "mobility-toolbox-js/types";
import { GeoJSON } from "ol/format";
import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import { useEffect } from "react";

import {
  EMPTY_FEATURE_COLLECTION,
  FIT_OPTIONS,
  FIT_OPTIONS_SM,
  ROUTE_LAYER_SOURCE_ID,
} from "./Constant";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";

const routingApi = new RoutingAPI({
  apiKey: import.meta.env.VITE_API_KEY,
});

function RouteLayer() {
  const { alros, isSm } = useAlroContext();
  const { map, routeLayer } = useMapContext();

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
          stroke: new Stroke({ color: "red", width: 15 }),
        });
      },
    });
    const abortController = new AbortController();
    const sourceGeojson = routeLayer?.maplibreLayer?.mapLibreMap?.getSource(
      ROUTE_LAYER_SOURCE_ID,
    ) as GeoJSONSource;

    if (!map || !alros?.length) {
      return;
    }
    routingApi
      .route(
        {
          mot: "rail",
          //  @ts-expect-error - bad type definition
          prefagencies: "db",
          via:
            "!" +
            alros[0].alternativeRouteParts[0].from.evaNumber +
            "|!" +
            alros[0].alternativeRouteParts[
              alros[0].alternativeRouteParts.length - 1
            ].to.evaNumber,
        },
        { signal: abortController.signal },
      )
      .then((featureCollection: RoutingResponse) => {
        source.clear();
        if (featureCollection) {
          source.addFeatures(format.readFeatures(featureCollection));
          // layer.setMap(map);
          map.getView().cancelAnimations();
          map.getView().fit(source.getExtent(), {
            ...(isSm ? FIT_OPTIONS_SM : FIT_OPTIONS),
          });
          sourceGeojson?.setData(
            (featureCollection as GeoJSON.GeoJSON) || EMPTY_FEATURE_COLLECTION,
          );
          routeLayer?.setVisible(true);
        }
      });

    return () => {
      abortController.abort();
      source.clear();
      layer.setMap(null);
      sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
      routeLayer?.setVisible(false);
    };
  }, [map, alros, routeLayer?.maplibreLayer?.mapLibreMap, routeLayer]);
  return null;
}

export default RouteLayer;

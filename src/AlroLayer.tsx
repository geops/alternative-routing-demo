import { GeoJSONSource } from "maplibre-gl";
import { RoutingAPI } from "mobility-toolbox-js/ol";
import { RoutingResponse } from "mobility-toolbox-js/types";
import { GeoJSON } from "ol/format";
// import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
// import { Stroke, Style } from "ol/style";
// import randomColor from "randomcolor";
import { useEffect } from "react";

import {
  ALRO_LAYER_SOURCE_ID,
  EMPTY_FEATURE_COLLECTION,
  FIT_OPTIONS,
  FIT_OPTIONS_SM,
  STATIONS_HIGHLIGHT_LAYER_ID,
} from "./Constant";
import getColorFromAlroPart from "./getColorFromAlroPart";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";

const routingApi = new RoutingAPI({
  apiKey: import.meta.env.VITE_API_KEY,
});

function AlroLayer() {
  const { isSm, selectedAlro, selectedExample } = useAlroContext();
  const { alroLayer, map } = useMapContext();

  useEffect(() => {
    if (!selectedAlro || !selectedExample) {
      alroLayer?.setVisible(false);

      const sourceGeojson = alroLayer?.maplibreLayer?.mapLibreMap?.getSource(
        ALRO_LAYER_SOURCE_ID,
      ) as GeoJSONSource;
      sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
      return;
    }
  }, [selectedAlro, selectedExample, alroLayer]);

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
    //       stroke: new Stroke({ color: randomColor(), width: 5 }),
    //     });
    //   },
    // });
    const abortController = new AbortController();
    const stationIds: string[] = [];

    const sourceGeojson = alroLayer?.maplibreLayer?.mapLibreMap?.getSource(
      ALRO_LAYER_SOURCE_ID,
    ) as GeoJSONSource;

    if (!map || !selectedAlro) {
      return;
    }
    const abortControllers = selectedAlro?.alternativeRouteParts.map(() => {
      return new AbortController();
    });
    const promises = selectedAlro?.alternativeRouteParts.map((part) => {
      stationIds.push(part.from.evaNumber, part.to.evaNumber);
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
      responses = responses.map((response, index) => {
        const alroPart = selectedAlro?.alternativeRouteParts[index];
        const { category, line } =
          alroPart?.replacementTransports?.[0]?.line || {};
        // @ts-expect-error - bad type definition
        response.features[0].properties.color = getColorFromAlroPart(alroPart);
        // @ts-expect-error - bad type definition
        response.features[0].properties.icon = category || line;
        return response;
      });
      // @ts-expect-error - bad type definition
      const featureCollection = responses.reduce((acc, response) => {
        return {
          ...acc,
          // @ts-expect-error - bad type definition
          features: [...acc.features, ...response.features],
        };
      });
      source.clear();
      if (featureCollection) {
        const features = format.readFeatures(featureCollection);
        features?.forEach((feature) => {
          if (feature?.getGeometry()?.getType() === "LineString") {
            // featureCollection?.features?.push({
            //   geometry: {
            //     coordinates: toLonLat(
            //       (feature?.getGeometry() as LineString)?.getCoordinateAt(0.5),
            //     ),
            //     type: "Point",
            //   },
            //   properties: { icon: feature.get("icon") },
            //   type: "Feature",
            // });
          }
        });
        source.addFeatures(format.readFeatures(featureCollection));
        // layer.setMap(map);
        map.getView().cancelAnimations();
        map.getView().fit(source.getExtent(), {
          ...(isSm ? FIT_OPTIONS_SM : FIT_OPTIONS),
        });
        sourceGeojson?.setData(
          (featureCollection as GeoJSON.GeoJSON) || EMPTY_FEATURE_COLLECTION,
        );
        // console.log(stationIds);
        // Munchen tief bahnhof  8020348
        // Munchen tief bahnhof  8020348

        // stationIds.map((stationId) => {
        //   return ["==", "uic_ref", stationId];
        // }),

        alroLayer?.maplibreLayer?.mapLibreMap?.setFilter(
          STATIONS_HIGHLIGHT_LAYER_ID,
          [
            "any",
            // @ts-expect-error - bad type definition
            ...stationIds.map((stationId) => {
              let id = stationId;
              // Munchen tief bahnhof  8098263
              // Munchen GL.27-36 bahnhof  8098261
              if (id === "8098263" || id === "8098261") {
                id = "8000261";
              }
              return ["==", "uic_ref", id];
            }),
          ],
        );

        alroLayer?.setVisible(true);
      } else {
        sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
      }
    });

    return () => {
      abortControllers?.forEach((abortController) => {
        return abortController.abort();
      });
      source.clear();
      // layer.setMap(null);
    };
  }, [alroLayer, map, selectedAlro]);
  return null;
}

export default AlroLayer;

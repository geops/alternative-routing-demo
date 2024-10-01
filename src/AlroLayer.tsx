import { GeoJSONSource } from "maplibre-gl";
import { GeoJSONFeature } from "ol/format/GeoJSON";
import { useEffect } from "react";

import {
  ALRO_LAYER_SOURCE_ID,
  EMPTY_FEATURE_COLLECTION,
  STATIONS_HIGHLIGHT_LAYER_ID,
} from "./Constant";
import { getColorFromFeature } from "./getColorFromAlroPart";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";

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
    const stationIds: string[] = [];

    const sourceGeojson = alroLayer?.maplibreLayer?.mapLibreMap?.getSource(
      ALRO_LAYER_SOURCE_ID,
    ) as GeoJSONSource;

    if (!map || !selectedAlro) {
      return;
    }

    const { alternativeRouteParts, geom: featureCollection } = selectedAlro;

    if (sourceGeojson && featureCollection?.features?.length) {
      featureCollection.features.forEach((feature: GeoJSONFeature) => {
        if (feature.properties) {
          const { category, line } = feature.properties;
          // @ts-expect-error - bad type def
          feature.properties.color = getColorFromFeature(feature);
          feature.properties.icon = category || line;
        }
      });
      sourceGeojson.setData(featureCollection as GeoJSON.GeoJSON);

      alternativeRouteParts.forEach((part) => {
        stationIds.push(part.from.evaNumber, part.to.evaNumber);
      });

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
  }, [alroLayer, isSm, map, selectedAlro]);

  return null;
}

export default AlroLayer;

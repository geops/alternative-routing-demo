import { GeoJSONSource } from "maplibre-gl";
import { GeoJSONFeature } from "ol/format/GeoJSON";
import { memo, useEffect, useState } from "react";

import {
  ALRO_LAYER_SOURCE_ID,
  EMPTY_FEATURE_COLLECTION,
  STATIONS_HIGHLIGHT_LAYER_ID,
} from "./Constant";
import getColorFromAlroPart, {
  getColorFromFeature,
} from "./getColorFromAlroPart";
import getIconNameFromAlroPart, { getIconNameFromFeature } from "./getIconName";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import useRouting from "./hooks/useRouting";
import zoomOnFeatureCollection from "./zoomOnFeatureCollection";

function AlroLayer() {
  const { isSm, selectedAlro, selectedExample } = useAlroContext();
  const { alroLayer, map } = useMapContext();
  const [evaNummers, setEvaNummers] = useState<string[] | undefined>();
  const featureCollection = useRouting(evaNummers);

  useEffect(() => {
    if (!selectedAlro) {
      setEvaNummers(undefined);
      return;
    }

    let evaNummers = selectedAlro.alternativeRouteParts.flatMap((routePart) => {
      return ["!" + routePart.from.evaNumber, "!" + routePart.to.evaNumber];
    });
    evaNummers = [...new Set(evaNummers)];
    setEvaNummers(evaNummers);
  }, [selectedAlro]);

  useEffect(() => {
    if (!selectedAlro || !selectedExample) {
      alroLayer?.setVisible(false);

      const sourceGeojson = alroLayer?.maplibreLayer?.mapLibreMap?.getSource(
        ALRO_LAYER_SOURCE_ID,
      ) as GeoJSONSource;
      sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
      return;
    }
  }, [selectedAlro, selectedExample, alroLayer, map, isSm]);

  useEffect(() => {
    const stationIds: string[] = [];

    const sourceGeojson = alroLayer?.maplibreLayer?.mapLibreMap?.getSource(
      ALRO_LAYER_SOURCE_ID,
    ) as GeoJSONSource;

    if (!map || !selectedAlro) {
      return;
    }

    const { alternativeRouteParts } = selectedAlro;

    if (sourceGeojson && featureCollection?.features?.length) {
      featureCollection.features.forEach((feature: GeoJSONFeature) => {
        if (feature.properties) {
          const alroPart = alternativeRouteParts.find((part) => {
            return (
              // @ts-expect-error - we know
              part.from.evaNumber === feature.properties.station_from.id &&
              // @ts-expect-error - we know
              part.to.evaNumber === feature.properties.station_to.id
            );
          });
          if (alroPart) {
            feature.properties.color = getColorFromAlroPart(alroPart);
            feature.properties.icon = getIconNameFromAlroPart(alroPart);
          } else {
            // @ts-expect-error - we know
            feature.properties.color = getColorFromFeature(feature);
            feature.properties.icon = getIconNameFromFeature(feature);
          }
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
      zoomOnFeatureCollection(map, featureCollection, isSm);
    } else {
      sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
    }
  }, [alroLayer, isSm, map, selectedAlro, featureCollection]);

  return null;
}

export default memo(AlroLayer);

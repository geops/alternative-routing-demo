import { GeoJSONSource } from "maplibre-gl";
import { useEffect } from "react";

import { ALROS_LAYER_SOURCE_ID, EMPTY_FEATURE_COLLECTION } from "./Constant";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import zoomOnFeatureCollection from "./zoomOnFeatureCollection";

function AlrosLayer() {
  const { alros, isSm } = useAlroContext();
  const { alrosLayer, map } = useMapContext();

  useEffect(() => {
    const sourceGeojson = alrosLayer?.maplibreLayer?.mapLibreMap?.getSource(
      ALROS_LAYER_SOURCE_ID,
    ) as GeoJSONSource;
    if (!map || !alros?.length) {
      return;
    }

    const featureCollection = alros
      .map(({ geom }) => {
        return geom;
      })
      // @ts-expect-error - bad type definition
      .reduce((acc, response) => {
        const features = Array.isArray(acc?.features) ? acc.features : [];
        return {
          ...acc,
          features: [
            ...features,
            // @ts-expect-error - bad type definition
            ...(Array.isArray(response.features) ? response.features : []),
          ],
        };
      });
    if (sourceGeojson && featureCollection?.features?.length) {
      sourceGeojson?.setData(featureCollection as GeoJSON.GeoJSON);
      alrosLayer?.setVisible(true);
      zoomOnFeatureCollection(map, featureCollection, isSm);
    }

    return () => {
      alrosLayer?.setVisible(false);
      sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
    };
  }, [map, alros, alrosLayer?.maplibreLayer?.mapLibreMap, alrosLayer, isSm]);
  return null;
}

export default AlrosLayer;

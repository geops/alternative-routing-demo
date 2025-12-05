import { GeoJSONSource } from "maplibre-gl";
import { memo, useEffect, useState } from "react";

import { ALROS_LAYER_SOURCE_ID, EMPTY_FEATURE_COLLECTION } from "./Constant";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import useRouting from "./hooks/useRouting";
import zoomOnFeatureCollection from "./zoomOnFeatureCollection";

function AlrosLayer() {
  const { alros, isSm } = useAlroContext();
  const { alrosLayer, map } = useMapContext();
  const [evaNummers, setEvaNummers] = useState<string[][] | undefined>();
  const featureCollection = useRouting(evaNummers);

  useEffect(() => {
    if (!alros?.length) {
      setEvaNummers(undefined);
      return;
    }
    const evaNummers = alros.flatMap((alro) => {
      return alro.alternativeRouteParts.map((routePart) => {
        return ["!" + routePart.from.evaNumber, "!" + routePart.to.evaNumber];
      });
    });
    setEvaNummers(evaNummers);
  }, [alros]);

  useEffect(() => {
    const sourceGeojson = alrosLayer?.maplibreLayer?.mapLibreMap?.getSource(
      ALROS_LAYER_SOURCE_ID,
    ) as GeoJSONSource;
    if (!map || !alros?.length) {
      return;
    }

    // const featureCollection = alros
    //   // @ts-expect-error - bad type definition
    //   .map(({ geom }) => {
    //     return geom;
    //   })
    //   .reduce((acc, response) => {
    //     if (!response) {
    //       return {};
    //     }
    //     const features = Array.isArray(acc?.features) ? acc.features : [];
    //     return {
    //       ...acc,
    //       features: [
    //         ...features,
    //         ...(Array.isArray(response.features) ? response.features : []),
    //       ],
    //     };
    //   });
    if (sourceGeojson && featureCollection?.features?.length) {
      sourceGeojson?.setData(featureCollection as GeoJSON.GeoJSON);
      alrosLayer?.setVisible(true);
      zoomOnFeatureCollection(map, featureCollection, isSm);
    }

    return () => {
      alrosLayer?.setVisible(false);
      sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
    };
  }, [
    map,
    alros,
    alrosLayer?.maplibreLayer?.mapLibreMap,
    alrosLayer,
    isSm,
    featureCollection,
  ]);
  return null;
}

export default memo(AlrosLayer);

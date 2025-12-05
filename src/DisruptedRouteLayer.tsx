import { GeoJSONSource } from "maplibre-gl";
// import { RoutingAPI } from "mobility-toolbox-js/ol";
// import { RoutingResponse } from "mobility-toolbox-js/types";
import { GeoJSON } from "ol/format";
import VectorSource from "ol/source/Vector";
import { memo, useEffect, useState } from "react";

import {
  EMPTY_FEATURE_COLLECTION,
  FIT_OPTIONS,
  FIT_OPTIONS_SM,
  ROUTE_LAYER_SOURCE_ID,
} from "./Constant";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import useRouting from "./hooks/useRouting";
import { AlternativeRoutesResponse } from "./types";

const format = new GeoJSON({
  dataProjection: "EPSG:4326",
  featureProjection: "EPSG:3857",
});

/**
 * This layer display the disrupted route based on the selected example's disruption scenario.
 */
function DisruptedRouteLayer() {
  const { isSm, selectedExample } = useAlroContext();
  const { map, routeLayer } = useMapContext();

  const [evaNummers, setEvaNummers] = useState<string[] | undefined>();
  const featureCollection = useRouting(evaNummers);

  useEffect(() => {
    const alroResponse = selectedExample as AlternativeRoutesResponse;
    if (!alroResponse) {
      setEvaNummers(undefined);
      return;
    }
    const evaNummersByLine = // @ts-expect-error - bad type definition
      alroResponse.additionalInfo?.disruption_scenario?.lineDisruptions
        .slice(0, 1)
        .flatMap(
          // @ts-expect-error - bad type definition
          (lineDisruption) => {
            return (
              lineDisruption.disruptedLines
                // .slice(0, 1)
                // .slice(1, 2)
                // @ts-expect-error - bad type definition
                .flatMap((disruptedLine) => {
                  return (
                    disruptedLine.sections
                      // .filter((section) => {
                      //   return section.singleDirection === false;
                      // })
                      // @ts-expect-error - bad type definition

                      .map((section) => {
                        return [
                          "!" + section.fromEvaNumber,
                          "!" + section.toEvaNumber,
                        ];
                      })
                  );
                })
            );
          },
        );
    if (!evaNummersByLine?.length) {
      setEvaNummers(undefined);
      return;
    }
    setEvaNummers(evaNummersByLine);
  }, [selectedExample]);

  useEffect(() => {
    // const abortController = new AbortController();
    const sourceGeojson = routeLayer?.maplibreLayer?.mapLibreMap?.getSource(
      ROUTE_LAYER_SOURCE_ID,
    ) as GeoJSONSource;

    if (!map) {
      return;
    }
    if (featureCollection) {
      const extent = new VectorSource({
        features: format.readFeatures(featureCollection),
      }).getExtent();
      map.getView().cancelAnimations();
      map.getView().fit(extent, {
        ...(isSm ? FIT_OPTIONS_SM : FIT_OPTIONS),
      });
      sourceGeojson?.setData(
        (featureCollection as GeoJSON.GeoJSON) || EMPTY_FEATURE_COLLECTION,
      );
      routeLayer?.setVisible(true);
    }

    return () => {
      sourceGeojson?.setData(EMPTY_FEATURE_COLLECTION);
      routeLayer?.setVisible(false);
    };
  }, [
    map,
    routeLayer?.maplibreLayer?.mapLibreMap,
    routeLayer,
    isSm,
    featureCollection,
  ]);
  return null;
}

export default memo(DisruptedRouteLayer);

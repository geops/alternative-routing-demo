import { GeoJSON } from "ol/format";
import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
// @ts-expect-error - no type definition
import randomColor from "randomcolor";
import { useEffect } from "react";

import { FIT_OPTIONS, FIT_OPTIONS_SM } from "./Constant";
import useAlroContext, { AlroExample } from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import { AlternativeRoutesResponse } from "./types";

const apiKey = import.meta.env.VITE_API_KEY;

function AlroExampleLayer() {
  const { isSm, selectedExample, url } = useAlroContext();
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
          stroke: new Stroke({ color: randomColor(), width: 5 }),
        });
      },
    });
    const abortController = new AbortController();

    if (!map || !selectedExample) {
      return;
    }

    const uuid = (selectedExample as AlroExample)?.uuid;
    if (uuid) {
      fetch(url + "/api/alternatives/examples/" + uuid + "?format=geojson", {
        signal: abortController.signal,
      })
        .then((response) => {
          return response.json();
        })
        .then((featureCollection) => {
          source.clear();
          if (featureCollection?.features?.length > 0) {
            source.addFeatures(format.readFeatures(featureCollection));
            layer.setMap(map);
            map.getView().cancelAnimations();
            map.getView().fit(source.getExtent(), {
              ...(isSm ? FIT_OPTIONS_SM : FIT_OPTIONS),
            });
          }
        });
    } else {
      const evaNummers = (
        selectedExample as AlternativeRoutesResponse
      ).annotatedAlternativeRoutes.flatMap((alro) => {
        return alro.alternativeRouteParts.flatMap((routePart) => {
          return ["!" + routePart.from.evaNumber, "!" + routePart.to.evaNumber];
        });
      });
      if (evaNummers.length > 0) {
        fetch(
          `https://api.geops.io/routing/v1/?via=${evaNummers.join("|")}&mot=rail&resolve-hops=true&key=${apiKey}`,
        )
          .then((response) => {
            return response.json();
          })
          .then((featureCollection) => {
            source.clear();
            if (featureCollection?.features?.length > 0) {
              source.addFeatures(format.readFeatures(featureCollection));
              layer.setMap(map);
              map.getView().cancelAnimations();
              map.getView().fit(source.getExtent(), {
                ...(isSm ? FIT_OPTIONS_SM : FIT_OPTIONS),
              });
            }
          });
      }
    }
    return () => {
      abortController.abort();
      source.clear();
      layer.setMap(null);
    };
  }, [isSm, map, selectedExample, url]);
  return null;
}

export default AlroExampleLayer;

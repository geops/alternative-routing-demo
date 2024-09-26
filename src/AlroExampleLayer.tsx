import { GeoJSON } from "ol/format";
import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
// @ts-expect-error - no type definition
import randomColor from "randomcolor";
import { useEffect } from "react";

import { FIT_OPTIONS } from "./Constant";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";

function AlroExampleLayer() {
  const { selectedExample, setLoading, url } = useAlroContext();
  const { map } = useMapContext();

  useEffect(() => {
    const uuid = selectedExample?.uuid;
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

    if (!uuid || !map || !selectedExample) {
      return;
    }
    setLoading(true);
    fetch(
      url +
        "/api/alternatives/examples/" +
        selectedExample.uuid +
        "?format=geojson",
      { signal: abortController.signal },
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
          map.getView().fit(source.getExtent(), { ...FIT_OPTIONS });
        }
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      setLoading(false);
      abortController.abort();
      source.clear();
      layer.setMap(null);
    };
  }, [map, selectedExample, setLoading, url]);
  return null;
}

export default AlroExampleLayer;

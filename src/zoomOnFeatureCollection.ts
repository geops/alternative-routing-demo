import { Map } from "ol";
import { GeoJSON } from "ol/format";
import VectorSource from "ol/source/Vector";

import { FIT_OPTIONS, FIT_OPTIONS_SM } from "./Constant";

const format = new GeoJSON({
  dataProjection: "EPSG:4326",
  featureProjection: "EPSG:3857",
});

export function zoomOnFeature(
  map?: Map,
  feature?: GeoJSON.Feature,
  isSm: boolean = false,
) {
  if (!map || !feature) {
    return;
  }
  return zoomOnFeatureCollection(
    map,
    {
      features: [feature],
      type: "FeatureCollection",
    },
    isSm,
  );
}
function zoomOnFeatureCollection(
  map?: Map,
  featureCollection?: GeoJSON.FeatureCollection,
  isSm: boolean = false,
) {
  if (!map || !featureCollection) {
    return;
  }
  const source = new VectorSource();
  source.addFeatures(format.readFeatures(featureCollection));
  map.getView().cancelAnimations();
  map.getView().fit(source.getExtent(), {
    ...(isSm ? FIT_OPTIONS_SM : FIT_OPTIONS),
  });
}

export default zoomOnFeatureCollection;

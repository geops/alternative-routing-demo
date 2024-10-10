import { GeoJSONFeature } from "ol/format/GeoJSON";

import { imagesByCategory } from "./Constant";
import { AlternativeRoutePart } from "./types";

/**
 * Get the icon name from a alro feature.
 *
 * @param alroPart
 * @param map
 */
export function getIconNameFromFeature(feature: GeoJSONFeature) {
  const { category, line, mot } = feature?.properties || {};
  let icon = category || line;
  const imgSrc = imagesByCategory[icon];
  if (!imgSrc) {
    icon = mot;
  }
  console.log(icon);
  return icon;
}
/**
 * Get th icon name of the alroPart.
 *
 * @param alroPart
 * @param map
 */
function getIconNameFromAlroPart(alroPart: AlternativeRoutePart) {
  const { type } = alroPart?.replacementTransports?.[0] || {};
  const { category, line } = alroPart?.replacementTransports?.[0]?.line || {};
  let icon = category || line;
  // @ts-expect-error - bad types
  const imgSrc = imagesByCategory[icon];
  console.log("icon", icon, imgSrc, type);
  if (!imgSrc) {
    icon = type.toLowerCase();
  }
  return icon;
}

/**
 * Add the image to the mapbox map from the alroPart
 *
 * @param alroPart
 * @param map
 */
export const addImageFromAlroPart = (
  alroPart: AlternativeRoutePart,
  mbMap?: maplibregl.Map,
) => {
  if (!mbMap) {
    return;
  }

  const icon = getIconNameFromAlroPart(alroPart);

  if (icon && mbMap && !mbMap.getImage(icon)) {
    const img = document.createElement("img");
    img.src = "/images/io/" + imagesByCategory[icon];
    img.onload = () => {
      if (!mbMap.getImage(icon)) {
        mbMap.addImage(icon, img);
      }
    };
  }
};

export default getIconNameFromAlroPart;

import { GeoJSONFeature } from "ol/format/GeoJSON";

import { imagesByCategory, typeToMot } from "./Constant";
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
  let imgSrc = imagesByCategory[icon];
  if (!imgSrc && mot) {
    icon = mot;
  }

  imgSrc = imagesByCategory[icon];

  if (!imgSrc) {
    icon = "default";
  }
  return icon;
}

/**
 * Get th icon name of the alroPart.
 *
 * @param alroPart
 * @param map
 */
function getIconNameFromAlroPart(alroPart: AlternativeRoutePart) {
  // @ts-expect-error - mot doesn't exist yet
  const { mot, type } = alroPart?.replacementTransports?.[0] || {};
  const { category, line } = alroPart?.replacementTransports?.[0]?.line || {};
  let icon = category || line;
  // @ts-expect-error - bad types
  let imgSrc = imagesByCategory[icon];
  if (!imgSrc && type) {
    icon = typeToMot[type];
  }

  // @ts-expect-error - bad types
  imgSrc = imagesByCategory[icon];

  if (!imgSrc && mot) {
    icon = mot;
  }

  if (!imgSrc) {
    icon = "default";
  }

  return icon;
}

/**
 * Add the image to the mapbox map from the alroPart
 *
 * @param alroPart
 * @param map
 */
export function addImageFromAlroPart(
  alroPart: AlternativeRoutePart,
  mbMap?: maplibregl.Map,
) {
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
}

export default getIconNameFromAlroPart;

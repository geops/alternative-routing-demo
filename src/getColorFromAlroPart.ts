import { colorsByCategory } from "./Constant";
import { AlternativeRoutePart } from "./types";

function getColorFromObject(obj?: {
  category?: null | string;
  line: string;
}): string {
  const { category, line } = obj || {};
  const color =
    (category && colorsByCategory[category]) ||
    (line && colorsByCategory[line]) ||
    "#fce3b4";
  return color;
}

function getColorFromAlroPart(part: AlternativeRoutePart): string {
  return getColorFromObject(
    part?.replacementTransports?.[0]?.line || undefined,
  );
}

export function getColorFromFeature(feature: {
  properties: {
    category: string;
    line: string;
  };
}): string {
  return getColorFromObject(feature.properties);
}
export default getColorFromAlroPart;

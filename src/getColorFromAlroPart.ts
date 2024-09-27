import { colorsByCategory } from "./Constant";
import { AlternativeRoutePart } from "./types";

function getColorFromAlroPart(part: AlternativeRoutePart): string {
  const { category, line } = part?.replacementTransports?.[0]?.line || {};
  const color =
    (category && colorsByCategory[category]) ||
    (line && colorsByCategory[line]) ||
    "#fce3b4";
  return color;
}
export default getColorFromAlroPart;

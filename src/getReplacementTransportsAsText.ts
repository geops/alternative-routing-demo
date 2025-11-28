import { AnnotatedAlternativeRoutes } from "./types";

function getReplacementTransportsAsText(
  replacementTransports: AnnotatedAlternativeRoutes["alternativeRouteParts"][number]["replacementTransports"],
) {
  const replacementTransportsTexts = replacementTransports.map(
    (replacementTransport) => {
      return (
        (replacementTransport.line?.category || "") +
        " " +
        (replacementTransport.line?.line || "")
      );
    },
  );

  const replacementTransportsAsText = [...new Set(replacementTransportsTexts)]
    .sort()
    .join(", ");
  return replacementTransportsAsText;
}

export default getReplacementTransportsAsText;

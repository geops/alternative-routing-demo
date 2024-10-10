import { MouseEvent as ReactMouseEvent } from "react";

import getColorFromAlroPart from "./getColorFromAlroPart";
import { addImageFromAlroPart } from "./getIconName";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import { AlternativeRoutePart, AnnotatedAlternativeRoutes } from "./types";
import { Button } from "./ui/button";
import { zoomOnFeature } from "./zoomOnFeatureCollection";

function AlroPartsSchema({ alro }: { alro: AnnotatedAlternativeRoutes }) {
  const { baseLayer, map } = useMapContext();
  const { isSm, selectedAlro, setSelectedAlro } = useAlroContext();
  let parts: AlternativeRoutePart[] = alro.alternativeRouteParts;
  let totalTimeIntravel = 0;
  parts = parts.map((part) => {
    const { begin, end } = part.replacementTransports[0];
    if (begin && end) {
      const time = Math.floor(
        (new Date(end).getTime() - new Date(begin).getTime()) / 1000,
      );
      totalTimeIntravel += time;
      return {
        ...part,
        time,
      };
    }
    return part;
  });

  return (
    <div className="my-2 flex w-full items-center gap-0.5">
      {parts.map((part, index) => {
        // @ts-expect-error time has bee added temporarly
        const { time } = part;
        const { category, line } = part?.replacementTransports?.[0]?.line || {};
        const color = getColorFromAlroPart(part);
        const percent = (time * 100) / totalTimeIntravel;
        const text = `${category || ""} ${line || ""}`;

        addImageFromAlroPart(part, baseLayer?.mapLibreMap);

        return (
          <Button
            className="flex h-8 cursor-pointer items-center justify-center overflow-hidden rounded-md border-4 bg-white font-bold"
            key={part.from.evaNumber}
            onClick={(evt: ReactMouseEvent<HTMLButtonElement>) => {
              const feature = alro?.geom?.features?.[index];
              if (feature) {
                if (selectedAlro === alro) {
                  zoomOnFeature(map, feature, isSm);
                } else {
                  setSelectedAlro(alro);
                  zoomOnFeature(map, feature, isSm);
                }
                evt.preventDefault();
              }
            }}
            outline
            style={{
              borderColor: color,
              color,
              width: `${percent}%`,
            }}
            title={`${text || ""}`}
          >
            <div className="overflow-hidden text-ellipsis text-nowrap">
              {text}
            </div>
          </Button>
        );
      })}
    </div>
  );
}

export default AlroPartsSchema;

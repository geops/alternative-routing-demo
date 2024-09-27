import getColorFromAlroPart from "./getColorFromAlroPart";
import { AlternativeRoutePart, AnnotatedAlternativeRoutes } from "./types";

function AlroPartsSchema({ alro }: { alro: AnnotatedAlternativeRoutes }) {
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
      {parts.map((part) => {
        // @ts-expect-error time has bee added temporarly
        const { time } = part;
        const { category, line } = part?.replacementTransports?.[0]?.line || {};
        const color = getColorFromAlroPart(part);
        const percent = (time * 100) / totalTimeIntravel;
        const text = `${category || ""} ${line || ""}`;
        return (
          <div
            className="flex h-8 items-center justify-center overflow-hidden rounded-md border-4 bg-white font-bold"
            key={part.from.evaNumber}
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
          </div>
        );
      })}
    </div>
  );
}

export default AlroPartsSchema;

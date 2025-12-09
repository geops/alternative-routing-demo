import { memo } from "react";

import getDateString, { getHoursString } from "./getDateString";
import useAlroContext from "./hooks/useAlroContext";

function DisruptedRoute(props: JSX.IntrinsicElements["div"]) {
  const { selectedExample } = useAlroContext();
  let timeIntervalsText;
  const addInfo = selectedExample?.additionalInfo;
  const label = [
    ((addInfo?.requested_stops as string[])?.[0] as string) || "",
    ((addInfo?.requested_stops as string[])?.[
      (addInfo?.requested_stops as string[]).length - 1
    ] as string) || "",
  ].join(" → ");

  const timeIntervals = // @ts-expect-error - we know
    addInfo.disruption_scenario.lineDisruptions[0].timeIntervals[0];

  const begin = getDateString(timeIntervals?.begin);
  const end = getDateString(timeIntervals?.end);
  if (begin == end) {
    timeIntervalsText = `on ${begin} from ${getHoursString(
      timeIntervals?.begin,
    )} to ${getHoursString(timeIntervals?.end)}`;
  } else {
    timeIntervalsText = `from ${begin} to ${end})`;
  }

  // const linesNames = // @ts-expect-error - we know
  //   addInfo?.disruption_scenario.lineDisruptions.flatMap(
  //     // @ts-expect-error - we know
  //     (lineDisruption) => {
  //       // @ts-expect-error - we know
  //       return lineDisruption.disruptedLines.map((disruptedLine) => {
  //         const relation = disruptedLine.lineRelation;
  //         return relation.category + " " + relation.line;
  //       });
  //     },
  //   );

  const disruptedLines: {
    lineRelation: { category: string; line: string };
    sections: { fromName: string; toName: string }[];
  }[] = // @ts-expect-error - we know
    addInfo?.disruption_scenario.lineDisruptions.flatMap(
      // @ts-expect-error - we know
      (lineDisruption) => {
        return lineDisruption.disruptedLines;
      },
    ) || [];
  // const affectedLines = [...new Set(linesNames)].sort(); // unique

  // // @ts-expect-error - we know
  // const stopsNames = addInfo?.disruption_scenario.lineDisruptions.flatMap(
  //   // @ts-expect-error - we know
  //   (lineDisruption) => {
  //     return lineDisruption.disruptedLines.flatMap(
  //       // @ts-expect-error - we know
  //       (disruptedLine) => {
  //         const sections = disruptedLine.sections;
  //         // @ts-expect-error - we know
  //         return sections.flatMap((section) => {
  //           return [section.fromName || undefined, section.toName || undefined];
  //         });
  //       },
  //     );
  //   },
  // );

  // const affectedStops = [
  //   ...new Set(
  //     stopsNames.filter((s?: string) => {
  //       return !!s;
  //     }),
  //   ),
  // ].sort(); // unique

  return (
    <div {...props}>
      <div className="overflow-hidden text-ellipsis font-bold">{label}</div>
      <div className="text-xs">{timeIntervalsText}</div>
      <div className="text-xs">
        <span className="font-semibold">Requested stops:</span>{" "}
        {/* @ts-expect-error - we know */}
        {addInfo?.requested_stops?.join(", ") || ""}
      </div>
      {disruptedLines?.map(({ lineRelation: { category, line }, sections }) => {
        const stopsNames = sections.flatMap((section) => {
          return [section.fromName || "", section.toName || ""];
        });
        // const affectedStops = [...new Set(stopsNames)].sort(); // unique

        return (
          <div className="text-xs" key={category + line}>
            <span className="font-semibold">
              Affected: {category || ""} {line || ""}
            </span>
            {" > "}
            {stopsNames.join(" - ")}
          </div>
        );
      })}
    </div>
  );
}

export default memo(DisruptedRoute);

import { memo } from "react";

import getDateString, { getHoursString } from "./getDateString";
import useAlroContext from "./hooks/useAlroContext";

function DisruptedRoute(props: JSX.IntrinsicElements["div"]) {
  const { selectedExample } = useAlroContext();
  let timeIntervalsText;
  const addInfo = selectedExample?.additionalInfo;
  const label = [
    addInfo?.requested_stops[0],
    addInfo?.requested_stops[addInfo?.requested_stops.length - 1],
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

  const linesNames = // @ts-expect-error - we know
    addInfo?.disruption_scenario.lineDisruptions.flatMap(
      // @ts-expect-error - we know
      (lineDisruption) => {
        // @ts-expect-error - we know
        return lineDisruption.disruptedLines.map((disruptedLine) => {
          const relation = disruptedLine.lineRelation;
          return relation.category + " " + relation.line;
        });
      },
    );

  const lines = [...new Set(linesNames)].sort(); // unique
  const affectedLinesText = `Affected lines: ${lines.join(", ")}`;

  // @ts-expect-error - we know
  const stopsNames = addInfo?.disruption_scenario.lineDisruptions.flatMap(
    // @ts-expect-error - we know
    (lineDisruption) => {
      return lineDisruption.disruptedLines.flatMap(
        // @ts-expect-error - we know
        (disruptedLine) => {
          const sections = disruptedLine.sections;
          // @ts-expect-error - we know
          return sections.flatMap((section) => {
            return [section.fromName || undefined, section.toName || undefined];
          });
        },
      );
    },
  );

  const stops = [
    ...new Set(
      stopsNames.filter((s?: string) => {
        return !!s;
      }),
    ),
  ].sort(); // unique
  const affectedStopsText = `Affected stops: ${stops.join(", ")}`;

  // @ts-expect-error - we know
  const requestedStopsText = `Requested stops: ${(addInfo?.requested_stops || []).join(", ")}`;
  return (
    <div {...props}>
      <div className="overflow-hidden text-ellipsis font-bold">{label}</div>
      <div className="text-xs">{timeIntervalsText}</div>
      <div className="text-xs">{requestedStopsText}</div>
      <div className="text-xs">{affectedLinesText}</div>
      {!!stops?.length && <div className="text-xs">{affectedStopsText}</div>}
    </div>
  );
}

export default memo(DisruptedRoute);

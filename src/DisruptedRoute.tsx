import { memo } from "react";

import getDateString, { getHoursString } from "./getDateString";
import useAlroContext from "./hooks/useAlroContext";

function DisruptedRoute(props: JSX.IntrinsicElements["div"]) {
  const { selectedExample } = useAlroContext();
  let timeIntervalsText;
  const addInfo = selectedExample?.additionalInfo;
  // @ts-expect-error - bad type defintions
  const label = addInfo?.requested_stops.join(" → ");

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

  const lines = [...new Set(linesNames)]; // unique
  const affectedLinesText = `Affected lines: ${lines.join(", ")}`;
  return (
    <div {...props}>
      <div className="overflow-hidden text-ellipsis font-bold">{label}</div>
      <div className="text-xs">{timeIntervalsText}</div>
      <div className="text-xs">{affectedLinesText}</div>
    </div>
  );
}

export default memo(DisruptedRoute);

import getDateString, { getHoursString } from "./getDateString";
import useAlroContext, { AlroExample } from "./hooks/useAlroContext";
import { AlternativeRoutesResponse } from "./types";
import { Field, Label } from "./ui/fieldset";
import { Listbox, ListboxLabel, ListboxOption } from "./ui/listbox";

let timeout: number;

function AlroExamplesField(props: JSX.IntrinsicElements["div"]) {
  const { examples, setLoading, setSelectedAlro, setSelectedExample } =
    useAlroContext();

  if (!((examples.length || 0) > 0)) {
    return null;
  }

  return (
    <Field {...props}>
      <Label className="">
        <h1 className="text-xs font-light">DB Challenge</h1>
        <h2 className="font-bold">Alternative Routing</h2>
      </Label>
      <Listbox
        onChange={(value: AlroExample | AlternativeRoutesResponse) => {
          if (value) {
            clearTimeout(timeout);
            setLoading(true);
            setSelectedAlro();
            setSelectedExample(value);

            timeout = setTimeout(() => {
              setLoading(false);
            }, 2000);
          }
        }}
        placeholder="Choose disruption ..."
      >
        {examples.map((example) => {
          const value = example;
          let label = (example as AlroExample)?.name;
          let timeIntervalsText;
          let affectedLinesText;
          // let affectedStopsText;
          if (!label) {
            const addInfo = (example as AlternativeRoutesResponse)
              ?.additionalInfo;
            // @ts-expect-error - we know
            label = addInfo?.requested_stops.join(" → ");

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
            affectedLinesText = `Affected lines: ${lines.join(", ")}`;

            // const stopsNames =
            //   addInfo?.disruption_scenario.lineDisruptions.flatMap(
            //     // @ts-expect-error - we know
            //     (lineDisruption) => {
            //       return lineDisruption.disruptedLines.flatMap(
            //         // @ts-expect-error - we know
            //         (disruptedLine) => {
            //           const sections = disruptedLine.sections;
            //           // @ts-expect-error - we know
            //           return sections.map((section) => {
            //             return [section.fromEvaNumber, section.toEvaNumber];
            //           });
            //         },
            //       );
            //     },
            //   );

            // const stops = [...new Set(stopsNames)]; // unique
            // affectedStopsText = `Affected stops: ${stops.join(", ")}`;
          }
          return (
            <ListboxOption key={label} value={value}>
              <ListboxLabel className="cursor-pointer">
                <div className="overflow-hidden text-ellipsis font-bold">
                  {label}
                </div>
                <div className="text-xs">{timeIntervalsText}</div>
                <div className="text-xs">{affectedLinesText}</div>
                {/* <div className="w-full flex-wrap text-xs">
                  {affectedStopsText}
                </div> */}
              </ListboxLabel>
            </ListboxOption>
          );
        })}
      </Listbox>
    </Field>
  );
}

export default AlroExamplesField;

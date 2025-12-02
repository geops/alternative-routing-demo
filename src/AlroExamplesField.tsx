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
        placeholder="Störung wählen ..."
      >
        {examples.map((example) => {
          const value = example;
          let label = (example as AlroExample)?.name;
          let timeIntervalsText;
          let affectedLinesText;
          if (!label) {
            const addInfo = // @ts-expect-error - we know
              (example as AlternativeRoutesResponse)?.additionalInfo;
            label = addInfo?.requested_stops.join(" → ");

            const timeIntervals =
              addInfo.disruption_scenario.lineDisruptions[0].timeIntervals[0];

            const begin = getDateString(timeIntervals?.begin);
            const end = getDateString(timeIntervals?.end);
            if (begin == end) {
              timeIntervalsText = `der ${begin} vom ${getHoursString(
                timeIntervals?.begin,
              )} bis ${getHoursString(timeIntervals?.end)}`;
            } else {
              timeIntervalsText = `vom ${begin} bis ${end})`;
            }

            const lineRelations =
              addInfo?.disruption_scenario.lineDisruptions.flatMap(
                // @ts-expect-error - we know
                (lineDisruption) => {
                  // @ts-expect-error - we know
                  return lineDisruption.disruptedLines.map((disruptedLine) => {
                    return disruptedLine.lineRelation;
                  });
                },
              );

            const lines = [
              ...new Set( // @ts-expect-error - we know
                lineRelations.map((relation) => {
                  return relation.category + " " + relation.line;
                }),
              ),
            ];
            affectedLinesText = `Betroffene Linien: ${lines.join(", ")}`;
          }
          return (
            <ListboxOption key={label} value={value}>
              <ListboxLabel className="cursor-pointer">
                <div className="overflow-hidden text-ellipsis font-bold">
                  {label}
                </div>
                <div className="text-xs">{timeIntervalsText}</div>
                <div className="text-xs">{affectedLinesText}</div>
              </ListboxLabel>
            </ListboxOption>
          );
        })}
      </Listbox>
    </Field>
  );
}

export default AlroExamplesField;

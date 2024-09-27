import useAlroContext from "./hooks/useAlroContext";
import { Field, Label } from "./ui/fieldset";
import { Listbox, ListboxLabel, ListboxOption } from "./ui/listbox";

let timeout: number;

function AlroExamplesField(props: JSX.IntrinsicElements["div"]) {
  const { examples, setLoading, setSelectedExample } = useAlroContext();

  if (!((examples.length || 0) > 1)) {
    return null;
  }

  return (
    <Field {...props}>
      <Label className="flex items-center">
        DB Challenge Alternative Routing
      </Label>
      <Listbox
        className=""
        onChange={(value) => {
          const found = examples.find(({ uuid }) => {
            return uuid === value;
          });
          if (found) {
            clearTimeout(timeout);
            setLoading(true);
            setSelectedExample(found);

            timeout = setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        }}
        placeholder="Select a disruption ..."
      >
        {examples.map(({ name, uuid }) => {
          return (
            <ListboxOption key={uuid} value={uuid}>
              <ListboxLabel className="cursor-pointer border-l-4 border-[#ff7a00] pl-2">
                <div className="font-bold">{name}</div>
                <div className="text-xs">
                  Streckenstörung &gt; Reparatur Strecke [38]<br></br>
                  Massive Beeinträchtigung
                </div>
              </ListboxLabel>
            </ListboxOption>
          );
        })}
      </Listbox>
      {/* <Select
        onChange={(evt) => {
          const found = examples.find(({ uuid }) => {
            return uuid === evt.target.value;
          });
          if (found) {
            clearTimeout(timeout);
            setLoading(true);

            timeout = setTimeout(() => {
              setSelectedExample(found);
              setLoading(false);
            }, 4000);
          }
        }}
      >
        <option value="">Select an example</option>
        {examples.map(({ name, uuid }) => {
          return (
            <option key={uuid} value={uuid}>
              {name}
            </option>
          );
        })}
      </Select> */}
    </Field>
  );
}

export default AlroExamplesField;

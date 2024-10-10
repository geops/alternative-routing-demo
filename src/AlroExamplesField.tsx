import useAlroContext from "./hooks/useAlroContext";
import { Field, Label } from "./ui/fieldset";
import { Listbox, ListboxLabel, ListboxOption } from "./ui/listbox";

let timeout: number;

function AlroExamplesField(props: JSX.IntrinsicElements["div"]) {
  const { examples, setLoading, setSelectedAlro, setSelectedExample } =
    useAlroContext();

  if (!((examples.length || 0) > 1)) {
    return null;
  }

  return (
    <Field {...props}>
      <Label className="">
        <h1 className="text-xs font-light">DB Challenge</h1>
        <h2 className="font-bold">Alternative Routing</h2>
      </Label>
      <Listbox
        onChange={(value) => {
          const found = examples.find(({ uuid }) => {
            return uuid === value;
          });
          if (found) {
            clearTimeout(timeout);
            setLoading(true);
            setSelectedAlro();
            setSelectedExample(found);

            timeout = setTimeout(() => {
              setLoading(false);
            }, 2000);
          }
        }}
        placeholder="Störung wählen ..."
      >
        {examples.map(({ name, uuid }) => {
          return (
            <ListboxOption key={uuid} value={uuid}>
              <ListboxLabel className="cursor-pointer">
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

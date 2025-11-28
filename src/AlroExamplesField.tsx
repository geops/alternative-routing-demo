import useAlroContext, { AlroExample } from "./hooks/useAlroContext";
import { AlternativeRoutesResponse } from "./types";
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
          if (!label) {
            const routeParts =
              (example as AlternativeRoutesResponse)
                .annotatedAlternativeRoutes?.[0]?.alternativeRouteParts || [];
            const firstRoutePart = routeParts[0];
            const lastRoutePart = routeParts[routeParts.length - 1];
            if (firstRoutePart && lastRoutePart) {
              label = firstRoutePart.from.name + " → " + lastRoutePart.to.name;
            }
          }
          return (
            <ListboxOption key={label} value={value}>
              <ListboxLabel className="cursor-pointer">
                <div className="font-bold">{label}</div>
                <div className="text-xs">
                  Streckenstörung &gt; Reparatur Strecke [38]<br></br>
                  Massive Beeinträchtigung
                </div>
              </ListboxLabel>
            </ListboxOption>
          );
        })}
      </Listbox>
    </Field>
  );
}

export default AlroExamplesField;

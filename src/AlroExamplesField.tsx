import useAlroContext from "./hooks/useAlroContext";
import Loading from "./Loading";
import { Field, Label } from "./ui/fieldset";
import { Select } from "./ui/select";

function AlroExamplesField(props: JSX.IntrinsicElements["div"]) {
  const { examples, isLoading, setSelectedExample } = useAlroContext();

  if (!((examples.length || 0) > 1)) {
    return null;
  }

  return (
    <Field {...props}>
      <Label className="flex items-center">
        Choose an example: {isLoading ? <Loading /> : ""}
      </Label>
      <Select
        onChange={(evt) => {
          const found = examples.find(({ uuid }) => {
            return uuid === evt.target.value;
          });
          if (found) {
            setSelectedExample(found);
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
      </Select>
    </Field>
  );
}

export default AlroExamplesField;

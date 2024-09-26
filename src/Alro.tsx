import useAlroContext from "./hooks/useAlroContext";
import { AnnotatedAlternativeRoutes } from "./types";
import { Button } from "./ui/button";

function Alro({
  alro,
  ...props
}: { alro: AnnotatedAlternativeRoutes } & JSX.IntrinsicElements["div"]) {
  const { setSelectedAlro } = useAlroContext();
  const { alternativeRouteParts, estimatedTravelTime = 0 } = alro;
  const hours = Math.floor((estimatedTravelTime || 0) / 3600);
  const minutes = Math.floor(((estimatedTravelTime || 0) % 3600) / 60);
  return (
    <div {...props}>
      {alternativeRouteParts[0].from.name} -&gt;{" "}
      {alternativeRouteParts[alternativeRouteParts.length - 1].to.name}
      <div>
        Duration: {hours ? hours + "h " : ""}
        {minutes ? minutes + "min" : ""}
      </div>
      <div>Interval: {alro.intervals}</div>
      <Button
        onClick={() => {
          return setSelectedAlro(alro);
        }}
      >
        Show me
      </Button>
    </div>
  );
}
export default Alro;

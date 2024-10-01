import { Fragment } from "react";

import AlroPartsSchema from "./AlroPartsSchema";
import useAlroContext from "./hooks/useAlroContext";
import { AnnotatedAlternativeRoutes } from "./types";
import { Button } from "./ui/button";

function Alro({
  alro,
  ...props
}: { alro: AnnotatedAlternativeRoutes } & JSX.IntrinsicElements["button"]) {
  const { selectedAlro, setSelectedAlro } = useAlroContext();
  const { alternativeRouteParts, estimatedTravelTime = 0 } = alro;
  const hours = Math.floor((estimatedTravelTime || 0) / 3600);
  const minutes = Math.floor(((estimatedTravelTime || 0) % 3600) / 60);
  const texts = alternativeRouteParts.map((part) => {
    // console.log(part.replacementTransports[0].line?.category);
    return `${part.replacementTransports[0].line?.category || ""} ${part.from.name} – ${part.to.name}`;
  });
  const everyHours = Math.floor((alro.headway || 0) / 3600);
  const everyMinutes = Math.floor(((alro.headway || 0) % 3600) / 60);
  const everyText =
    everyHours || everyMinutes
      ? "every " +
        (everyHours ? `${everyHours}h` : "") +
        (everyMinutes ? `${everyMinutes}min` : "")
      : "";
  return (
    <>
      {/* @ts-expect-error - no idea */}
      <Button
        outline
        plain
        {...props}
        onClick={() => {
          console.log("click", selectedAlro === alro, alro);
          if (selectedAlro === alro) {
            setSelectedAlro();
          } else {
            setSelectedAlro(alro);
          }
        }}
      >
        <div className="w-full">
          <p className="font-bold">
            {texts.map((text, index) => {
              return (
                <Fragment key={text}>
                  {text} {index !== texts.length - 1 ? <br></br> : null}
                </Fragment>
              );
            })}
          </p>
          <p className="text-sm font-normal">
            {[alro.intervals, everyText]
              .filter((val) => {
                return !!val;
              })
              .join(", ")}
          </p>
          <p className="text-sm font-normal">
            Dauer: {hours ? hours + "h " : ""}
            {minutes ? minutes + "min" : ""}
          </p>
          <AlroPartsSchema alro={alro}></AlroPartsSchema>
        </div>
      </Button>
    </>
  );
}
export default Alro;

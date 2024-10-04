import { Fragment } from "react";

import AlroPartsSchema from "./AlroPartsSchema";
import getColorFromAlroPart from "./getColorFromAlroPart";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
import { AnnotatedAlternativeRoutes } from "./types";
import { Button } from "./ui/button";
import zoomOnFeatureCollection from "./zoomOnFeatureCollection";

function Alro({
  alro,
  ...props
}: { alro: AnnotatedAlternativeRoutes } & JSX.IntrinsicElements["button"]) {
  const { isSm, selectedAlro, setSelectedAlro } = useAlroContext();
  const { map } = useMapContext();
  const { alternativeRouteParts, estimatedTravelTime = 0 } = alro;
  const hours = Math.floor((estimatedTravelTime || 0) / 3600);
  const minutes = Math.floor(((estimatedTravelTime || 0) % 3600) / 60);
  const texts = alternativeRouteParts.map((part) => {
    // console.log(part.replacementTransports[0].line?.category);
    return (
      <>
        <span style={{ color: getColorFromAlroPart(part) }}>
          {part.replacementTransports[0].line?.category || ""}{" "}
          {part.replacementTransports[0].line?.line || ""}{" "}
        </span>
        <span>
          {part.from.name} – {part.to.name}
        </span>
      </>
    );
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
          if (selectedAlro === alro) {
            setSelectedAlro();
          } else {
            setSelectedAlro(alro);
            // @ts-expect-error - ignore deprecated
            zoomOnFeatureCollection(map, alro.geom, isSm);
          }
        }}
      >
        <div className="w-full">
          <p className="font-bold">
            {texts.map((text, index) => {
              return (
                <Fragment>
                  {text} {index !== texts.length - 1 ? <br></br> : null}
                </Fragment>
              );
            })}
          </p>
          <p className="text-xs font-normal">
            {[alro.intervals, everyText]
              .filter((val) => {
                return !!val;
              })
              .join(", ")}
          </p>
          <p className="text-xs font-normal">
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

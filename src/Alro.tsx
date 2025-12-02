import { Fragment } from "react";

import AlroPartsSchema from "./AlroPartsSchema";
import getColorFromAlroPart from "./getColorFromAlroPart";
import getReplacementTransportsAsText from "./getReplacementTransportsAsText";
import useAlroContext from "./hooks/useAlroContext";
import useMapContext from "./hooks/useMapContext";
// import { alroLayer } from "./layers";
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
    return (
      <>
        <span
          style={{ color: getColorFromAlroPart(part) }}
          title={getReplacementTransportsAsText(part.replacementTransports)}
        >
          {part.replacementTransports[0].line?.category || ""}{" "}
          {part.replacementTransports[0].line?.line || ""}{" "}
        </span>
        <span>
          {part.from.name} – {part.to.name}
        </span>
      </>
    );
  });
  const headwayDetails: string[] =
    // @ts-expect-error - we know
    alro.headwayDetails?.map(
      // @ts-expect-error - we know
      ({ headway, interval }) => {
        const everyHours = Math.floor((headway || 0) / 3600);
        const everyMinutes = Math.floor(((headway || 0) % 3600) / 60);
        const everyText =
          everyHours || everyMinutes
            ? "every " +
              (everyHours ? `${everyHours}h` : "") +
              (everyMinutes ? `${everyMinutes}min` : "")
            : "";
        return interval + ", " + everyText;
      },
    ) || [];

  let affectedStopsText: string | undefined;
  let nbMMatchedStopsProRoute: string | undefined;
  let nbRoutes: string | undefined;
  let priority: string | undefined;
  // @ts-expect-error - we know
  const addInfo = alro.additionalInfo;
  if (addInfo) {
    const coveredStops = addInfo.covered_stops.join(", ");
    if (coveredStops) {
      affectedStopsText = `Affected stops: ${coveredStops}`;
    }
    if (addInfo.number_of_matched_stops_per_route) {
      nbMMatchedStopsProRoute = `Nr. covered stops (pro journey): ${addInfo.number_of_matched_stops_per_route}`;
    }
    if (addInfo.number_of_routes) {
      nbRoutes = `Nr. journey: ${addInfo.number_of_routes}`;
    }
    if (addInfo.priority) {
      priority = `Priority: ${addInfo.priority}`;
    }
  }

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
            // console.log("zooming to alro", alro);
            // const features = alroLayer.getSource().getFeatures();
            // features.filter((feature) => {
            //   const stationFrom = feature.get("stationFrom");
            //   const stationTo = feature.get("stationTo");
            //   return false;
            // });
            // const source
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

          {headwayDetails.map((val: string) => {
            return <p className="text-xs font-normal">{val}</p>;
          })}
          <p className="text-xs font-normal">
            Duration: {hours ? hours + "h " : ""}
            {minutes ? minutes + "min" : ""}
          </p>
          {!!affectedStopsText && (
            <p className="text-xs font-normal">{affectedStopsText}</p>
          )}
          {!!nbMMatchedStopsProRoute && (
            <p className="text-xs font-normal">{nbMMatchedStopsProRoute}</p>
          )}
          {!!nbRoutes && <p className="text-xs font-normal">{nbRoutes}</p>}
          {!!priority && <p className="text-xs font-normal">{priority}</p>}
          <AlroPartsSchema alro={alro}></AlroPartsSchema>
        </div>
      </Button>
    </>
  );
}
export default Alro;

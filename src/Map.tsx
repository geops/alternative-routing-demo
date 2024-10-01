// @ts-expect-error - no types for this package
import BasicMap from "react-spatial/components/BasicMap";
// @ts-expect-error - no types for this package
import Copyright from "react-spatial/components/Copyright";

import useMapContext from "./hooks/useMapContext";
import Zoom from "./Zoom";

function Map(props: any) {
  const { layers, map } = useMapContext();

  return (
    <>
      <BasicMap layers={layers} map={map} {...props}></BasicMap>
      <Copyright
        className="absolute bottom-2 right-2 text-[10px]"
        format={(copyrights: string[]) => {
          return copyrights
            .filter((copyright: string) => {
              return !/sbb/gi.test(copyright);
            })
            .join(" | ");
        }}
        map={map}
      />
      <Zoom className="absolute right-4 top-4 flex flex-col gap-2"></Zoom>
    </>
  );
}

export default Map;

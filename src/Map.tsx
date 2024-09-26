// @ts-expect-error - no types for this package
import BasicMap from "react-spatial/components/BasicMap";

import useMapContext from "./hooks/useMapContext";

function Map(props: any) {
  const { layers, map } = useMapContext();
  return (
    <>
      <BasicMap layers={layers} map={map} {...props} />
    </>
  );
}

export default Map;

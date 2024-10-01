import { unByKey } from "ol/Observable";
import React from "react";
import { useEffect, useState } from "react";

import useMapContext from "./hooks/useMapContext";
import { Button } from "./ui/button";

const className =
  "cursor-pointer w-12 h-12 font-bold !rounded-full bg-white !hover:bg-gray-200";

function Map(props: JSX.IntrinsicElements["div"]) {
  const { map } = useMapContext();
  const [zoom, setZoom] = useState<number>(0);

  useEffect(() => {
    if (!map) {
      return;
    }
    const key = map.on("moveend", (evt) => {
      setZoom(evt.target.getView().getZoom());
    });
    return () => {
      unByKey(key);
    };
  }, [map]);
  return (
    <div {...props}>
      <Button
        className={className}
        disabled={zoom >= (map?.getView().getMaxZoom() || Infinity)}
        onClick={() => {
          const currZoom = map?.getView().getZoom();
          if (currZoom === undefined) {
            return;
          }
          return map?.getView().setZoom(currZoom + 1);
        }}
        outline
      >
        <svg
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4.5v15m7.5-7.5h-15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      <Button
        className={className}
        disabled={zoom === 0 || zoom <= (map?.getView().getMinZoom() || 0)}
        onClick={() => {
          const currZoom = map?.getView().getZoom();
          if (currZoom === undefined) {
            return;
          }
          return map?.getView().setZoom(currZoom - 1);
        }}
        outline
      >
        <svg
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
    </div>
  );
}

export default React.memo(Map);

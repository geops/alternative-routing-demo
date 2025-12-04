import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";
import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_API_KEY;

function useRouting(
  evaNummers?: string[],
): GeoJSONFeatureCollection | undefined {
  const [featureCollection, setFeatureCollection] =
    useState<GeoJSONFeatureCollection>();

  useEffect(() => {
    if (!evaNummers || evaNummers.length === 0) {
      setFeatureCollection(undefined);
      return;
    }

    const abortController = new AbortController();

    // Routing logic here
    fetch(
      `https://api.geops.io/routing/v1/?via=${evaNummers.join("|")}&mot=rail&prefagencies=db&resolve-hops=true&key=${apiKey}`,
      {
        signal: abortController.signal,
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((featureCollection) => {
        setFeatureCollection(featureCollection);
      });
    return () => {
      abortController.abort();
    };
  }, [evaNummers]);

  return featureCollection;
}

export default useRouting;

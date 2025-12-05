import { GeoJSONFeatureCollection } from "ol/format/GeoJSON";
import { useEffect, useMemo, useState } from "react";

const apiKey = import.meta.env.VITE_API_KEY;

function useRouting(
  evaNummers?: string[] | string[][],
): GeoJSONFeatureCollection | undefined {
  const [featureCollection, setFeatureCollection] =
    useState<GeoJSONFeatureCollection>();

  const listEvaNummers: string[][] = useMemo(() => {
    let list: unknown = evaNummers;
    if (evaNummers && !Array.isArray(evaNummers?.[0])) {
      list = [evaNummers];
    }
    return list as string[][];
  }, [evaNummers]);

  useEffect(() => {
    if (!listEvaNummers || listEvaNummers.length === 0) {
      setFeatureCollection(undefined);
      return;
    }

    const abortController = new AbortController();

    const promises = listEvaNummers.map((evaNummers) => {
      // Routing logic here
      return fetch(
        `https://api.geops.io/routing/v1/?via=${evaNummers.join("|")}&mot=rail&prefagencies=db&resolve-hops=true&key=${apiKey}`,
        {
          signal: abortController.signal,
        },
      ).then((response) => {
        return response.json();
      });
    });

    Promise.all(promises)
      .then((featureCollections: GeoJSONFeatureCollection[]) => {
        setFeatureCollection({
          features: featureCollections.flatMap((fc) => {
            if (!fc.features) {
              return [];
            }
            return fc.features;
          }),
          type: "FeatureCollection",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error fetching routing data:", error);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [listEvaNummers]);

  return featureCollection;
}

export default useRouting;

import { useEffect } from "react";

import Alro from "./Alro";
import useAlroContext from "./hooks/useAlroContext";
import { AlternativeRoutesResponse, AnnotatedAlternativeRoutes } from "./types";

function Alros() {
  const { alros, selectedExample, setAlros, setLoading, url } =
    useAlroContext();

  useEffect(() => {
    const uuid = selectedExample?.uuid;
    const abortController = new AbortController();

    if (!uuid || !selectedExample) {
      return;
    }
    setLoading(true);
    const dataString = window.localStorage.getItem(selectedExample.uuid);
    if (dataString) {
      setAlros(JSON.parse(dataString));
    } else {
      fetch(
        (url || "") +
          "api/alternatives/examples/" +
          selectedExample.uuid +
          "?format=json",
        { signal: abortController.signal },
      )
        .then((response) => {
          return response.json();
        })
        .then((data: AlternativeRoutesResponse) => {
          const newAlros = data?.annotatedAlternativeRoutes || [];
          // window.localStorage.setItem(
          //   selectedExample.uuid,
          //   JSON.stringify(newAlros),
          // );
          setAlros(newAlros);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {
      setLoading(false);
      setAlros([]);
    };
  }, [selectedExample, setAlros, setLoading, url]);

  return (
    <div className="flex flex-col gap-4">
      {alros?.map((alro: AnnotatedAlternativeRoutes, index) => {
        return (
          <Alro alro={alro} className="rounded border p-4" key={index}></Alro>
        );
      })}
    </div>
  );
}

export default Alros;

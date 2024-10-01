import { useEffect } from "react";

import Alro from "./Alro";
import useAlroContext from "./hooks/useAlroContext";
import { AlternativeRoutesResponse, AnnotatedAlternativeRoutes } from "./types";

function Alros() {
  const {
    alros,
    selectedAlro,
    selectedExample,
    setAlros,
    setDemoMetadata,
    url,
  } = useAlroContext();

  useEffect(() => {
    const uuid = selectedExample?.uuid;
    const abortController = new AbortController();

    if (!uuid || !selectedExample) {
      return;
    }

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
        setAlros(newAlros);
        // @ts-expect-error - ignore deprecated
        setDemoMetadata(data?.demo_metadata);
      });
    return () => {
      setAlros([]);
    };
  }, [selectedExample, setAlros, setDemoMetadata, url]);

  return (
    <div className="flex flex-col gap-4">
      {alros?.map((alro: AnnotatedAlternativeRoutes) => {
        return (
          <Alro
            alro={alro}
            className={
              "rounded border p-4 text-left hover:border-blue-500 hover:border-2 cursor-pointer " +
              (alro === selectedAlro ? " bg-gray-200" : " bg-white")
            }
            key={JSON.stringify(alro)}
          ></Alro>
        );
      })}
    </div>
  );
}

export default Alros;

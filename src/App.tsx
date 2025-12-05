import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

import AlroLayer from "./AlroLayer";
import Alros from "./Alros";
import AlrosLayer from "./AlrosLayer";
import DisruptedRoute from "./DisruptedRoute";
import DisruptedRouteLayer from "./DisruptedRouteLayer";
import examples from "./examples";
import { AlroContext } from "./hooks/useAlroContext";
import { MapContext } from "./hooks/useMapContext";
import layers, {
  alroLayer,
  alrosLayer,
  baseLayer,
  map,
  routeLayer,
} from "./layers";
import Loading from "./Loading";
import Map from "./Map";
import ToggleAlrosButton from "./ToggleAlrosButton";
import { AlternativeRoutesResponse, AnnotatedAlternativeRoutes } from "./types";
import { Button } from "./ui/button";

const isDebug = window.location.search.includes("debug=true");

function App() {
  const [url] = useState(import.meta.env.VITE_ALRO_API_URL as string);
  const [isToggle, setToggle] = useState<boolean>();
  const [selectedExample, setSelectedExample] =
    useState<AlternativeRoutesResponse>();
  const [isSm, setSm] = useState<boolean>(false);
  const [selectedAlro, setSelectedAlro] =
    useState<AnnotatedAlternativeRoutes>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [alros, setAlros] = useState<AnnotatedAlternativeRoutes[]>([]);

  const mapContextValue = useMemo(() => {
    return { alroLayer, alrosLayer, baseLayer, layers, map, routeLayer };
  }, []);

  const alroContextValue = useMemo(() => {
    return {
      alros,
      examples,
      isLoading,
      isSm,
      selectedAlro,
      selectedExample: selectedExample,
      setAlros,
      setLoading,
      setSelectedAlro,
      setSelectedExample,
      setSm,
      url,
    };
  }, [alros, isLoading, isSm, selectedAlro, selectedExample, url]);

  useEffect(() => {
    // sm	640px	@media (min-width: 640px) { ... }
    // md	768px	@media (min-width: 768px) { ... }
    // lg	1024px	@media (min-width: 1024px) { ... }
    // xl	1280px	@media (min-width: 1280px) { ... }
    // 2xl	1536px	@media (min-width: 1536px) { ... }
    const resizeObserver = new ResizeObserver((entries) => {
      const newSm = entries[0].contentRect.width < 640;
      if (isSm !== newSm) {
        setSm(newSm);
      }
    });
    resizeObserver.observe(document.getElementById("root") as HTMLElement);
    return () => {
      resizeObserver.disconnect();
    };
  }, [isSm]);

  // load example data when example is changed
  useEffect(() => {
    const abortController = new AbortController();

    if (!selectedExample) {
      return;
    }
    const newAlros = (selectedExample as AlternativeRoutesResponse)
      ?.annotatedAlternativeRoutes;
    if (newAlros) {
      setAlros(newAlros);
    }
    return () => {
      abortController.abort();
      setAlros([]);
    };
  }, [selectedExample, setAlros, url]);

  return (
    <>
      <AlroContext.Provider value={alroContextValue}>
        <MapContext.Provider value={mapContextValue}>
          <Map className="z-0 size-full" />
          <DisruptedRouteLayer />
          <AlrosLayer />
          <AlroLayer />

          <div className="absolute left-0 top-0 z-10 flex max-h-full w-full flex-col justify-between gap-4 sm:w-2/5  sm:p-4 xl:w-[500px]">
            <div className="flex w-full flex-col gap-4 rounded border bg-white p-4">
              <div>
                <h1 className="text-xs font-light">DB Challenge</h1>
                <h2 className="font-bold">Alternative Routing</h2>
              </div>
              <Headless.Textarea
                className={clsx(
                  "h-20 w-full resize flex-col gap-2 rounded-[calc(theme(borderRadius.lg)-1px)] border px-2 py-1 text-base/6 text-zinc-500 shadow sm:text-sm/6",
                )}
                onChange={(evt) => {
                  const json = evt.target.value;
                  try {
                    const parsed = JSON.parse(
                      json,
                    ) as AlternativeRoutesResponse;
                    setSelectedExample(parsed);
                  } catch (error) {
                    console.error("Invalid JSON:", error);
                  }
                }}
                placeholder="Paste Alternative Routes JSON here"
              ></Headless.Textarea>
              {isDebug && (
                <>
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedExample(
                        examples[0] as AlternativeRoutesResponse,
                      );
                      document.querySelector("textarea")!.value =
                        JSON.stringify(examples[0]);
                    }}
                  >
                    Load demo data
                  </Button>
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedExample(
                        examples[1] as AlternativeRoutesResponse,
                      );
                      document.querySelector("textarea")!.value =
                        JSON.stringify(examples[1]);
                    }}
                  >
                    Load Leipzig-Cottbus data
                  </Button>
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedExample(
                        examples[2] as AlternativeRoutesResponse,
                      );
                      document.querySelector("textarea")!.value =
                        JSON.stringify(examples[2]);
                    }}
                  >
                    Load Frankfurt-Mainz data
                  </Button>
                </>
              )}
            </div>
            {!!alros?.length && (
              <div
                className={
                  "fixed bottom-0 flex h-64 w-full flex-col gap-2 overflow-hidden rounded border bg-white p-4 sm:relative sm:h-full" +
                  (isSm && isToggle ? " !h-2/3" : "")
                }
              >
                {isSm && (
                  <ToggleAlrosButton
                    isToggle={isToggle}
                    onClick={() => {
                      setToggle(!isToggle);
                    }}
                  />
                )}
                <div className="overflow-y-auto">
                  {
                    <DisruptedRoute className="sticky top-0 z-50 shrink-0 grow-0 bg-white pb-4 shadow" />
                  }
                  <div className="flex flex-col gap-4">
                    {isLoading && <Loading />}
                    {!isLoading && <Alros />}
                  </div>
                </div>
              </div>
            )}
          </div>
        </MapContext.Provider>
      </AlroContext.Provider>
    </>
  );
}

export default App;

import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { Map as OlMap, View } from "ol";
import { useMemo, useState } from "react";

// import AlroExampleLayer from "./AlroExampleLayer";
import AlroExamplesField from "./AlroExamplesField";
import AlroLayer from "./AlroLayer";
import Alros from "./Alros";
import AlrosLayer from "./AlrosLayer";
import { AlroContext, AlroExample } from "./hooks/useAlroContext";
import { MapContext } from "./hooks/useMapContext";
import Map from "./Map";
import RouteLayer from "./RouteLayer";
import { AnnotatedAlternativeRoutes } from "./types";

const map = new OlMap({
  controls: [],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});
const layer = new MaplibreLayer({
  apiKey: import.meta.env.VITE_API_KEY,
});
const layers = [layer];

const alroExamples: AlroExample[] = [
  {
    name: "München -> Regensburg",
    uuid: "66619d28-f0e8-43ef-8bdb-25d709405c7b",
  },
  { name: "München -> Nürnberg", uuid: "68dbf5b1-cd04-4e31-845a-1e9dd60cbf61" },
  {
    name: "München -> Oberstdorf",
    uuid: "9631c8a2-77e6-49a8-82cf-62a76f28ba06",
  },
];

function App() {
  const [url] = useState(import.meta.env.VITE_ALRO_API_URL as string);
  const [selectedExample, setSelectedExample] = useState<AlroExample>();
  const [selectedAlro, setSelectedAlro] =
    useState<AnnotatedAlternativeRoutes>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [alros, setAlros] = useState<AnnotatedAlternativeRoutes[]>([]);

  const mapContextValue = useMemo(() => {
    return { baseLayer: layer, layers, map };
  }, []);

  const alroContextValue = useMemo(() => {
    return {
      alros,
      examples: alroExamples,
      isLoading,
      selectedAlro,
      selectedExample: selectedExample,
      setAlros,
      setLoading,
      setSelectedAlro,
      setSelectedExample,
      url,
    };
  }, [
    url,
    alros,
    isLoading,
    selectedAlro,
    selectedExample,
    setSelectedAlro,
    setAlros,
    setLoading,
    setSelectedExample,
  ]);

  return (
    <>
      <AlroContext.Provider value={alroContextValue}>
        <MapContext.Provider value={mapContextValue}>
          <Map className="z-0 size-full" />
          {/* <AlroExampleLayer /> */}
          <RouteLayer />
          <AlrosLayer />
          <AlroLayer />
        </MapContext.Provider>

        <div className="absolute left-0 top-0 z-10 flex max-h-full w-96 flex-col gap-4 p-4">
          <div className="w-full rounded border bg-white p-4">
            <AlroExamplesField />
          </div>
          {selectedExample && (
            <div className="flex h-full flex-col gap-4 overflow-hidden rounded border bg-white p-4">
              <h1>
                Alternative routes for <b>{selectedExample.name}</b>:
              </h1>

              <div className="overflow-y-auto">
                <Alros />
              </div>
            </div>
          )}
        </div>
      </AlroContext.Provider>
    </>
  );
}

export default App;

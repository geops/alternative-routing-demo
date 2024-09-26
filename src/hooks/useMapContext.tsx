import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import { Layer } from "ol/layer";
import { createContext } from "react";
import { useContext } from "react";

export type MapContextType = {
  baseLayer?: MaplibreLayer;
  layers?: Layer[];
  map?: Map;
};

export const MapContext = createContext<MapContextType>({
  baseLayer: undefined,
  layers: [],
  map: undefined,
} as MapContextType);

function useMapContext(): MapContextType {
  const context = useContext<MapContextType>(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a ContextProvider");
  }
  return context;
}

export default useMapContext;

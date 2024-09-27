import { MaplibreLayer, MaplibreStyleLayer } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import { Layer } from "ol/layer";
import { createContext } from "react";
import { useContext } from "react";

export type MapContextType = {
  alroLayer?: MaplibreStyleLayer; // The selected alternative route layer
  alrosLayer?: MaplibreStyleLayer; // The alternative routes layer
  baseLayer?: MaplibreLayer;
  layers?: Layer[];
  map?: Map;
  routeLayer?: MaplibreStyleLayer; // The disrupted route layer
};

export const MapContext = createContext<MapContextType>({
  layers: [],
} as MapContextType);

function useMapContext(): MapContextType {
  const context = useContext<MapContextType>(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a ContextProvider");
  }
  return context;
}

export default useMapContext;

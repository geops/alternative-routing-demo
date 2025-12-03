import { createContext } from "react";
import { useContext } from "react";

import {
  AlternativeRoutesResponse,
  AnnotatedAlternativeRoutes,
} from "../types";

export type AlroContextType = {
  alros: AnnotatedAlternativeRoutes[];
  examples: AlternativeRoutesResponse[];
  isLoading: boolean;
  isSm: boolean;
  selectedAlro?: AnnotatedAlternativeRoutes;
  selectedExample?: AlternativeRoutesResponse;
  setAlros: (alros: AnnotatedAlternativeRoutes[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedAlro: (alro?: AnnotatedAlternativeRoutes) => void;
  setSelectedExample: (example?: AlternativeRoutesResponse) => void;
  url?: string;
};

export const AlroContext = createContext<AlroContextType>({
  alros: [],
  examples: [],
  isLoading: false,
  isSm: false,
  setAlros: () => {},
  setLoading: () => {},
  setSelectedAlro: () => {},
  setSelectedExample: () => {},
} as AlroContextType);

function useAlroContext(): AlroContextType {
  const context = useContext<AlroContextType>(AlroContext);
  if (!context) {
    throw new Error("useAlroContext must be used within a ContextProvider");
  }
  return context;
}

export default useAlroContext;

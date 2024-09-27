import { createContext } from "react";
import { useContext } from "react";

import { AnnotatedAlternativeRoutes } from "../types";

export type AlroExample = {
  name: string;
  uuid: string;
};

export type AlroContextType = {
  alros: AnnotatedAlternativeRoutes[];
  examples: AlroExample[];
  isLoading: boolean;
  selectedAlro?: AnnotatedAlternativeRoutes;
  selectedExample?: AlroExample;
  setAlros: (alros: AnnotatedAlternativeRoutes[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedAlro: (alro?: AnnotatedAlternativeRoutes) => void;
  setSelectedExample: (example?: AlroExample) => void;
  url?: string;
};

export const AlroContext = createContext<AlroContextType>({
  alros: [],
  examples: [],
  isLoading: false,
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

import { createContext } from "react";
import { useContext } from "react";

import { AnnotatedAlternativeRoutes, DemoMetadata } from "../types";

export type AlroExample = {
  name: string;
  uuid: string;
};

export type AlroContextType = {
  alros: AnnotatedAlternativeRoutes[];
  demoMetadata?: DemoMetadata;
  examples: AlroExample[];
  isLoading: boolean;
  isSm: boolean;
  selectedAlro?: AnnotatedAlternativeRoutes;
  selectedExample?: AlroExample;
  setAlros: (alros: AnnotatedAlternativeRoutes[]) => void;
  setDemoMetadata: (demoMetadata?: DemoMetadata) => void;
  setLoading: (loading: boolean) => void;
  setSelectedAlro: (alro?: AnnotatedAlternativeRoutes) => void;
  setSelectedExample: (example?: AlroExample) => void;
  url?: string;
};

export const AlroContext = createContext<AlroContextType>({
  alros: [],
  examples: [],
  isLoading: false,
  isSm: false,
  setAlros: () => {},
  setDemoMetadata: () => {},
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

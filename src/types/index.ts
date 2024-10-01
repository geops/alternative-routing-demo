import { components as AlroComps } from "./alro";
import { paths as AlroPaths } from "./alro";

export type AlternativeRoutesResponse =
  AlroComps["schemas"]["AlternativeRoutesResponse"];

export type AnnotatedAlternativeRoutes =
  AlroComps["schemas"]["AnnotatedAlternativeRoutes"];

export type AlternativeRoutePart =
  AlroComps["schemas"]["AlternativeRoutes-Output"];

export type DemoMetadata = AlroComps["schemas"]["DemoMetadata"];

export type { AlroComps, AlroPaths };

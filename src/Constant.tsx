export const FIT_OPTIONS = {
  duration: 500,
  padding: [50, 50, 50, 400],
};

export const EMPTY_FEATURE_COLLECTION: GeoJSON.GeoJSON = {
  features: [],
  type: "FeatureCollection",
};

export const colorsByCategory: { [key: string]: string } = {
  BUS: "#ff9800",
  "BUS EV": "#992168",
  "Bus Flixbus": "#9ccc65",
  default: "black",
  ECE: "#f44336",
  ICE: "#9c27b0",
  R: "#f44336",
  RB: "#f44336",
  RE: "#f44336",
  S: "#408335",
};
export const BEFORE_ID = "placeName_town_bg";
export const ROUTE_LAYER_SOURCE_ID = "route";
export const ROUTE_LAYER_LAYER_ID = "route";

export const ALROS_LAYER_SOURCE_ID = "alros";
export const ALROS_LAYER_LAYER_ID = "alros";

export const ALRO_LAYER_SOURCE_ID = "alro";
export const ALRO_LAYER_LAYER_ID = "alro";

export const FIT_OPTIONS = {
  duration: 500,
  padding: [50, 50, 50, 500],
};

export const FIT_OPTIONS_SM = {
  duration: 500,
  padding: [220, 20, 280, 20],
};

export const EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  features: [],
  type: "FeatureCollection",
};

export const colorsByCategory: { [key: string]: string } = {
  BUS: "#ff9800",
  "BUS EV": "#992168",
  "Bus Flixbus": "#9ccc65",
  default: "#ff9800",
  ECE: "#f44336",
  IC: "#9c27b0",
  ICE: "#9c27b0",
  R: "#f44336",
  RB: "#f44336",
  RE: "#f44336",
  S: "#408335",
};
export const imagesByCategory: { [key: string]: string } = {
  BUS: "Nr.5_3_030-1_v1.png",
  bus: "Nr.5_3_030-1_v1.png",
  "BUS EV": "Nr.2_3_002-1_v1.png",
  "Bus Flixbus": "Nr.5_3_030-1_v1.png",
  default: "Nr.5_3_030-1_v1.png",
  ECE: "Nr.1_3_001-1_v1.png",
  IC: "Nr.1_3_001-1_v1.png",
  ICE: "Nr.1_3_001-1_v1.png",
  R: "Nr.1_3_001-1_v1.png",
  rail: "Nr.1_3_001-1_v1.png",
  RB: "Nr.1_3_001-1_v1.png",
  RE: "Nr.1_3_001-1_v1.png",
  S: "Nr.3_3_010-1_v1.png",
};

export const BEFORE_ID = "placeName_town_bg";
export const ROUTE_LAYER_SOURCE_ID = "route";
export const ROUTE_LAYER_LAYER_ID = "route";

export const ALROS_LAYER_SOURCE_ID = "alros";
export const ALROS_LAYER_LAYER_ID = "alros";

export const ALRO_LAYER_SOURCE_ID = "alro";
export const ALRO_LAYER_LAYER_ID = "alro";

export const STATIONS_HIGHLIGHT_LAYER_ID = "stations-highlight";

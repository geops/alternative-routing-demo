import { MaplibreLayer, MaplibreStyleLayer } from "mobility-toolbox-js/ol";
import { Map as OlMap, View } from "ol";
import { useMemo, useState } from "react";

// import AlroExampleLayer from "./AlroExampleLayer";
import AlroExamplesField from "./AlroExamplesField";
import AlroLayer from "./AlroLayer";
import Alros from "./Alros";
import AlrosLayer from "./AlrosLayer";
import {
  ALRO_LAYER_LAYER_ID,
  ALRO_LAYER_SOURCE_ID,
  ALROS_LAYER_LAYER_ID,
  ALROS_LAYER_SOURCE_ID,
  BEFORE_ID,
  ROUTE_LAYER_LAYER_ID,
  ROUTE_LAYER_SOURCE_ID,
  STATIONS_HIGHLIGHT_LAYER_ID,
} from "./Constant";
import { AlroContext, AlroExample } from "./hooks/useAlroContext";
import { MapContext } from "./hooks/useMapContext";
import Loading from "./Loading";
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

const baseLayer = new MaplibreLayer({
  apiKey: import.meta.env.VITE_API_KEY,
});

const routeLayer = new MaplibreStyleLayer({
  beforeId: BEFORE_ID,
  maplibreLayer: baseLayer,
  sources: {
    [ROUTE_LAYER_SOURCE_ID]: {
      data: {
        features: [],
        type: "FeatureCollection",
      },
      type: "geojson",
    },
  },
  styleLayers: [
    {
      id: ROUTE_LAYER_LAYER_ID + "-1",
      paint: {
        "line-color": "#c28f3f",
        "line-width": 8,
      },
      source: ROUTE_LAYER_SOURCE_ID,
      type: "line",
    },
    {
      id: ROUTE_LAYER_LAYER_ID,
      paint: {
        "line-color": "#fce3b4",
        "line-width": 4,
      },
      source: ROUTE_LAYER_SOURCE_ID,
      type: "line",
    },
  ],
  visible: false,
});

const alrosLayer = new MaplibreStyleLayer({
  beforeId: BEFORE_ID,
  maplibreLayer: baseLayer,
  sources: {
    [ALROS_LAYER_SOURCE_ID]: {
      data: {
        features: [],
        type: "FeatureCollection",
      },
      type: "geojson",
    },
  },
  styleLayers: [
    {
      id: ALROS_LAYER_LAYER_ID + "-1",
      paint: {
        "line-color": "#3d84e1",
        "line-width": 4,
      },
      source: ALROS_LAYER_SOURCE_ID,
      type: "line",
    },
    {
      id: ALROS_LAYER_LAYER_ID,
      paint: {
        "line-color": "#b4d5f6",
        "line-width": 2,
      },
      source: ALROS_LAYER_SOURCE_ID,
      type: "line",
    },
  ],
  visible: false,
});

const alroLayer = new MaplibreStyleLayer({
  maplibreLayer: baseLayer,
  sources: {
    [ALRO_LAYER_SOURCE_ID]: {
      data: {
        features: [],
        type: "FeatureCollection",
      },
      type: "geojson",
    },
  },
  styleLayers: [
    {
      id: ALRO_LAYER_LAYER_ID + "-2",
      paint: { "background-color": "#ffffff", "background-opacity": 0.8 },
      type: "background",
    },

    // {
    //   id: ALRO_LAYER_LAYER_ID + "-3",
    //   paint: {
    //     "line-color": ["get", "color"],
    //     "line-width": 8,
    //   },
    //   source: ALRO_LAYER_SOURCE_ID,
    //   type: "line",
    // },

    {
      id: ALRO_LAYER_LAYER_ID + "-5",
      paint: {
        "line-color": "#c28f3f",
        "line-width": 8,
      },
      source: ROUTE_LAYER_SOURCE_ID,
      type: "line",
    },
    {
      id: ALRO_LAYER_LAYER_ID + "-6",
      paint: {
        "line-color": "#fce3b4",
        "line-width": 4,
      },
      source: ROUTE_LAYER_SOURCE_ID,
      type: "line",
    },
    {
      id: ALRO_LAYER_LAYER_ID,
      paint: {
        "line-color": "#3d84e1",
        "line-width": 4,
      },
      source: ALRO_LAYER_SOURCE_ID,
      type: "line",
    },
    {
      id: ALRO_LAYER_LAYER_ID + "-1",
      paint: {
        "line-color": "#b4d5f6",
        "line-width": 2,
      },
      source: ALRO_LAYER_SOURCE_ID,
      type: "line",
    },
    {
      id: ALRO_LAYER_LAYER_ID + "-3",
      layout: {
        "icon-allow-overlap": true,
        "icon-image": ["get", "icon"],
        // "icon-keep-upright": true,
        "icon-rotation-alignment": "viewport",
        "icon-size": 0.25,
        "symbol-avoid-edges": true,
        "symbol-placement": "line-center",
      },
      source: ALRO_LAYER_SOURCE_ID,
      type: "symbol",
    },
    {
      id: STATIONS_HIGHLIGHT_LAYER_ID,
      layout: {
        "icon-allow-overlap": false,
        "icon-ignore-placement": false,
        "icon-image": {
          stops: [
            [7, "20-circle-grey-notch"],
            [8, "10-contour-grey-notch"],
          ],
        },
        "icon-optional": false,
        "icon-size": {
          stops: [
            [7, 0.5],
            [8, 0.6],
            [9, 0.6],
            [10, 0.65],
          ],
        },
        "text-allow-overlap": false,
        "text-anchor": [
          "match",
          ["get", "label_anchor"],
          "NW",
          "bottom-right",
          "W",
          "right",
          "SW",
          "top-right",
          "N",
          "bottom",
          "S",
          "top",
          "NE",
          "bottom-left",
          "E",
          "left",
          "SE",
          "top-left",
          "bottom-left",
        ],
        "text-field": "{display_name}",
        "text-font": ["SBB Web Bold", "Arial"],
        "text-ignore-placement": false,
        "text-justify": [
          "match",
          ["get", "label_anchor"],
          "NW",
          "right",
          "W",
          "right",
          "SW",
          "right",
          "N",
          "left",
          "S",
          "left",
          "NE",
          "left",
          "E",
          "left",
          "SE",
          "left",
          "left",
        ],
        "text-letter-spacing": 0.1,
        "text-line-height": 1,
        "text-max-width": ["coalesce", ["get", "label_max_width"], 8],
        "text-offset": [
          "match",
          ["get", "label_anchor"],
          "NW",
          ["literal", [-0.3, -0.3]],
          "W",
          ["literal", [-0.5, 0]],
          "SW",
          ["literal", [-0.4, 0.5]],
          "N",
          ["literal", [0, -0.5]],
          "S",
          ["literal", [0, 0.5]],
          "NE",
          ["literal", [0.3, -0.3]],
          "E",
          ["literal", [0.5, 0]],
          "SE",
          ["literal", [0.4, 0.5]],
          ["literal", [0.3, -0.3]],
        ],
        "text-size": {
          stops: [
            [7, 14.5],
            [9, 16.5],
          ],
        },
      },
      paint: {
        "text-halo-blur": 1,
        "text-halo-color": "rgba(247, 244, 244, 1)",
        "text-halo-width": 3,
        "text-opacity": 1,
      },
      source: "base",
      "source-layer": "osm_points",
      type: "symbol",
    },
  ],
  visible: false,
});

const layers = [baseLayer, alrosLayer, routeLayer, alroLayer];

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
    return { alroLayer, alrosLayer, baseLayer, layers, map, routeLayer };
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

          <div className="absolute left-0 top-0 z-10 flex max-h-full w-1/4 flex-col gap-4 p-4">
            <div className="w-full rounded border bg-white p-4">
              <AlroExamplesField />
            </div>
            {selectedExample && (
              <div className="flex h-full flex-col gap-4 overflow-hidden rounded border bg-white p-4">
                {/* <h1>
                Alternative routes for <b>{selectedExample.name}</b>:
              </h1> */}

                <div className="overflow-y-auto">
                  {isLoading && <Loading />}
                  {!isLoading && <Alros />}
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

import { AlroExample } from "../hooks/useAlroContext";
import { AlternativeRoutesResponse } from "../types";
import ruoying_demo from "./ruoying_demo.json";

console.log("Loaded ruoying_demo:", ruoying_demo);

const examples: (AlroExample | AlternativeRoutesResponse)[] = [
  ruoying_demo as AlternativeRoutesResponse,
  {
    name: "München -> Regensburg",
    uuid: "66619d28-f0e8-43ef-8bdb-25d709405c7b",
  },
  { name: "München -> Nürnberg", uuid: "68dbf5b1-cd04-4e31-845a-1e9dd60cbf61" },
  {
    name: "München -> Oberstdorf",
    uuid: "9631c8a2-77e6-49a8-82cf-62a76f28ba06",
  },
  {
    name: "München -> Ingolstadt (Unterbruch Dachau–Petershausen) (1)",
    uuid: "2fb895df-2d9e-4b45-ba30-c236e5f72ce7_1",
  },
  {
    name: "München -> Ingolstadt (Unterbruch Dachau–Petershausen) (2)",
    uuid: "2fb895df-2d9e-4b45-ba30-c236e5f72ce7_2",
  },
  {
    name: "Ansbach -> Nürnberg Hbf",
    uuid: "0ef83988-372c-4633-867d-32930986ebde",
  },
  {
    name: "Ulm Hbf -> Günzburg",
    uuid: "09fd98c7-b64f-4bd9-90e1-5f418c0a28dd",
  },
];

export default examples;

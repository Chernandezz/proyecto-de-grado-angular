/// <reference lib="webworker" />

import { log } from "mathjs";
import { AlgoritmoGeneticoAsignacion } from "./genClassAsignacion";


addEventListener('message', ({ data }) => {
  let res = new AlgoritmoGeneticoAsignacion(data);
  console.log('res');
  console.log(res);
  
  postMessage({ resultado: res });
});
  
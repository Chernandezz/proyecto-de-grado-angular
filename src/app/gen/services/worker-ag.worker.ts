/// <reference lib="webworker" />

import { AlgoritmoGenetico } from "./genClass";

addEventListener('message', ({ data }) => {
  let res = new AlgoritmoGenetico(data);

  // Eliminar la propiedad expresionFuncionObjetivo
  delete res.expresionFuncionObjetivo;

  postMessage({ resultado: res });
});

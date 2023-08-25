import { ResultadoAlgoritmo } from "./Resultado";

export interface ResAlgoritmo {
  n: number;
  tipoSeleccion: string;
  tamanoPoblacion: number;
  tipoCruce: string;
  tipoMutacion: string;
  probabilidadCruce: number;
  probabilidadMutacion: number;
  numIteraciones: number;
  xmin: number;
  xmax: number;
  convergencia: boolean;
  elitismo: boolean;
  Lind: number;
  poblacion: Poblacion[];
  tituloEjecucion: string;
  resultado: ResultadoAlgoritmo;
}

export interface Poblacion {
  probabilidadAcumulada: number;
  probabilidad: number;
  cromosoma: number[];
  binario: string;
  xi: number;
  fitness: number;
  fx: number;
}


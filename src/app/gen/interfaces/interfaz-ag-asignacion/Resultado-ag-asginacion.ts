import { Individuo } from "./IndividuoAsignacion";

export interface ResultadoAlgoritmo {
  tablaInicial: Individuo[];
  fitnessInicial: number;
  tablaFinal: Individuo[];
  fitnessFinal: number;
  mejoresCromosomas: number[];
}


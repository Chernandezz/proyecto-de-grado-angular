export interface ResultadoAlgoritmo {
  tablaInicial: Tabla[];
  fitnessInicial: number;
  tablaFinal: Tabla[];
  fitnessFinal: number;
  mejoresCromosomas: number[];
}

export interface Tabla {
  probabilidadAcumulada: number;
  probabilidad: number;
  cromosoma: number[];
  binario: string;
  xi: number;
  fitness: number;
  fx: number;
}

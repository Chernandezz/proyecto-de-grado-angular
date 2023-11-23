export interface Individuo {
  probabilidadAcumulada: number;
  probabilidad: number;
  cromosoma: number[][];
  binario: string;
  xi: number;
  fitness: number;
  fx: number;
}
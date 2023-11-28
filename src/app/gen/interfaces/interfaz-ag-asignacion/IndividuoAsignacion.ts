export interface Individuo {
  probabilidadAcumulada: number;
  probabilidad: number;
  cromosomas: number[][]; // Representa los segmentos de cada xi
  binario: string; // Considerar cómo se manejará esto con cromosomas múltiples
  xi: number;
  fitness: number;
  fx: number;
  valoresDecimalesXi: number[];
}

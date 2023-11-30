export interface Individuo {
  probabilidadAcumulada: number;
  probabilidad: number;
  genotipos: number[][]; // Representa los segmentos de cada xi
  binario: string; // Considerar cómo se manejará esto con cromosomas múltiples
  fenotipos: number[];
  fitness: number;
}



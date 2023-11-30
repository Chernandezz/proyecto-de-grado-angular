export interface AlgorithmOptionsAsignacion {
  arrRestriccion: arrRestriccion[];
  arrCoeficiente: arrCoeficiente[];
  convergencia: boolean;
  elitismo: boolean;
  numGeneraciones: number;
  numIndividuos: number;
  probCruce: number;
  probMutacion: number;
  tipo: string;
  tipoCruce: string;
  tipoMutacion: string;
  tipoSeleccion: string;
  tituloEjecucion: string;
  xMax: number;
  xMin: number;
}

export interface arrCoeficiente {
  value: number;
  Lind: number;
  xMin: number;
  xMax: number;
}


export interface arrRestriccion {
  coeficientes: number[];
  operador: string;
  value: number;
}
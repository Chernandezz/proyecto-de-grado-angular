export interface AlgorithmOptionsAsignacion {
  arrRestriccion: arrRestriccion[];
  arrCoeficiente: arrCoeficiente[];
  convergencia: boolean;
  elitismo: boolean;
  numDecimales: number;
  numGeneraciones: number;
  numIndividuos: number;
  probCruce: number;
  probMutacion: number;
  tipo: string;
  Lind: number;
  tipoCruce: string;
  tipoMutacion: string;
  tipoSeleccion: string;
  tituloEjecucion: string;
}

export interface arrCoeficiente {
  index: number;
  value: number;
}

export interface arrRestriccion {
  operador: string;
  value: number;
}
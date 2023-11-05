import { arrCoeficiente } from "./interfaz-ag-asignacion-coeficientes";
import { arrRestriccion } from "./interfaz-ag-asignacion-restriccion";

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
  Lind: number;
  tipoCruce: string;
  tipoMutacion: string;
  tipoSeleccion: string;
  tituloEjecucion: string;
}
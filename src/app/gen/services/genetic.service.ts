import { Injectable } from '@angular/core';
import { AlgorithmOptions } from '../interfaces/interfazFormAg';
import { AlgoritmoGenetico } from './genClass';
import { BehaviorSubject } from 'rxjs';
import { AlgoritmoGeneticoAsignacion } from './genClassAsignacion';
import { AlgorithmOptionsAsignacion, arrCoeficiente, arrRestriccion } from '../interfaces/interfaz-ag-asignacion/estructura-formulario-ag-asignacion';

@Injectable({ providedIn: 'root' })
export class GeneticService {
  private colaAlgoritmos: AlgoritmoGenetico[] = [];
  private colaAlgoritmosAsignacion: AlgoritmoGeneticoAsignacion[] = [];
  private colaAlgoritmosSubject = new BehaviorSubject<AlgoritmoGenetico[]>([]);
  private listaTerminadosSubject = new BehaviorSubject<
    { tituloEjecucion: string; terminado: boolean }[]
  >([]);
  private listaTerminados: { tituloEjecucion: string; terminado: boolean }[] =
    [];
  private mostrarResultadosServiceSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  get getColaAlgoritmos$() {
    return this.colaAlgoritmosSubject.asObservable();
  }

  get getMostrarResultadosService$() {
    return this.mostrarResultadosServiceSubject.asObservable();
  }

  get getListaTerminados$() {
    return this.listaTerminadosSubject.asObservable();
  }

  get getListaTerminados() {
    return [...this.listaTerminados];
  }

  get getColaAlgoritmos() {
    return [...this.colaAlgoritmos];
  }

  limpiarCola(){
    this.colaAlgoritmos = [];
    this.listaTerminados = [];
    this.actualizarColaAlgoritmos();
    this.actualizarListaTerminados();
  }

  eliminarAlgoritmo(nombre: string) {
    this.colaAlgoritmos = this.colaAlgoritmos.filter(
      (algo) => algo.tituloEjecucion !== nombre
    );
    this.listaTerminados = this.listaTerminados.filter(
      (algo) => algo.tituloEjecucion !== nombre
    );
    this.actualizarColaAlgoritmos();
    this.actualizarListaTerminados();
  }

  private actualizarColaAlgoritmos() {
    this.colaAlgoritmosSubject.next([...this.colaAlgoritmos]);
  }

  private checkMostrarResultados() {
    const todosTerminados = this.listaTerminados.every(
      (algo) => algo.terminado === true
    );
    if (todosTerminados) {
      // Cuando todos los algoritmos estén terminados, mostrar los resultados
      this.mostrarResultadosServiceSubject.next(true);
    } else {
      this.mostrarResultadosServiceSubject.next(false);
    }
  }

  private actualizarListaTerminados() {
    this.listaTerminadosSubject.next([...this.listaTerminados]);
  }

  private marcarComoTerminado(tituloEjecucion: string) {
    const algoritmoTerminado = this.listaTerminados.find(
      (algo) => algo.tituloEjecucion === tituloEjecucion
    );
    if (algoritmoTerminado) {
      algoritmoTerminado.terminado = true;
      this.actualizarListaTerminados();
    }
  }

  getFunctionAsignacion(
    genOptions: AlgorithmOptionsAsignacion,
    arrCoeficientes: arrCoeficiente[],
    arrRestricciones: arrRestriccion[]
  ) {
    const newVariables = {
      ...genOptions,
    };
    newVariables.arrCoeficiente = [...arrCoeficientes];
    newVariables.arrRestriccion = [...arrRestricciones];

    const tempLoader = {
      tituloEjecucion: newVariables.tituloEjecucion,
      terminado: false,
    };

    this.listaTerminados.push(tempLoader);
    this.actualizarListaTerminados();
    this.checkMostrarResultados();

    if (typeof Worker !== 'undefined') {
      try {
        const worker = new Worker(
          new URL('./worker-ag-asignacion.worker', import.meta.url)
        );
        worker.postMessage(newVariables);
        worker.onmessage = (res) => {
          this.colaAlgoritmos.push(res.data.resultado);
          this.marcarComoTerminado(res.data.resultado.tituloEjecucion);
          this.actualizarColaAlgoritmos();
          this.checkMostrarResultados();
        };
      } catch (error) {
        console.error('Error al crear el Web Worker:', error);
        // Manejo de errores: puedes agregar un mensaje de error o tomar medidas adicionales si es necesario
      }
    } else {
      console.warn('Web workers are not supported in this environment.');
      // Puedes agregar una notificación o un comportamiento alternativo aquí si los Web Workers no son compatibles
    }
  }

  getFunction(genOptions: AlgorithmOptions) {
    const newVariables = { ...genOptions };
    const tempLoader = {
      tituloEjecucion: newVariables.tituloEjecucion,
      terminado: false,
    };

    this.listaTerminados.push(tempLoader);
    this.actualizarListaTerminados();
    this.checkMostrarResultados();

    if (typeof Worker !== 'undefined') {
      try {
        const worker = new Worker(
          new URL('./worker-ag.worker', import.meta.url)
        );
        worker.postMessage(newVariables);
        worker.onmessage = (res) => {
          this.colaAlgoritmos.push(res.data.resultado);
          this.marcarComoTerminado(res.data.resultado.tituloEjecucion);
          this.actualizarColaAlgoritmos();
          this.checkMostrarResultados();
        };
      } catch (error) {
        console.error('Error al crear el Web Worker:', error);
        // Manejo de errores: puedes agregar un mensaje de error o tomar medidas adicionales si es necesario
      }
    } else {
      console.warn('Web workers are not supported in this environment.');
      // Puedes agregar una notificación o un comportamiento alternativo aquí si los Web Workers no son compatibles
    }
  }
}

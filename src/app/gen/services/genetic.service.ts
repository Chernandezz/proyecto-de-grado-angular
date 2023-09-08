import { Injectable } from '@angular/core';
import { AlgorithmOptions } from '../interfaces/interfazFormAg';
import { AlgoritmoGenetico } from '../classes/genClass';
import { BehaviorSubject } from 'rxjs';
import { listaTerminados } from '../interfaces/listaTerminados';

@Injectable({ providedIn: 'root' })
export class GeneticService {
  private colaAlgoritmos: AlgoritmoGenetico[] = [];
  private colaAlgoritmosSubject = new BehaviorSubject<AlgoritmoGenetico[]>([]);
  private listaTerminados: listaTerminados[] = []

  constructor() {}

  get getColaAlgoritmos$() {
    return this.colaAlgoritmosSubject.asObservable();
  }

  get getColaAlgoritmos() {
    return [...this.colaAlgoritmos];
  }

  eliminarAlgoritmo(nombre: string) {
    this.colaAlgoritmos = this.colaAlgoritmos.filter(
      (algo) => algo.tituloEjecucion !== nombre
    );
    this.colaAlgoritmosSubject.next([...this.colaAlgoritmos]);
  }

  

  getFunction(genOptions: AlgorithmOptions) {
    const newVariables = Object.assign({}, genOptions);
    const tempLoader = {
      tituloEjecucion: newVariables.tituloEjecucion,
      terminado: false,
    }
    this.listaTerminados.push(tempLoader);
    
    console.log(this.listaTerminados);
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./worker-ag.worker', import.meta.url));
      worker.postMessage(newVariables);
      worker.onmessage = (res) => {
        this.colaAlgoritmos.push(res.data.resultado);
        // Funcion para cambiar el estado de terminado
        this.listaTerminados.forEach((algo) => {
          if (algo.tituloEjecucion === res.data.resultado.tituloEjecucion) {
            algo.terminado = true;
          }
        });
        this.colaAlgoritmosSubject.next([...this.colaAlgoritmos]);
      };
      
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}

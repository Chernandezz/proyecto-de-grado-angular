import { Injectable } from '@angular/core';
import { AlgorithmOptions } from '../interfaces/interfazFormAg';
import { AlgoritmoGenetico } from '../classes/genClass';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeneticService {
  private colaAlgoritmos: AlgoritmoGenetico[] = [];
  private colaAlgoritmosSubject = new BehaviorSubject<AlgoritmoGenetico[]>([]);

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
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./worker-ag.worker', import.meta.url));
      worker.postMessage(newVariables);
      worker.onmessage = (res) => {
        this.colaAlgoritmos.push(res.data.resultado);
        this.colaAlgoritmosSubject.next([...this.colaAlgoritmos]);
      };
      
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
    
        

    

    // let res = new AlgoritmoGenetico(genOptions);

    // console.log(res.resultado);

    

    // console.log(this.colaAlgoritmos);
  }
}

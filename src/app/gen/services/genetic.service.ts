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

  getFunction(genOptions: AlgorithmOptions) {
    let res = new AlgoritmoGenetico(genOptions);

    console.log(res.resultado);

    this.colaAlgoritmos.push(res);
    this.colaAlgoritmosSubject.next([...this.colaAlgoritmos]);

    console.log(this.colaAlgoritmos);
  }
}

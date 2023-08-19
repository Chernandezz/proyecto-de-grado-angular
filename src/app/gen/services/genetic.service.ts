import { Injectable } from '@angular/core';
import { AlgorithmOptions } from '../interfaces/interfazFormAg';
import { AlgoritmoGenetico } from '../classes/genClass';

@Injectable({providedIn: 'root'})
export class GeneticService {
  private colaAlgoritmos : AlgoritmoGenetico[] = [];
  constructor() { }

  getFunction(genOptions: AlgorithmOptions) {
    let res = new AlgoritmoGenetico(genOptions);


    this.colaAlgoritmos.push(res);


    console.log(this.colaAlgoritmos);

  }

}
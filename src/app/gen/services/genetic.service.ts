import { Injectable } from '@angular/core';
import { AlgorithmOptions } from '../interfaces/interfazFormAg';
import { AlgoritmoGenetico } from '../classes/genClass';

@Injectable({providedIn: 'root'})
export class GeneticService {
  constructor() { }

  getFunction(genOptions: AlgorithmOptions) {
    console.log('aqui estoy');

    let est = new AlgoritmoGenetico(genOptions);

  }

}
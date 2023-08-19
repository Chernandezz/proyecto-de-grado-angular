import * as math from 'mathjs';
import { AlgorithmOptions } from '../interfaces/interfazFormAg';
import { Individuo } from '../interfaces/Individuo';

class AlgoritmoGenetico {
  private expresionFuncionObjetivo!: (params: any) => number;
  private tipoSeleccion!: string;
  private tamanoPoblacion!: number;
  private tipoCruce!: string;
  private tipoMutacion!: string;
  private probabilidadCruce!: number;
  private probabilidadMutacion!: number;
  private numIteraciones!: number;
  private xmin!: number;
  private xmax!: number;
  private n!: number;
  private convergencia!: boolean;
  private Lind!: number;
  private elitismo!: boolean;
  private poblacion!: any[];

  constructor(agConfig: AlgorithmOptions) {
    this.initializeConfiguration(agConfig);
    this.ejecutar();
  }

  private initializeConfiguration(agConfig: AlgorithmOptions) {
    console.log(agConfig);

    this.n = agConfig.numDecimales;
    this.expresionFuncionObjetivo = this.createObjectiveFunction(
      agConfig.funcion
    );
    this.tipoSeleccion = agConfig.tipoSeleccion;
    this.tamanoPoblacion = agConfig.numIndividuos;
    this.tipoCruce = agConfig.tipoCruce;
    this.tipoMutacion = agConfig.tipoMutacion;
    this.probabilidadCruce = agConfig.probCruce;
    this.probabilidadMutacion = agConfig.probMutacion;
    this.numIteraciones = agConfig.numGeneraciones;
    this.xmin = agConfig.xMin;
    this.xmax = agConfig.xMax;
    this.convergencia = agConfig.convergencia;
    this.elitismo = agConfig.elitismo;
    this.Lind = this.calculateLindValue();
    this.poblacion = this.generarPoblacionInicial();

    console.log(this.poblacion);
  }

  generarPoblacionInicial(): Individuo[] {
    const poblacionInicial: Individuo[] = [];
    let fxTotal = 0;

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      const individuo: Individuo = {
        cromosoma: [],
        binario: '',
        xi: 0,
        fitness: 0,
        probabilidadAcumulada: 0,
        probabilidad: 0,
      };

      const cromosoma = [];
      for (let k = 0; k < this.Lind; k++) {
        cromosoma.push(Math.random() < 0.5 ? 0 : 1);
      }
      individuo.cromosoma = [...cromosoma];
      individuo.binario = cromosoma.join('');

      // Calcular los valores de xi

      const xi =
        this.xmin +
        (parseInt(individuo.binario, 2) * (this.xmax - this.xmin)) /
          (Math.pow(2, this.Lind) - 1);
      individuo.xi = xi;
      // Calcular el valor de fitness usando los valores de xi
      individuo.fitness = this.expresionFuncionObjetivo({ x: xi });

      fxTotal += individuo.fitness;

      poblacionInicial.push(individuo);
    }

    this.actualizarProbabilidades(poblacionInicial);

    return poblacionInicial;
  }

  private actualizarProbabilidades(poblacion: Individuo[]) {
    let probabilidadAcumulada = 0;
    let fxTotal = poblacion.reduce(
      (total, individuo) => total + individuo.fitness,
      0
    );

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      poblacion[i].probabilidad = poblacion[i].fitness / fxTotal;
      poblacion[i].probabilidadAcumulada =
        probabilidadAcumulada + poblacion[i].probabilidad;
      probabilidadAcumulada = poblacion[i].probabilidadAcumulada;
    }
  }

  private createObjectiveFunction(expression: string): (params: any) => number {
    const mathExpression = math.compile(expression);
    return (variables) => {
      const result = mathExpression.evaluate(variables);
      return Number(result.toFixed(this.n));
    };
  }

  private calculateLindValue(): number {
    return Math.ceil(
      Math.log2(1 + (this.xmax - this.xmin) * Math.pow(10, this.n))
    );
  }

  public ejecutar() {
    console.log('Ejecutando algoritmo genético');
    console.log('Expresion Funcion Objetivo:', this.expresionFuncionObjetivo);
    console.log('Tipo de Selección:', this.tipoSeleccion);
    console.log('Tamaño de Población:', this.tamanoPoblacion);
    console.log('Tipo de Cruce:', this.tipoCruce);
    console.log('Tipo de Mutación:', this.tipoMutacion);
    console.log('Probabilidad de Cruce:', this.probabilidadCruce);
    console.log('Probabilidad de Mutación:', this.probabilidadMutacion);
    console.log('Número de Iteraciones:', this.numIteraciones);
    console.log('Valor Mínimo de X:', this.xmin);
    console.log('Valor Máximo de X:', this.xmax);
    console.log('Número de Decimales (n):', this.n);
    console.log('Convergencia:', this.convergencia);
    console.log('Elitismo:', this.elitismo);
    console.log('Valor de Lind:', this.Lind);
  }
}

export { AlgoritmoGenetico };

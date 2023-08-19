import * as math from 'mathjs';
import { AlgorithmOptions } from '../interfaces/interfazFormAg';
import { Individuo } from '../interfaces/Individuo';
import { IndividuoPadre } from '../interfaces/IndividuoPadre';

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

    if (this.tipoSeleccion === 'ruleta' && this.seDebeNormalizar()) {
      this.normalizarPoblacion();
    }
  }

  private normalizarPoblacion(): void {
    // Encontrar el menor fitness de la población
    const minFitness = Math.min(
      ...this.poblacion.map((individuo) => individuo.fitness)
    );

    // Calcular el valor de fx para cada individuo
    this.poblacion = this.poblacion.map((individuo) => {
      individuo.fx = individuo.fitness - minFitness * 2;
      return individuo;
    });

    // Calcular la suma de los fx
    const fxTotal = this.poblacion.reduce(
      (total, individuo) => total + individuo.fx,
      0
    );

    let probabilidadAcumulada = 0;
    // Calcular la probabilidad de cada individuo
    for (let i = 0; i < this.tamanoPoblacion; i++) {
      this.poblacion[i]['probabilidad'] = this.poblacion[i]['fx'] / fxTotal;
      // Calcular la probabilidad acumulada de cada individuo
      this.poblacion[i]['probabilidadAcumulada'] =
        probabilidadAcumulada + this.poblacion[i]['probabilidad'];
      probabilidadAcumulada = this.poblacion[i]['probabilidadAcumulada'];
    }
  }

  private seDebeNormalizar(): boolean {
    const minFitness = Math.min(
      ...this.poblacion.map((individuo) => individuo.fitness)
    );
    return minFitness < 0 ? true : false;
  }

  private generarPoblacionInicial(): Individuo[] {
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

  // Paso Ejecutar

  private ejecutar() {
    let tablaInicial = this.limitarDecimales();
    let fitnessInicial = this.calculoFitnessTotal();
    let mejoresCromosomas = [];
    for (let i = 0; i < this.numIteraciones; i++) {
      const nuevaPoblacion = [];
      let cantidadHijos = this.tamanoPoblacion;

      if (this.elitismo) {
        const mejorIndividuo = this.poblacion.reduce((mejor, individuo) => {
          return individuo.fitness > mejor.fitness ? individuo : mejor;
        });
        nuevaPoblacion.push(mejorIndividuo);
        cantidadHijos--;
      }
      // Ciclo para llenar la nueva tabla
      while (cantidadHijos > 0) {
        const padre1 = this.seleccionarPadre();
        const padre2 = this.seleccionarPadre();
        const [hijo1, hijo2] = this.cruzar(padre1, padre2);
        const hijo1Mutado = this.mutar(hijo1);
        const hijo2Mutado = this.mutar(hijo2);
        if (cantidadHijos === 1) {
          nuevaPoblacion.push(hijo1Mutado);
          cantidadHijos--;
          break;
        }
        nuevaPoblacion.push(hijo1Mutado);
        nuevaPoblacion.push(hijo2Mutado);
        cantidadHijos -= 2;
      }
      let mejorCromosoma = this.poblacion.reduce(
        (mejor, cromosoma) =>
          cromosoma.fitness > mejor.fitness ? cromosoma : mejor,
        this.poblacion[0]
      );
      mejoresCromosomas.push(mejorCromosoma.fitness);
      this.actualizarPoblacion(nuevaPoblacion);
      if (this.convergencia) {
        if (this.verificarConvergencia()) {
          console.log(`Convergencia alcanzada en la iteración ${i + 1}`);
          break;
        }
      }
    }
    return {
      tablaInicial: tablaInicial,
      fitnessInicial: fitnessInicial,
      tablaFinal: this.limitarDecimales(),
      fitnessFinal: this.calculoFitnessTotal(),
      mejoresCromosomas: mejoresCromosomas,
    };
  }

  private seleccionarPadre() {
    let padre = null;
    switch (this.tipoSeleccion) {
      case 'ruleta':
        padre = this.seleccionarPadreRuleta();
        break;
      // case 'universal':
      //   padre = this.seleccionarPadreUniversal();
      //   break;
      // case 'torneo':
      //   padre = this.seleccionarPadreTorneo();
      //   break;
      // case 'ranking':
      //   padre = this.seleccionarPadreRanking();
      //   break;
      // case 'restos':
      //   padre = this.seleccionarPadreRestos();
      //   break;
      // case 'estocastico':
      //   padre = this.seleccionarPadreEstocastico();
      //   break;
      default:
        padre = this.seleccionarPadreRuleta();
        break;
    }
    return padre;
  }

  private seleccionarPadreRuleta() {
    const r = Math.random();
    const padre: IndividuoPadre = {};
    for (const individuo of this.poblacion) {
      if (r <= individuo.probabilidadAcumulada) {
        padre.cromosoma = [...individuo.cromosoma]; // Copiar el cromosoma en lugar de asignarlo directamente
        break;
      }
    }
    return padre;
  }

  private cruzar(padre1: Individuo, padre2: Individuo) {
    // Inicio Seccion de Cruces
    let hijos;
    if (Math.random() > this.probabilidadCruce) {
      return [padre1, padre2];
    }
    switch (this.tipoCruce) {
      case 'unPunto':
        hijos = this.cruzarUnPunto(padre1, padre2);
        break;
      // case 'dosPuntos':
      //   hijos = this.cruzarDosPuntos(padre1, padre2);
      //   break;
      // case 'uniforme':
      //   hijos = this.cruzarUniforme(padre1, padre2);
      //   break;
      // default:
      //   hijos = this.cruzarUnPunto(padre1, padre2);
      //   break;
    }
    return hijos;
  }

  private cruzarUnPunto(padre1: IndividuoPadre, padre2: IndividuoPadre) {
    const puntoCruce = Math.floor(Math.random() * this.Lind);
    const hijo1: IndividuoPadre = {
      cromosoma: [],
    };
    const hijo2: IndividuoPadre = {
      cromosoma: [],
    };

    hijo1.cromosoma = hijo1.cromosoma.concat(
      padre1.cromosoma.slice(0, puntoCruce)
    );
    hijo1.cromosoma = hijo1.cromosoma.concat(
      padre2.cromosoma.slice(puntoCruce)
    );

    hijo2.cromosoma = hijo2.cromosoma.concat(
      padre2.cromosoma.slice(0, puntoCruce)
    );
    hijo2.cromosoma = hijo2.cromosoma.concat(
      padre1.cromosoma.slice(puntoCruce)
    );

    return [hijo1, hijo2];
  }

  private calculoFitnessTotal(): number {
    let fxTotal = 0;
    for (const individuo of this.poblacion) {
      fxTotal += individuo['fitness'];
    }
    return fxTotal;
  }

  private limitarDecimales(): Individuo[] {
    let copiaPoblacion = JSON.parse(JSON.stringify(this.poblacion));
    for (let i = 0; i < this.tamanoPoblacion; i++) {
      copiaPoblacion[i].xi = parseFloat(copiaPoblacion[i].xi.toFixed(2));
      copiaPoblacion[i].fitness = parseFloat(
        copiaPoblacion[i].fitness.toFixed(2)
      );
      copiaPoblacion[i].probabilidad = parseFloat(
        copiaPoblacion[i].probabilidad.toFixed(2)
      );
      copiaPoblacion[i].probabilidadAcumulada = parseFloat(
        copiaPoblacion[i].probabilidadAcumulada.toFixed(2)
      );
    }
    return copiaPoblacion;
  }
}


export { AlgoritmoGenetico };

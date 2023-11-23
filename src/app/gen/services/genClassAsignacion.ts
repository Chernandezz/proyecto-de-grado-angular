import * as math from 'mathjs';
import { Individuo } from '../interfaces/interfaz-ag-asignacion/IndividuoAsignacion';
import { ResultadoAlgoritmo } from '../interfaces/Resultado';
import {
  AlgorithmOptionsAsignacion,
  arrCoeficiente,
  arrRestriccion,
} from '../interfaces/interfaz-ag-asignacion/estructura-formulario-ag-asignacion';

class AlgoritmoGeneticoAsignacion {
  public arrCoeficiente!: arrCoeficiente[];
  public arrRestriccion!: arrRestriccion[];
  public tipoSeleccion!: string;
  public tamanoPoblacion!: number;
  public tipoCruce!: string;
  public tipoMutacion!: string;
  public probabilidadCruce!: number;
  public probabilidadMutacion!: number;
  public numIteraciones!: number;
  public xMin!: number;
  public xMax!: number;
  public n!: number;
  public tipo!: string;
  public convergencia!: boolean;
  public Lind!: number;
  public elitismo!: boolean;
  public poblacion!: Individuo[];
  public resultado!: ResultadoAlgoritmo;
  public tituloEjecucion!: string;
  public LindTotal!: number;

  constructor(agConfig: AlgorithmOptionsAsignacion) {
    this.initializeConfiguration(agConfig);
    this.resultado = this.ejecutar();
  }

  private initializeConfiguration(agConfig: AlgorithmOptionsAsignacion) {
    this.arrCoeficiente = agConfig.arrCoeficiente;
    this.arrRestriccion = agConfig.arrRestriccion;

    this.n = agConfig.numDecimales;
    this.tipoSeleccion = agConfig.tipoSeleccion;
    this.tamanoPoblacion = agConfig.numIndividuos;
    this.tipoCruce = agConfig.tipoCruce;
    this.tipoMutacion = agConfig.tipoMutacion;
    this.probabilidadCruce = agConfig.probCruce;
    this.probabilidadMutacion = agConfig.probMutacion;
    this.numIteraciones = agConfig.numGeneraciones;
    this.xMin = agConfig.xMin;
    this.xMax = agConfig.xMax;
    this.convergencia = agConfig.convergencia;
    this.elitismo = agConfig.elitismo;
    this.calculateLindValue();
    this.poblacion = this.generarPoblacionInicial();
    this.tituloEjecucion = agConfig.tituloEjecucion;
  }

  private calculateLindValue(): void {
    /* Lo que se hace es sacar la cantidad de bits necesarios para representar el número más grande posible en el rango de valores, teniendo en cuenta la cantidad de decimales que selecciono el usuario y ya con el Lind, total se multiplica por la cantidad de variables que se tienen.

    Ej: xMin = 0, xMax = 5, n = 2, cantidad de variables = 3
    Lind = log2(1 + (xMax - xMin) * 10^n) * cantidad de variables
    Lind = log2(1 + (5 - 0) * 10^2) * 3 = log2(501) * 3 = ceil(8.96) * 3 = 27 bits
    */

    this.Lind = Math.ceil(
      Math.log2(1 + (this.xMax - this.xMin) * Math.pow(10, this.n))
    );
    this.LindTotal = this.Lind * this.arrCoeficiente.length;
  }

  private generarIndividuo(): Individuo {
    let individuo: Individuo = {
      cromosoma: [],
      binario: '',
      xi: 0,
      fitness: 0,
      probabilidadAcumulada: 0,
      probabilidad: 0,
      fx: 0,
    };

    // Se crea el valor de xi en base 
    // Aqui basicamente se tiene el for siguiente para recorrer la cantidad de variables que haya, por ejemplo si hay 5 variables xi, para eso esta el for de i, despues como cada variable tiene su valor de Lind, se recorre con el for de k, y se agrega el valor de xi en el cromosoma, entonces es como construir el cromosoma de cada individuo con sus valores de xi
    // el for de k basicamente construye el obj y el for de i es el que itera que se construya x1,x2,x3 etc
    for(let i = 0; i < this.arrCoeficiente.length; i++) {
      const xi = [];
      for (let k = 0; k < this.Lind; k++) {
        xi.push(Math.random() * (this.xMax - this.xMin) + this.xMin);
      }
      individuo.cromosoma.push(xi);
    }
    
    // se agrega el valor de xi en el cromosoma
    

    // Calculo de Z/
    let z = 0;
    for (let j = 0; j < this.Lind; j++) {
      z += individuo.cromosoma[j] * this.arrCoeficiente[j].value;
    }

    return individuo;
  }

  private generarPoblacionInicial(): Individuo[] {
    const poblacionInicial: Individuo[] = [];

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      let valido = false;
      let individuo: Individuo;
      do {
        individuo = this.generarIndividuo();
        valido = this.esIndividuoValido(individuo);
      } while (valido === false);

      
      // Se calcula el fitness del individuo
      let z = 0;
      for (let j = 0; j < this.Lind; j++) {
        z += individuo.cromosoma[j] * this.arrCoeficiente[j].value;
      }
      individuo.fitness = z;
      
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

  private ejecutar(): ResultadoAlgoritmo {
    let tablaInicial = [...this.poblacion];

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

        // Este ciclo continúa hasta que se llenen todos los hijos requeridos.
        let hijos = this.cruzar(padre1, padre2);
        hijos = hijos.map((hijo) => this.mutar(hijo));
        hijos.forEach((hijo) => {
          if (this.esIndividuoValido(hijo)) {
            if (cantidadHijos > 0) {
              nuevaPoblacion.push(hijo);
              cantidadHijos--;
            }
          } else {
            // Si el individuo no es válido, puedes elegir ignorarlo o generar uno nuevo.
          }
        });
      }

      // Actualizar la población con los nuevos hijos válidos
      this.actualizarPoblacion(nuevaPoblacion);

      // El resto del código...
      let mejorCromosoma = this.poblacion.reduce(
        (mejor, cromosoma) =>
          cromosoma.fitness > mejor.fitness ? cromosoma : mejor,
        this.poblacion[0]
      );
      mejoresCromosomas.push(mejorCromosoma.fitness);

      if (this.convergencia) {
        if (this.verificarConvergencia()) {
          console.log(`Convergencia alcanzada en la iteración ${i + 1}`);
          break;
        }
      }
    }

    const resultado: ResultadoAlgoritmo = {
      tablaInicial: tablaInicial,
      fitnessInicial: fitnessInicial,
      tablaFinal: [...this.poblacion],
      fitnessFinal: this.calculoFitnessTotal(),
      mejoresCromosomas: mejoresCromosomas,
    };

    return resultado;
  }

  private verificarConvergencia(): boolean {
    const xiInicial = this.poblacion[0].fitness;
    for (let i = 1; i < this.tamanoPoblacion; i++) {
      if (this.poblacion[i].fitness !== xiInicial) {
        return false;
      }
    }
    return true;
  }

  private actualizarPoblacion(nuevaPoblacion: Individuo[]) {
    for (const individuo of nuevaPoblacion) {
      individuo['binario'] = individuo.cromosoma.join('');

      // Calculo de Z/
      let z = 0;
      for (let j = 0; j < this.Lind; j++) {
        z += individuo.cromosoma[j] * this.arrCoeficiente[j].value;
      }
      individuo.xi = z;
    }

    let probabilidadAcumulada = 0;
    let fxTotal = nuevaPoblacion.reduce(
      (total, individuo) => total + individuo.fitness,
      0
    );

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      nuevaPoblacion[i].probabilidad = nuevaPoblacion[i].fitness / fxTotal;
      nuevaPoblacion[i].probabilidadAcumulada =
        probabilidadAcumulada + nuevaPoblacion[i].probabilidad;
      probabilidadAcumulada = nuevaPoblacion[i].probabilidadAcumulada;
    }
    this.poblacion = [...nuevaPoblacion];
  }

  private mutar(individuo: Individuo) {
    switch (this.tipoMutacion) {
      case 'bit-flip':
        individuo = this.mutarBitflip(individuo);
        break;
    }
    return individuo;
  }

  private mutarBitflip(individuo: Individuo) {
    // Método de mutación ajustado
    const individuoMutado = JSON.parse(JSON.stringify(individuo));
    const rangoTotal = this.xMax - this.xMin;

    for (let i = 0; i < this.Lind; i++) {
      if (Math.random() < this.probabilidadMutacion) {
        // Mutar basado en una fracción del rango total
        let cambio =
          (Math.random() - 0.5) * 2 * this.probabilidadMutacion * rangoTotal;
        individuoMutado.cromosoma[i] = Math.min(
          this.xMax,
          Math.max(this.xMin, individuoMutado.cromosoma[i] + cambio)
        );
      }
    }
    return individuoMutado;
  }

  private seleccionarPadre() {
    let padre = null;
    switch (this.tipoSeleccion) {
      case 'ruleta':
        padre = this.seleccionarPadreRuleta();
        break;
      default:
        padre = this.seleccionarPadreRuleta();
        break;
    }
    return padre;
  }

  private seleccionarPadreRuleta() {
    const r = Math.random();
    const padre: Individuo = {
      probabilidadAcumulada: 0,
      probabilidad: 0,
      cromosoma: [],
      binario: '',
      xi: 0,
      fitness: 0,
      fx: 0,
    };
    for (const individuo of this.poblacion) {
      if (r <= individuo.probabilidadAcumulada) {
        padre.cromosoma = [...individuo.cromosoma]; // Copiar el cromosoma en lugar de asignarlo directamente
        break;
      }
    }
    return padre;
  }

  private cruzar(padre1: Individuo, padre2: Individuo): Individuo[] {
    // Inicio Seccion de Cruces
    let hijos: Individuo[] = [];
    if (Math.random() > this.probabilidadCruce) {
      return [padre1, padre2];
    }
    switch (this.tipoCruce) {
      case 'un-punto':
        hijos = this.cruzarUnPunto(padre1, padre2);
        break;
      default:
        hijos = this.cruzarUnPunto(padre1, padre2);
        break;
    }
    return hijos;
  }

  private cruzarUnPunto(padre1: Individuo, padre2: Individuo) {
    const puntoCruce = Math.floor(Math.random() * this.Lind);
    const hijo1: Individuo = {
      probabilidadAcumulada: 0,
      probabilidad: 0,
      cromosoma: [],
      binario: '',
      xi: 0,
      fitness: 0,
      fx: 0,
    };
    const hijo2: Individuo = {
      probabilidadAcumulada: 0,
      probabilidad: 0,
      cromosoma: [],
      binario: '',
      xi: 0,
      fitness: 0,
      fx: 0,
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
  // Validar restricciones
  private esIndividuoValido(individuo: Individuo): boolean {
    let z = 0;
    for (let j = 0; j < this.Lind; j++) {
      z += individuo.cromosoma[j] * this.arrCoeficiente[j].value;
    }
    individuo.fitness = z; // Asumiendo que quieres actualizar xi aquí.

    for (let restriccion of this.arrRestriccion) {
      switch (restriccion.operador) {
        case '<=':
          if (z > restriccion.value) return false;
          break;
        case '>=':
          if (z < restriccion.value) return false;
          break;
        case '>':
          if (z <= restriccion.value) return false;
          break;
        case '<':
          if (z >= restriccion.value) return false;
          break;
        // Se asume que no hay otros operadores, pero aquí podrían añadirse si es necesario.
      }
    }
    return true;
  }

  private calculoFitnessTotal(): number {
    let xiTotal = 0;
    for (const individuo of this.poblacion) {
      xiTotal += individuo['fitness'];
    }
    return xiTotal;
  }
}

export { AlgoritmoGeneticoAsignacion };

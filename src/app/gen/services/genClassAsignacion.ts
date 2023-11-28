import { log, log2 } from 'mathjs';
import { Individuo } from '../interfaces/interfaz-ag-asignacion/IndividuoAsignacion';
import { ResultadoAlgoritmo } from '../interfaces/interfaz-ag-asignacion/Resultado-ag-asginacion';
import {
  AlgorithmOptionsAsignacion,
  arrCoeficiente,
  arrRestriccion,
} from '../interfaces/interfaz-ag-asignacion/estructura-formulario-ag-asignacion';

class AlgoritmoGeneticoAsignacion {
  public tipoSeleccion!: string;
  public arrCoeficiente!: arrCoeficiente[];
  public arrRestriccion!: arrRestriccion[];
  public tamanoPoblacion!: number;
  public tipoCruce!: string;
  public tipoMutacion!: string;
  public probabilidadCruce!: number;
  public probabilidadMutacion!: number;
  public numIteraciones!: number;
  public convergencia!: boolean;
  public tipo!: string;
  public numDecimales!: number;
  public elitismo!: boolean;
  public poblacion!: Individuo[];
  public resultado!: ResultadoAlgoritmo;
  public tituloEjecucion!: string;

  constructor(agConfig: AlgorithmOptionsAsignacion) {
    this.initializeConfiguration(agConfig);
    this.resultado = this.ejecutar();
  }

  private initializeConfiguration(agConfig: AlgorithmOptionsAsignacion) {
    this.arrCoeficiente = agConfig.arrCoeficiente;
    this.numDecimales = agConfig.numDecimales;
    this.probabilidadMutacion = agConfig.probMutacion;
    this.arrRestriccion = agConfig.arrRestriccion.map((restriccion) => ({
      ...restriccion,
      coeficientes:
        restriccion.coeficientes ||
        new Array(this.arrCoeficiente.length).fill(0),
    }));
    this.tipoSeleccion = agConfig.tipoSeleccion;

    this.tamanoPoblacion = agConfig.numIndividuos;
    this.tipoCruce = agConfig.tipoCruce;
    this.tipoMutacion = agConfig.tipoMutacion;
    this.probabilidadCruce = agConfig.probCruce;
    this.numIteraciones = agConfig.numGeneraciones;
    this.convergencia = agConfig.convergencia;
    this.elitismo = agConfig.elitismo;
    this.poblacion = this.generarPoblacionInicial();
    this.tituloEjecucion = agConfig.tituloEjecucion;
  }

  private generarPoblacionInicial(): Individuo[] {
    const poblacionInicial: Individuo[] = [];

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      let individuo: Individuo = this.crearIndividuo();

      // Verificar restricciones hasta que el individuo sea válido
      while (!this.esIndividuoValido(individuo)) {
        individuo = this.crearIndividuo();
      }

      poblacionInicial.push(individuo);
    }

    this.actualizarProbabilidades(poblacionInicial);
    return poblacionInicial;
  }

  private crearIndividuo(): Individuo {
    // Crear cromosomas basados en Lind para cada coeficiente
    const cromosomas = this.arrCoeficiente.map((coef) => {
      const Lind = Math.ceil(
        log2(1 + (coef.xMax - coef.xMin) * Math.pow(10, this.numDecimales))
      );
      return Array.from({ length: Lind }, () => (Math.random() < 0.5 ? 0 : 1));
    });

    // Concatenar todos los cromosomas para crear la representación binaria
    const binario = cromosomas.map((cromosoma) => cromosoma.join('')).join('');

    // Calcular fitness y xi
    const { fitness, xi } = this.calcularFitnessXi(cromosomas);

    const valoresDecimalesXi = cromosomas.map((cromosoma, index) => {
      return this.binarioADecimal(cromosoma, this.arrCoeficiente[index]);
    });

    return {
      cromosomas: cromosomas,
      binario: binario,
      xi: xi,
      fitness: fitness,
      probabilidadAcumulada: 0,
      probabilidad: 0,
      fx: 0,
      valoresDecimalesXi: valoresDecimalesXi,
    };
  }

  private binarioADecimal(cromosoma: number[], coef: arrCoeficiente): number {
    const valorBinario = parseInt(cromosoma.join(''), 2);
    const rango = Math.pow(2, coef.Lind) - 1;
    return coef.xMin + (valorBinario / rango) * (coef.xMax - coef.xMin);
  }

  private calcularFitnessXi(cromosomas: number[][]): {
    fitness: number;
    xi: number;
  } {
    let z = 0;
    let xi = 0; // Asumiendo que xi es algún tipo de valor calculado

    for (let j = 0; j < this.arrCoeficiente.length; j++) {
      const valorCromosoma = parseInt(cromosomas[j].join(''), 2); // Convertir cromosoma a número
      z += valorCromosoma * this.arrCoeficiente[j].value;
      // Calcular xi si es necesario
    }

    return { fitness: z, xi: xi };
  }

  private esIndividuoValido(individuo: Individuo): boolean {
    for (let restriccion of this.arrRestriccion) {
      if (!this.cumpleRestriccion(individuo, restriccion)) {
        return false;
      }
    }
    return true;
  }

  private cumpleRestriccion(
    individuo: Individuo,
    restriccion: arrRestriccion
  ): boolean {
    const z = individuo.fitness; // o calcular z si es necesario
    switch (restriccion.operador) {
      case '<=':
        return z <= restriccion.value;
      case '>=':
        return z >= restriccion.value;
      case '>':
        return z > restriccion.value;
      case '<':
        return z < restriccion.value;
      default:
        return true; // Manejar operadores desconocidos
    }
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

  private mutar(individuo: Individuo): Individuo {
    switch (this.tipoMutacion) {
      case 'bit-flip':
        return this.mutarBitflip(individuo);
      default:
        return individuo;
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
      let mejorCromosoma = this.poblacion.reduce(
        (mejor, cromosomas) =>
          cromosomas.fitness > mejor.fitness ? cromosomas : mejor,
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

  private aplanarCromosomas(cromosomas: number[][]): number[] {
    return cromosomas.reduce(
      (acumulado, actual) => acumulado.concat(actual),
      []
    );
  }

  private actualizarPoblacion(nuevaPoblacion: Individuo[]) {
    let fxTotal = nuevaPoblacion.reduce(
      (total, individuo) => total + individuo.fitness,
      0
    );

    nuevaPoblacion.forEach((individuo, index) => {
      // Actualizar la representación binaria y el fitness

      individuo.binario = this.aplanarCromosomas(individuo.cromosomas).join('');
      const { fitness } = this.calcularFitnessXi(individuo.cromosomas);
      individuo.fitness = fitness;

      // Calcular probabilidad y probabilidad acumulada
      individuo.probabilidad = individuo.fitness / fxTotal;
      individuo.probabilidadAcumulada =
        index === 0
          ? individuo.probabilidad
          : nuevaPoblacion[index - 1].probabilidadAcumulada +
            individuo.probabilidad;
    });

    this.poblacion = [...nuevaPoblacion];
  }

  private mutarBitflip(individuo: Individuo): Individuo {
    // Crear una copia del objeto individuo antes de modificarlo
    const individuoMutado: Individuo = JSON.parse(JSON.stringify(individuo));

    // Iterar sobre cada cromosoma
    individuoMutado.cromosomas.forEach((cromosoma, indiceCromosoma) => {
      // Iterar sobre cada gen en el cromosoma
      cromosoma.forEach((gen, indiceGen) => {
        // Aplicar la mutación con la probabilidad definida
        if (Math.random() < this.probabilidadMutacion) {
          individuoMutado.cromosomas[indiceCromosoma][indiceGen] =
            gen === 0 ? 1 : 0;
        }
      });
    });

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

  private seleccionarPadreRuleta(): Individuo {
    const r = Math.random();
    let padre: Individuo = this.crearEstructuraIndividuoVacio();

    for (const individuo of this.poblacion) {
      if (r <= individuo.probabilidadAcumulada) {
        padre = {
          ...individuo, // Copia todas las propiedades del individuo seleccionado
          cromosomas: individuo.cromosomas.map((cromosoma) => [...cromosoma]), // Asegúrate de hacer una copia profunda de los cromosomas
        };
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

  private cruzarUnPunto(padre1: Individuo, padre2: Individuo): Individuo[] {
    // Seleccionar un punto de cruce al azar para cada cromosoma
    const puntosCruce = this.arrCoeficiente.map((coef) =>
      Math.floor(Math.random() * coef.Lind)
    );

    const hijo1: Individuo = this.crearEstructuraIndividuoVacio();
    const hijo2: Individuo = this.crearEstructuraIndividuoVacio();

    // Realizar el cruce para cada par de cromosomas
    for (let i = 0; i < this.arrCoeficiente.length; i++) {
      if (padre1.cromosomas[i] && padre2.cromosomas[i]) {
        hijo1.cromosomas[i] = padre1.cromosomas[i]
          .slice(0, puntosCruce[i])
          .concat(padre2.cromosomas[i].slice(puntosCruce[i]));
        hijo2.cromosomas[i] = padre2.cromosomas[i]
          .slice(0, puntosCruce[i])
          .concat(padre1.cromosomas[i].slice(puntosCruce[i]));
      } else {
      }
    }

    // Actualizar el resto de propiedades de los hijos
    this.actualizarPropiedadesIndividuo(hijo1);
    this.actualizarPropiedadesIndividuo(hijo2);

    return [hijo1, hijo2];
  }

  private crearEstructuraIndividuoVacio(): Individuo {
    return {
      cromosomas: [],
      binario: '',
      xi: 0,
      fitness: 0,
      probabilidadAcumulada: 0,
      probabilidad: 0,
      fx: 0,
      valoresDecimalesXi: [], // Inicializar como arreglo vacío
    };
  }

  private actualizarPropiedadesIndividuo(individuo: Individuo) {
    individuo.binario = this.aplanarCromosomas(individuo.cromosomas).join('');
    const { fitness, xi } = this.calcularFitnessXi(individuo.cromosomas);
    individuo.fitness = fitness;
    individuo.xi = xi;

    // Recalcular valores decimales de xi
    individuo.valoresDecimalesXi = individuo.cromosomas.map(
      (cromosoma, index) => {
        return this.binarioADecimal(cromosoma, this.arrCoeficiente[index]);
      }
    );
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

import { re } from 'mathjs';
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
    const genotipo = this.crearGenotipo();
    const fenotipo = this.crearFenotipo(genotipo);

    const z = this.calcularFitnessXi(fenotipo);
    // Concatenar todos los cromosomas para crear la representación binaria
    const binario = genotipo.map((cromosoma) => cromosoma.join('')).join('');

    return {
      genotipos: genotipo,
      binario: binario,
      fenotipos: fenotipo,
      fitness: z,
      probabilidadAcumulada: 0,
      probabilidad: 0,
    };
  }

  private binarioADecimal(cromosoma: number[]): number {
    return parseInt(cromosoma.join(''), 2);
  }

  private crearGenotipo(): number[][] {
    let genotipo = this.arrCoeficiente.map((coef) => {
      return Array.from({ length: coef.Lind }, () =>
        Math.random() < 0.5 ? 0 : 1
      );
    });
    return genotipo;
  }

  // Formula para calcular el valor decimal de cada xi, entran los genotipos y retorna los fenotipos
  private crearFenotipo(genotipo: number[][]): number[] {
    let fenotipo: number[] = [];
    genotipo.forEach((cromosoma, index) => {
      fenotipo.push(
        Math.ceil(
          this.arrCoeficiente[index].xMin +
            (this.binarioADecimal(cromosoma) *
              (this.arrCoeficiente[index].xMax -
                this.arrCoeficiente[index].xMin)) /
              (Math.pow(2, this.arrCoeficiente[index].Lind) - 1)
        )
      );
    });
    return fenotipo;
  }

  private calcularFitnessXi(fenotipo: number[]): number {
    let z = 0;
    this.arrCoeficiente.forEach((coef, index) => {
      z += coef.value * fenotipo[index];
    });
    return z;
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
    let sumatoria = 0;
    restriccion.coeficientes.forEach((coef, index) => {
      sumatoria += coef * individuo.fenotipos[index];
    });

    switch (restriccion.operador) {
      case '<=':
        return sumatoria <= restriccion.value;
      case '>=':
        return sumatoria >= restriccion.value;
      case '>':
        return sumatoria > restriccion.value;
      case '<':
        return sumatoria < restriccion.value;
      default:
        return true; // Manejar operadores desconocidos
    }
  }

  private actualizarProbabilidades(poblacion: Individuo[]) {
    let probabilidadAcumulada = 0;
    let fitnessTotal = poblacion.reduce(
      (total, individuo) => total + individuo.fitness,
      0
    );

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      poblacion[i].probabilidad = poblacion[i].fitness / fitnessTotal;
      poblacion[i].probabilidadAcumulada =
        probabilidadAcumulada + poblacion[i].probabilidad;
      probabilidadAcumulada = poblacion[i].probabilidadAcumulada;
    }
  }

  private mutar(individuo: Individuo): void {
    switch (this.tipoMutacion) {
      case 'bit-flip':
        this.mutarBitflip(individuo);
        break;
      default:
        this.mutarBitflip(individuo);
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

        // Mutar los hijos
        hijos.map((hijo) => this.mutar(hijo));

        // Creacion de los fenotipos de los hijos
        hijos[0].fenotipos = this.crearFenotipo(hijos[0].genotipos);
        hijos[1].fenotipos = this.crearFenotipo(hijos[1].genotipos);

        // Calculo Fitness hijos
        hijos[0].fitness = this.calcularFitnessXi(hijos[0].fenotipos);
        hijos[1].fitness = this.calcularFitnessXi(hijos[1].fenotipos);
        
        // Generacion Binario Hijos
        hijos[0].binario = this.aplanarCromosomas(hijos[0].genotipos).join('');
        hijos[1].binario = this.aplanarCromosomas(hijos[1].genotipos).join('');
        
        hijos.forEach((hijo) => {
          if (this.esIndividuoValido(hijo)) {
            if (cantidadHijos > 0) {
              nuevaPoblacion.push(hijo);
              cantidadHijos--;
            }
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
    let fitnessTotal = nuevaPoblacion.reduce(
      (total, individuo) => total + individuo.fitness,
      0
    );

    nuevaPoblacion.forEach((individuo, index) => {
      individuo.probabilidad = individuo.fitness / fitnessTotal;
      individuo.probabilidadAcumulada =
        index === 0
          ? individuo.probabilidad
          : individuo.probabilidad + nuevaPoblacion[index - 1].probabilidad;
    });

    this.poblacion = [...nuevaPoblacion];
  }

  private mutarBitflip(individuo: Individuo): void {
    // Crear una copia del objeto individuo antes de modificarlo
    individuo.genotipos.forEach((cromosoma) => {
      cromosoma.forEach((gen, index) => {
        if (Math.random() < this.probabilidadMutacion) {
          cromosoma[index] = gen === 0 ? 1 : 0;
        }
      });
    });
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

    for (const individuo of this.poblacion) {
      if (r <= individuo.probabilidadAcumulada) {
        let individuoCopia = JSON.parse(JSON.stringify(individuo));
        return individuoCopia;
      }
    }

    return JSON.parse(
      JSON.stringify(this.poblacion[this.poblacion.length - 1])
    );
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
    const puntoCruce = Math.floor(Math.random() * padre1.genotipos.length - 1);

    const hijo1: Individuo = this.crearEstructuraIndividuoVacio();
    const hijo2: Individuo = this.crearEstructuraIndividuoVacio();

    // Lo que se hace aqui en cruzar un punto no es tener el cromosoma completo y luego cortarlo
    // lo que se hace en el la lista de genotipos se toma uno de los arreglos completo y se pasa al otro

    for (let i = 0; i < padre1.genotipos.length; i++) {
      if (i <= puntoCruce) {
        hijo1.genotipos.push(padre1.genotipos[i]);
        hijo2.genotipos.push(padre2.genotipos[i]);
      } else {
        hijo1.genotipos.push(padre2.genotipos[i]);
        hijo2.genotipos.push(padre1.genotipos[i]);
      }
    }

    return [hijo1, hijo2];
  }

  private crearEstructuraIndividuoVacio(): Individuo {
    return {
      genotipos: [],
      binario: '',
      fenotipos: [],
      fitness: 0,
      probabilidadAcumulada: 0,
      probabilidad: 0,
    };
  }

  private calculoFitnessTotal(): number {
    let fitnessTotal = 0;
    for (const individuo of this.poblacion) {
      fitnessTotal += individuo['fitness'];
    }
    return fitnessTotal;
  }
}

export { AlgoritmoGeneticoAsignacion };

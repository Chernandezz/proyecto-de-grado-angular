import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneticService } from '../../services/genetic.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  arrCoeficiente,
  arrRestriccion,
} from '../../interfaces/interfaz-ag-asignacion/estructura-formulario-ag-asignacion';
import { log2 } from 'mathjs';

interface Formulario {
  arrRestriccion: arrRestriccion[];
  arrCoeficiente: arrCoeficiente[];
  convergencia: boolean;
  elitismo: boolean;
  numGeneraciones: number;
  numIndividuos: number;
  probCruce: number;
  probMutacion: number;
  tipo: string;
  Lind: number;
  tipoCruce: string;
  tipoMutacion: string;
  tipoSeleccion: string;
  tituloEjecucion: string;
  xMax: number;
  xMin: number;
}

@Component({
  selector: 'gen-formulario-asignacion',
  templateUrl: './formulario-asignacion.component.html',

  styleUrls: ['./formulario-asignacion.component.css'],
})
export class FormularioAsignacionComponent {
  public asignacionCoeficientes: boolean = true;
  public asignacionRestricciones: boolean = false;
  public totalLind: number = 0;
  public mostrarFormulario: boolean = false;
  public operadores: string[] = ['<', '>', '<=', '>='];
  public coeficientesArray: arrCoeficiente[] = [
    {
      value: 0,
      Lind: 10, // Valor predeterminado o según tus requerimientos
      xMin: 0, // Valor mínimo inicial
      xMax: 10, // Valor máximo inicial
    },
  ];

  agregarCoeficiente() {
    this.coeficientesArray.push({
      value: 0,
      Lind: 10, // Valor predeterminado o según tus requerimientos
      xMin: 0,
      xMax: 10, // Valor máximo inicial
    });
  }

  eliminarCoeficiente(index: number) {
    this.coeficientesArray.splice(index, 1);
  }

  eliminarRestriccion(index: number) {
    this.restriccionesArray.splice(index, 1);
  }

  public restriccionesArray: arrRestriccion[] = [];

  agregarRestriccion() {
    this.restriccionesArray.push({
      coeficientes: new Array(this.coeficientesArray.length).fill(0),
      operador: '<=',
      value: 0,
    });
  }

  navegarARestricciones(): void {
    this.asignacionCoeficientes = false;
    this.asignacionRestricciones = true;
    this.mostrarFormulario = false;
    this.actualizarLindXi(this.coeficientesArray);
  }

  navegarACoeficientes(): void {
    this.asignacionCoeficientes = true;
    this.asignacionRestricciones = false;
    this.mostrarFormulario = false;
  }

  navegarAFormulario(): void {
    this.asignacionCoeficientes = false;
    this.asignacionRestricciones = false;
    this.mostrarFormulario = true;
  }

  public formularioInicialAlgoritmo: FormGroup = this.fb.group({
    tipoSeleccion: ['ruleta', Validators.required],
    tipoCruce: ['un-punto', Validators.required],
    tipoMutacion: ['bit-flip', Validators.required],
    probCruce: [
      0.8,
      [Validators.required, Validators.min(0), Validators.max(1)],
    ],
    probMutacion: [
      0.1,
      [Validators.required, Validators.min(0), Validators.max(1)],
    ],
    numDecimales: [2, Validators.min(0)],
    elitismo: false,
    convergencia: false,
    numGeneraciones: [1000, [Validators.required, Validators.min(5)]],
    numIndividuos: [5, [Validators.required]],
    tituloEjecucion: ['', [Validators.required, Validators.maxLength(15)]],
  });

  isValidField(field: string): boolean {
    const fieldControl = this.formularioInicialAlgoritmo.get(field);
    return (fieldControl?.touched && fieldControl?.invalid) || false;
  }

  constructor(
    private fb: FormBuilder,
    private geneticService: GeneticService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  private showToast(message: string, isSuccess: boolean) {
    if (isSuccess) {
      this.toastr.success('', message, {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        tapToDismiss: true,
      });
    } else {
      this.toastr.error('', message, {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        tapToDismiss: true,
      });
    }
  }

  irAResultados() {
    if (!this.geneticService.getListaTerminados.length) {
      this.showToast('Agregue algoritmos a la cola', false);
      return;
    }
    this.router.navigate(['/genetico/resultados']);
  }

  actualizarLindXi(coeficientes: arrCoeficiente[]) {
    this.totalLind = 0;
    coeficientes.forEach((coef) => {
      coef.Lind = Math.ceil(log2(1 + (coef.xMax - coef.xMin)));
      this.totalLind += coef.Lind;
    });
  }

  onSubmit() {
    this.verificarNombreEjecucion();
    if (this.formularioInicialAlgoritmo.invalid) {
      this.formularioInicialAlgoritmo.markAllAsTouched();
      return;
    }
    const tituloEjecucion =
      this.formularioInicialAlgoritmo.value['tituloEjecucion'];
    this.showToast(`${tituloEjecucion} - agregado con exito!`, true);
    // Funcion para actualizar todos los lind de los xi

    // Llamado al servicio para la ejecucion del algoritmo que se agrego a la cola
    this.geneticService.getFunctionAsignacion(
      this.formularioInicialAlgoritmo.value as Formulario,
      this.coeficientesArray,
      this.restriccionesArray
    );
  }

  verificarNombreEjecucion() {
    const nombre = this.formularioInicialAlgoritmo.value['tituloEjecucion'];
    const isNombreRepetido = this.geneticService.getListaTerminados.some(
      (algo) => algo.tituloEjecucion === nombre
    );
    if (isNombreRepetido) {
      this.formularioInicialAlgoritmo.controls['tituloEjecucion'].setErrors({
        repetido: true,
      });
      this.showToast(`${nombre} - Ya existe!`, false);
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneticService } from '../../services/genetic.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  arrCoeficiente,
  arrRestriccion,
} from '../../interfaces/interfaz-ag-asignacion/estructura-formulario-ag-asignacion';

interface Formulario {
  arrRestriccion: arrRestriccion[];
  arrCoeficiente: arrCoeficiente[];
  convergencia: boolean;
  elitismo: boolean;
  numDecimales: number;
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
  public mostrarFormulario: boolean = false;
  public operadores: string[] = ['<', '>', '<=', '>='];
  public coeficientesArray: arrCoeficiente[] = [
    {
      index: 1,
      value: 0,
    },
  ];

  agregarCoeficiente() {
    this.coeficientesArray.push({
      index: this.coeficientesArray.length + 1,
      value: 0,
    });
  }

  eliminarCoeficiente(index: number) {
    this.coeficientesArray.splice(index, 1);
    // Reindexar los coeficientes restantes
    this.coeficientesArray.forEach((coef, i) => (coef.index = i + 1));
  }

  eliminarRestriccion(index: number) {
    this.restriccionesArray.splice(index, 1);
  }

  public restriccionesArray: arrRestriccion[] = [];

  agregarRestriccion() {
    this.restriccionesArray.push({
      operador: '<=',
      value: 0,
    });
  }

  navegarARestricciones(): void {
    this.asignacionCoeficientes = false;
    this.asignacionRestricciones = true;
    this.mostrarFormulario = false;
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
    elitismo: false,
    convergencia: false,
    numGeneraciones: [1000, [Validators.required, Validators.min(5)]],
    numIndividuos: [5, [Validators.required]],
    tituloEjecucion: ['', [Validators.required, Validators.maxLength(15)]],
    xMin: [0],
    xMax: [10],
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

  onSubmit() {
    this.verificarNombreEjecucion();
    if (this.formularioInicialAlgoritmo.invalid) {
      this.formularioInicialAlgoritmo.markAllAsTouched();
      return;
    }
    const tituloEjecucion =
      this.formularioInicialAlgoritmo.value['tituloEjecucion'];
    this.showToast(`${tituloEjecucion} - agregado con exito!`, true);
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneticService } from '../../services/genetic.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface Formulario {
  funcion: string;
  tipoSeleccion: string;
  tipoCruce: string;
  tipoMutacion: string;
  probCruce: number;
  probMutacion: number;
  numDecimales: number;
  elitismo: boolean;
  convergencia: boolean;
  numGeneraciones: number;
  numIndividuos: number;
  xMin: number;
  xMax: number;
  tituloEjecucion: string;
}

@Component({
  selector: 'gen-agform',
  templateUrl: './agform.component.html',
  styleUrls: ['./agform.component.css'],
})
export class AGFormComponent {
  
  public formularioInicialAlgoritmo: FormGroup = this.fb.group({
    funcion: ['2x+2', Validators.required],
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
    numIndividuos: [100, [Validators.required, Validators.min(5)]],
    xMin: [0],
    xMax: [10],
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

  onSubmit() {
    this.verificarNombreEjecucion();
    if (this.formularioInicialAlgoritmo.invalid) {
      this.formularioInicialAlgoritmo.markAllAsTouched();
      return;
    }
    const tituloEjecucion =
      this.formularioInicialAlgoritmo.value['tituloEjecucion'];
    this.showToast(`${tituloEjecucion} - agregado con exito!`, true);
    this.geneticService.getFunction(
      this.formularioInicialAlgoritmo.value as Formulario
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

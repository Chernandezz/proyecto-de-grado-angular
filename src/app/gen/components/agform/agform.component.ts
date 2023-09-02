import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneticService } from '../../services/genetic.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) {}

  onSubmit() {
    this.verificarNombreEjecucion();
    if (this.formularioInicialAlgoritmo.invalid) {
      this.formularioInicialAlgoritmo.markAllAsTouched();
      return;
    }
    this.toastr.success(
      '',
      `${this.formularioInicialAlgoritmo.value['tituloEjecucion']} - agregado con exito!`,
      {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        tapToDismiss: true,
      }
    );
    this.geneticService.getFunction(this.formularioInicialAlgoritmo.value);
  }

  verificarNombreEjecucion() {
    let nombre = this.formularioInicialAlgoritmo.value['tituloEjecucion'];
    this.geneticService.getColaAlgoritmos.forEach((algo) => {
      if (algo.tituloEjecucion === nombre) {
        this.formularioInicialAlgoritmo.controls['tituloEjecucion'].setErrors({
          repetido: true,
        });
        this.toastr.error(
          '',
          `${this.formularioInicialAlgoritmo.value['tituloEjecucion']} - Ya existe!`,
          {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'increasing',
            tapToDismiss: true,
          }
        );
      }
    });
  }
}

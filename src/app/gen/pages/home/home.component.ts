import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneticService } from '../../services/genetic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'gen-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
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
    numGeneraciones: [1000, Validators.min(1)],
    numIndividuos: [100, Validators.min(1)],
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
}

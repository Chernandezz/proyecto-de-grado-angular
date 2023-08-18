import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'gen-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public formularioInicialAlgoritmo: FormGroup = this.fb.group({
    funcion: ['', Validators.required],
    tipoSeleccion: ['ruleta', Validators.required],
    tipoCruce: ['un_punto', Validators.required],
    tipoMutacion: ['un_punto', Validators.required],
    probCruce: [
      0.8,
      [Validators.required, Validators.min(0), Validators.max(1)],
    ],
    probMutacion: [
      0.1,
      [Validators.required, Validators.min(0), Validators.max(1)],
    ],
    numDecimales: [2, Validators.min(0)],
    elitisimo: false,
    convergencia: false,
    numGeneraciones: [1000, Validators.min(1)],
    numIndividuos: [1000, Validators.min(1)],
    xMin: [0],
    xMax: [10],
    tituloEjecucion: ['', Validators.required],
  });

  isValidField(field: string): boolean {
    const fieldControl = this.formularioInicialAlgoritmo.get(field);
    return (fieldControl?.touched && fieldControl?.invalid) || false;
  }

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.formularioInicialAlgoritmo.invalid) {
      this.formularioInicialAlgoritmo.markAllAsTouched();
      return;
    }
    console.log(this.formularioInicialAlgoritmo.value);

    this.formularioInicialAlgoritmo.reset({
      funcion: this.formularioInicialAlgoritmo.value['funcion']
    });
  }
}

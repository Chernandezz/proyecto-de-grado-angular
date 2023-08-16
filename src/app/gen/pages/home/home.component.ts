import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'gen-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  formularioInicialAlgoritmo = this.fb.group({
    funcion: ['', Validators.required],
    tipoSeleccion: ['', Validators.required],
    tipoCruce: ['', Validators.required],
    tipoMutacion: ['', Validators.required],
    probCruce: [0.8, Validators.required],
    probMutacion: [0.1, Validators.required],
    numDecimales: 2,
    elitisimo: false,
    convergencia: false,
    numGeneraciones: 1000,
    numIndividuos: 1000,
    xMin: 0,
    xMax: 10,
    tituloEjecucion: '',
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log(this.formularioInicialAlgoritmo.value);
  }
}

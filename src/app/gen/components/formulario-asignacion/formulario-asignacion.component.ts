import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'gen-formulario-asignacion',
  templateUrl: './formulario-asignacion.component.html',
  styleUrls: ['./formulario-asignacion.component.css'],
})
export class FormularioAsignacionComponent {
  form: FormGroup;
  variables: number[] = [1]; // Inicialmente solo mostramos x1

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      x: this.fb.array([this.fb.control('')]), // Inicialmente solo tenemos un control para x1
    });
  }

  onInputChange(index: number, event: any) {
    const input = event.target;
    if (input.value && index === this.variables.length - 1) {
      this.variables.push(this.variables.length + 1);
    }
  }
}

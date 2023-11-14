import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gen-info-algoritmo-funcion',
  templateUrl: './info-algoritmo-funcion.component.html',
  styleUrls: ['./info-algoritmo-funcion.component.css'],
})
export class InfoAlgoritmoFuncionComponent implements OnInit {
  @Input() info: any;

  constructor() {}

  ngOnInit() {
  }
}

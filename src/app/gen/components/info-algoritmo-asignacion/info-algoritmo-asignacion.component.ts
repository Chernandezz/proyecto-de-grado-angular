import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gen-info-algoritmo-asignacion',
  templateUrl: './info-algoritmo-asignacion.component.html',
  styleUrls: ['./info-algoritmo-asignacion.component.css'],
})
export class InfoAlgoritmoAsignacionComponent implements OnInit {
  @Input() info: any;

  constructor() {}

  ngOnInit() {
  }
}

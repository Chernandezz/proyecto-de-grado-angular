import { Component, OnInit } from '@angular/core';
import { GeneticService } from '../../services/genetic.service';

@Component({
  selector: 'gen-graphics',
  templateUrl: './graphics.component.html',
  styles: [],
})
export class GraphicsComponent implements OnInit {
  public mostrarResultados: boolean = false;

  constructor(private geneticService: GeneticService) {}

  ngOnInit() {
    // Observar la bandera del servicio para mostrar los resultados
    this.geneticService.getMostrarResultadosService$.subscribe((mostrar) => {
      this.mostrarResultados = mostrar;
      console.log('mostrarResultados', mostrar);
      
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { GeneticService } from '../../services/genetic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gen-graphics',
  templateUrl: './graphics.component.html',
  styles: [],
})
export class GraphicsComponent implements OnInit {
  public mostrarResultados: boolean = false;

  constructor(private geneticService: GeneticService, private router: Router) {}

  ngOnInit() {
    if (this.geneticService.getListaTerminados.length === 0) {
      this.router.navigate(['/formulario']);
    }
    // Observar la bandera del servicio para mostrar los resultados
    this.geneticService.getMostrarResultadosService$.subscribe((mostrar) => {
      this.mostrarResultados = mostrar;
    });

    // Observar la cola de algoritmos para mostrar los resultados
  }
}

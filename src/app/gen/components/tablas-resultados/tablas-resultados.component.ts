import { Component } from '@angular/core';
import { GeneticService } from '../../services/genetic.service';
import { AlgoritmoGenetico } from '../../services/genClass';

@Component({
  selector: 'gen-tablas-resultados',
  templateUrl: './tablas-resultados.component.html',
  styleUrls: ['./tablas-resultados.component.css'],
})
export class TablasResultadosComponent {
  public dataTablas: AlgoritmoGenetico[] = [];
  constructor(private gen: GeneticService) {}
  panelAbierto: number | null = null;

  // ... el resto de tu código ...

  togglePanel(i: number): void {
    this.panelAbierto = this.panelAbierto === i ? null : i;
  }

  ngOnInit(): void {
    this.gen.getColaAlgoritmos$.subscribe((mostrar) => {
      this.dataTablas = [...mostrar];
    });
  }

  getTotalFitness(tabla: any[]): number {
    if (!tabla || tabla.length === 0) return 0;
    return tabla.reduce((sum, current) => sum + current.fitness, 0);
  }
}

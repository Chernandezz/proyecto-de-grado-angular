import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneticService } from '../../services/genetic.service';

@Component({
  selector: 'lista-terminados',
  templateUrl: './lista-terminados.component.html',
  styles: [],
})
export class ListaTerminadosComponent {
  public listaTerminados: { tituloEjecucion: string; terminado: boolean }[] =
    [];
  private subscription: Subscription;
  constructor(private gen: GeneticService) {
    this.subscription = this.gen.getListaTerminados$.subscribe((cola) => {
      this.listaTerminados = cola;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

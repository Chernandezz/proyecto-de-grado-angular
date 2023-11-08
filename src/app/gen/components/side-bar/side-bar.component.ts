import { Component, OnDestroy, Input } from '@angular/core';
import { GeneticService } from '../../services/genetic.service';
import { Subscription } from 'rxjs';
import { AlgoritmoGenetico } from '../../services/genClass';

@Component({
  selector: 'gen-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnDestroy {
  @Input() showBackButton: boolean = true;
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

  eliminarAlgoritmo(nombre: string) {
    this.gen.eliminarAlgoritmo(nombre);
  }

  limpiarCola() {
    this.gen.limpiarCola();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { GeneticService } from '../../services/genetic.service';
import { Subscription } from 'rxjs';
import { AlgoritmoGenetico } from '../../classes/genClass';

@Component({
  selector: 'gen-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnDestroy {
  colaAlgoritmos: AlgoritmoGenetico[] = [];
  private subscription: Subscription;

  constructor(private gen: GeneticService) {
    this.subscription = this.gen.getColaAlgoritmos$.subscribe((cola) => {
      this.colaAlgoritmos = cola;
    });
  }

  eliminarAlgoritmo(nombre: string){
    this.gen.eliminarAlgoritmo(nombre);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

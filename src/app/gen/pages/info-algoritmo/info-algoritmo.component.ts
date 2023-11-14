// info-algoritmo.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneticService } from '../../services/genetic.service';
import { AlgoritmoGenetico } from '../../services/genClass';
import { AlgoritmoGeneticoAsignacion } from '../../services/genClassAsignacion';

@Component({
  selector: 'app-info-algoritmo',
  templateUrl: './info-algoritmo.component.html',
  styleUrls: ['./info-algoritmo.component.css'],
})
export class infoAlgoritmoComponent implements OnInit {
  tituloEjecucion!: string;
  infoAg?: AlgoritmoGenetico | AlgoritmoGeneticoAsignacion;
  errorMensaje?: string;

  constructor(
    private route: ActivatedRoute,
    private geneticService: GeneticService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.tituloEjecucion = params.get('titulo') || '';
      if (this.tituloEjecucion) {
        this.retrieveAlgorithmInfo(this.tituloEjecucion);
      }
    });
  }

  retrieveAlgorithmInfo(titulo: string) {
    this.geneticService.getListaTerminados$.subscribe((terminados) => {
      const estaTerminado = terminados.find(
        (alg) => alg.tituloEjecucion === titulo && alg.terminado
      );

      if (estaTerminado) {
        this.geneticService.getColaAlgoritmos$.subscribe((algorithms) => {
          const foundAlgorithm = algorithms.find(
            (algo) => algo.tituloEjecucion === titulo
          );
          if (foundAlgorithm) {
            this.infoAg = foundAlgorithm;
            this.errorMensaje = undefined;
          } else {
            this.errorMensaje = `Información no disponible para el algoritmo ${titulo}.`;
            this.infoAg = undefined;
          }
        });
      } else {
        this.errorMensaje = `El algoritmo ${titulo} aún no ha terminado de ejecutarse`;
        this.infoAg = undefined;
      }
    });
  }
}

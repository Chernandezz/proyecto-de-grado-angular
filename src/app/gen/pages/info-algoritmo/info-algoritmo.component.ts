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
  data: (AlgoritmoGenetico | AlgoritmoGeneticoAsignacion)[] = [];
  infoAg!: AlgoritmoGenetico | AlgoritmoGeneticoAsignacion;

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
    this.geneticService.getColaAlgoritmos$.subscribe((algorithms) => {
      const foundAlgorithm = algorithms.find(
        (algo) => algo.tituloEjecucion === titulo
      );
      if (foundAlgorithm) {
        this.infoAg = foundAlgorithm;
      } else {
        console.error(`No se encontró el algoritmo con título ${titulo}`);
      }
    });
  }

  isFuncionTipo(
    infoAg: AlgoritmoGenetico | AlgoritmoGeneticoAsignacion
  ): infoAg is AlgoritmoGenetico {
    return infoAg.tipo === 'funcion';
  }

  isAsignacionTipo(
    infoAg: AlgoritmoGenetico | AlgoritmoGeneticoAsignacion
  ): infoAg is AlgoritmoGeneticoAsignacion {
    return infoAg.tipo === 'asignacion';
  }
}

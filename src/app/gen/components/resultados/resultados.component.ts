import { Component, OnInit } from '@angular/core';
import { GeneticService } from '../../services/genetic.service';
import { Chart, ChartDataset } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chart.js/auto';
import { AlgoritmoGenetico } from '../../services/genClass';

@Component({
  selector: 'gen-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css'],
})
export class ResultadosComponent implements OnInit {
  public chart: any;
  public showGraph: boolean = false;

  constructor(private gen: GeneticService) {}

  ngOnInit(): void {
    this.gen.getColaAlgoritmos$.subscribe((mostrar) => {
      this.createChart(mostrar);
    });
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createChart(algoritmos: AlgoritmoGenetico[]) {
    const labels = Object.keys(algoritmos[0].resultado.mejoresCromosomas).map(
      (_, index) => index + 1
    );

    const datasets: ChartDataset[] = [];
    algoritmos.forEach((algoritmo) => {
      datasets.push({
        data: Object.values(algoritmo.resultado.mejoresCromosomas),
        label: algoritmo.tituloEjecucion,
        borderColor: this.getRandomColor(),
        fill: false,
      });
    });

    // Aplicar muestreo de datos
    const sampleSize = 1000; // Número de puntos de datos a mostrar
    const step = Math.ceil(labels.length / sampleSize);
    const sampledLabels = labels.filter((_, index) => index % step === 0);
    const sampledDatasets = datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.filter((_, index) => index % step === 0),
    }));

    this.chart = new Chart('MyChart', {
      type: 'line',
      data: {
        labels: sampledLabels,
        datasets: sampledDatasets,
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            display: true,
            title: {
              display: true,
              text: 'Generación',
            },
          },
          y: {
            type: 'linear',
            display: true,
            title: {
              display: true,
              text: 'Fitness',
            },
          },
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x',
            },
          },
        },
      },
    });
    Chart.register(zoomPlugin);
  }
}

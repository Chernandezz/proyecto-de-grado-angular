// import { Component, ViewChild } from '@angular/core';
// import {
//   ChartComponent,
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexXAxis,
//   ApexDataLabels,
//   ApexTitleSubtitle,
//   ApexStroke,
//   ApexGrid,
// } from 'ng-apexcharts';
// import { GeneticService } from '../../services/genetic.service';

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
//   dataLabels: ApexDataLabels;
//   grid: ApexGrid;
//   stroke: ApexStroke;
//   title: ApexTitleSubtitle;
// };

// @Component({
//   selector: 'gen-lines-chart',
//   templateUrl: './lines-chart.component.html',
//   styles: [],
// })
// export class LinesChartComponent {
//   constructor(private geneticService: GeneticService) {
//     this.seriesResultados();
//   }
//   @ViewChild('chart') chart!: ChartComponent;
//   public chartOptions: ChartOptions = {
//     series: [],
//     chart: {
//       height: 350,
//       type: 'line',
//       zoom: {
//         enabled: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       curve: 'smooth',
//     },
//     title: {
//       text: 'Tabla de fitness',
//       align: 'left',
//     },
//     grid: {
//       row: {
//         colors: ['#f3f3f3', 'transparent'],
//         opacity: 0.5,
//       },
//     },
//     xaxis: {},
//   };

//   public seriesResultados() {
//     this.geneticService.getColaAlgoritmos.forEach((algoritmo) => {
//       const mejoresCromosomas = algoritmo.resultado.mejoresCromosomas;

//       // Calcula el salto en función del número de elementos en el eje x
//       const elementosTotales = mejoresCromosomas.length;
//       const salto = Math.max(Math.floor(elementosTotales / 10), 1); // Divide en 10 partes si es posible, o 1 si no lo es
    
//       const serie: nuevo = {
//         name: algoritmo.tituloEjecucion,
//         data: mejoresCromosomas,
//       };
//       this.chartOptions.series.push(serie);

//       // Establece las categorías en el eje x con el salto calculado
//       this.chartOptions.xaxis.categories = mejoresCromosomas.map((_, index) =>
//         index % salto === 0 ? index + 1 : ''
//       );
//     });
//   }
// }

// interface nuevo {
//   name?: string;
//   type?: string;
//   color?: string;
//   group?: string;
//   data:
//     | (number | null)[]
//     | {
//         x: any;
//         y: any;
//         fillColor?: string;
//         strokeColor?: string;
//         meta?: any;
//         goals?: any;
//         barHeightOffset?: number;
//         columnWidthOffset?: number;
//       }[]
//     | [number, number | null][]
//     | [number, (number | null)[]][]
//     | number[][];
// }
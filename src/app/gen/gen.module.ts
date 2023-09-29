import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { agFuncionComponent } from './pages/ag-funcion/ag-funcion.component';
import { GenRoutingModule } from './gen-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GraphicsComponent } from './pages/graphics/graphics.component';
// import { LinesChartComponent } from './components/lines-chart/lines-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { AGFormComponent } from './components/agform/agform.component';
import { ListaTerminadosComponent } from './components/lista-terminados/lista-terminados.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { InicioComponent } from './pages/inicio/inicio/inicio.component';
import { FormularioAsignacionComponent } from './components/formulario-asignacion/formulario-asignacion.component';
import { agAsignacionComponent } from './pages/ag-asignacion/ag-asignacion.component';

@NgModule({
  declarations: [
    agFuncionComponent,
    agAsignacionComponent,
    SideBarComponent,
    AGFormComponent,
    ListaTerminadosComponent,
    GraphicsComponent,
    ResultadosComponent,
    InicioComponent,
    FormularioAsignacionComponent,
  ],
  imports: [
    CommonModule,
    GenRoutingModule,
    ReactiveFormsModule,
    NgApexchartsModule,
  ],
})
export class GenModule {}

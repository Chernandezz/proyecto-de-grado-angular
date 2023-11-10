import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { agFuncionComponent } from './pages/ag-funcion/ag-funcion.component';
import { GraphicsComponent } from './pages/graphics/graphics.component';
import { InicioComponent } from './pages/inicio/inicio/inicio.component';
import { agAsignacionComponent } from './pages/ag-asignacion/ag-asignacion.component';
import { infoAlgoritmoComponent } from './pages/info-algoritmo/info-algoritmo.component';

const routes: Routes = [
  {
    path: 'formulario',
    component: agFuncionComponent,
  },
  {
    path: 'formularioAsignacion',
    component: agAsignacionComponent,
  },
  {
    path: 'resultados',
    component: GraphicsComponent,
  },
  {
    path: 'info/:titulo',
    component: infoAlgoritmoComponent,
  },
  {
    path: '',
    component: InicioComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenRoutingModule {}

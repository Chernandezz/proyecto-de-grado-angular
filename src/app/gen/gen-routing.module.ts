import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { agFuncionComponent } from './pages/ag-funcion/ag-funcion.component';
import { GraphicsComponent } from './pages/graphics/graphics.component';
import { InicioComponent } from './pages/inicio/inicio/inicio.component';

const routes: Routes = [
  {
    path: 'formulario',
    component: agFuncionComponent,
  },
  {
    path: 'resultados',
    component: GraphicsComponent,
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

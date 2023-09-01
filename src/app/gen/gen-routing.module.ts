import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GraphicsComponent } from './pages/graphics/graphics.component';



const routes: Routes = [
  {
    path: 'formulario',
    component: HomeComponent,
  },
  // {
  //   path: 'resultados',
  //   component: GraphicsComponent,
  // },
  {
    path: '**',
    redirectTo: 'formulario',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'genetico',
    loadChildren: () => import('./gen/gen.module').then((m) => m.GenModule),
  },
  {
    path: '**',
    redirectTo: 'genetico',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

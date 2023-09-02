import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { GenRoutingModule } from './gen-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
// import { GraphicsComponent } from './pages/graphics/graphics.component';
// import { LinesChartComponent } from './components/lines-chart/lines-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { AGFormComponent } from './components/agform/agform.component';

@NgModule({
  declarations: [HomeComponent, SideBarComponent, AGFormComponent],
  imports: [
    CommonModule,
    GenRoutingModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    
  ],
})
export class GenModule {}

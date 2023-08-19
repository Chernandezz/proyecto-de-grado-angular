import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { GenRoutingModule } from './gen-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GraphicsComponent } from './pages/graphics/graphics.component';

@NgModule({
  declarations: [HomeComponent, GraphicsComponent],
  imports: [CommonModule, GenRoutingModule, ReactiveFormsModule],
})
export class GenModule {}

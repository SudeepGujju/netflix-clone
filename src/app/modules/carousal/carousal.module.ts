import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarousalListComponent } from './carousal-list/carousal-list.component';
import { CarousalCardComponent } from './carousal-card/carousal-card.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    CarousalListComponent,
    CarousalCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    CarousalListComponent,
    CarousalCardComponent
  ]
})
export class CarousalModule { }

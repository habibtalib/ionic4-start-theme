import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PointsPage } from './points.page';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

const routes: Routes = [
  {
    path: '',
    component: PointsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ZXingScannerModule
  ],
  declarations: [PointsPage]
})
export class PointsPageModule {}

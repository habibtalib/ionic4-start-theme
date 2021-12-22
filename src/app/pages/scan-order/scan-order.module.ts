import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScanOrderPage } from './scan-order.page';

import { ZXingScannerModule } from '@zxing/ngx-scanner';

const routes: Routes = [
  {
    path: '',
    component: ScanOrderPage
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
  declarations: [ScanOrderPage]
})
export class ScanOrderPageModule {}

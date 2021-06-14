import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CheckBlacklistedPage } from './check-blacklisted.page';

const routes: Routes = [
  {
    path: '',
    component: CheckBlacklistedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckBlacklistedPage]
})
export class CheckBlacklistedPageModule {}

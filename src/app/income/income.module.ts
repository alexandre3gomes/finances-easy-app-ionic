import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { EditIncomeComponent } from './edit-income/edit-income.component';
import { IncomePage } from './income.page';

const routes: Routes = [
  {
    path: '',
    component: IncomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ IncomePage, EditIncomeComponent ],
  entryComponents: [ EditIncomeComponent ]
})
export class IncomePageModule { }

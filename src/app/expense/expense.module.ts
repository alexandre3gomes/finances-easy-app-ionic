import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { ExpensePage } from './expense.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExpensePage, EditExpenseComponent],
  entryComponents: [EditExpenseComponent]
})
export class ExpensePageModule { }

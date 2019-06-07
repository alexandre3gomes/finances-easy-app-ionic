import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthPageModule'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canLoad: [AuthGuard]
  },
  { path: 'category', loadChildren: './category/category.module#CategoryPageModule', canLoad: [AuthGuard] },
  { path: 'income', loadChildren: './income/income.module#IncomePageModule', canLoad: [AuthGuard] },
  { path: 'expense', loadChildren: './expense/expense.module#ExpensePageModule', canLoad: [AuthGuard] },
  { path: 'budget', loadChildren: './budget/budget.module#BudgetPageModule', canLoad: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule', canLoad: [AuthGuard] },
  { path: 'income', loadChildren: './income/income.module#IncomePageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

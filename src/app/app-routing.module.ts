import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'category', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'expense', loadChildren: './expense/expense.module#ExpensePageModule' },
  { path: 'budget', loadChildren: './budget/budget.module#BudgetPageModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes , { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

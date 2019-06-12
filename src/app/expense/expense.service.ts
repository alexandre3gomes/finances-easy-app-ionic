import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Expense } from '../shared/model/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private expenseEndPoint = environment.api.concat('expense');
  private _expenses = new BehaviorSubject<Expense[]>([]);
  private currentPage = 0;
  private _totalPages;

  constructor(private http: HttpClient) { }

  get expenses() {
    return this._expenses.asObservable();
  }

  get totalPages() {
    return this._totalPages;
  }

  canScroll() {
    return this.currentPage < this.totalPages;
  }

  incrementPage() {
    this.currentPage++;
  }

  resetPage() {
    this.currentPage = 0;
  }

  fetchExpenses() {
    let loadedExpenses: Expense[];
    return this.http.get(this.expenseEndPoint.concat('/list'), {
      params: new HttpParams().set('page', this.currentPage.toString())
        .set('size', '10')
    }).pipe(
      switchMap((page: any) => {
        this._totalPages = page.totalPages;
        loadedExpenses = page.content;
        return this.expenses;
      }),
      take(1),
      map((exps: Expense[]) => {
        const newExpenses = [ ...exps, ...loadedExpenses ];
        return this._expenses.next(newExpenses);
      })
    );
  }

  createExpense(expense: Expense) {
    let newExpense: Expense;
    return this.http.post<Expense>(this.expenseEndPoint.concat('/create'), expense).pipe(
      switchMap((exp: Expense) => {
        newExpense = exp;
        return this.expenses;
      }),
      take(1),
      tap(exps => {
        this._expenses.next(exps.concat(newExpense).sort((exp1, exp2) => exp1.name.localeCompare(exp2.name)));
      })
    );
  }

  editExpense(expense: Expense) {
    return this.http.post<Expense>(this.expenseEndPoint.concat('/update'), expense).pipe(
      map((exp: Expense) => {
        return exp;
      })
    );
  }

  deleteExpense(id: number) {
    return this.http.delete<number>(this.expenseEndPoint.concat('/delete/').concat(id.toString())).pipe(
      switchMap(() => {
        return this.expenses;
      }),
      take(1),
      tap(exps => {
        this._expenses.next(exps.filter(elem => elem.id !== id));
      })
    );
  }
}

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

  private _expenseEndPoint = environment.api.concat('expense');
  private _expenses = new BehaviorSubject<Expense[]>([]);
  private _canScroll = new BehaviorSubject<boolean>(true);
  private _currentPage = 0;

  constructor(private http: HttpClient) { }

  get expenses() {
    return this._expenses.asObservable();
  }

  canScroll() {
    return this._canScroll.asObservable();
  }

  incrementPage() {
    this._currentPage++;
  }

  resetPage() {
    this._currentPage = 0;
  }

  resetExpenses() {
    this._expenses.next([]);
  }

  fetchExpenses() {
    let loadedExpenses: Expense[];
    return this.http.get(this._expenseEndPoint, {
      params: new HttpParams().set('page', this._currentPage.toString())
        .set('size', '10')
    }).pipe(
      switchMap((page: any) => {
        this._canScroll.next(page.totalPages > this._currentPage);
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
    return this.http.post<Expense>(this._expenseEndPoint, expense).pipe(
      switchMap((exp: Expense) => {
        newExpense = exp;
        return this.expenses;
      }),
      take(1),
      tap(exps => {
        const newExpenses = [ ...exps ];
        newExpenses.pop();
        newExpenses.unshift(newExpense);
        newExpenses.sort((exp1, exp2) => new Date(exp2.expireAt).getTime() - new Date(exp1.expireAt).getTime());
        this._expenses.next(newExpenses);
      })
    );
  }

  editExpense(expense: Expense) {
    return this.http.post<Expense>(this._expenseEndPoint.concat('/update'), expense).pipe(
      switchMap(() => {
        return this.expenses;
      }),
      take(1),
      tap(exps => {
        const newExpenses = [ ...exps ];
        newExpenses.sort((exp1, exp2) => new Date(exp2.expireAt).getTime() - new Date(exp1.expireAt).getTime());
        this._expenses.next(newExpenses);
      })
    );
  }

  deleteExpense(id: number) {
    return this.http.delete<number>(this._expenseEndPoint.concat('/').concat(id.toString())).pipe(
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

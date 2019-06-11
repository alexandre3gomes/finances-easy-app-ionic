import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Expense } from '../shared/model/expense.model';
import { Income } from '../shared/model/income.model';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private dashboardEndpoint = environment.api.concat('dashboard');
  private _incomes = new BehaviorSubject<Income[]>([]);
  private _expenses = new BehaviorSubject<Expense[]>([]);

  constructor(private http: HttpClient) { }

  get actualIncomes() {
    return this._incomes.asObservable().pipe(
      map(incs => {
        return incs.reduce((inc, inc1) => inc + inc1.value, 0);
      })
    );
  }

  get actualExpenses() {
    return this._expenses.asObservable().pipe(
      map(exps => {
        return exps.reduce((exp, exp1) => exp + exp1.value, 0);
      })
    );
  }


  fetchActualIncomes() {
    return this.http.get<Income[]>(this.dashboardEndpoint.concat('/actualIncome')).pipe(
      take(1),
      map((incs: Income[]) => {
        return this._incomes.next(incs);
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  }

  fetchActualExpenses() {
    return this.http.get<Expense[]>(this.dashboardEndpoint.concat('/actualExpense')).pipe(
      map((exps: Expense[]) => {
        return this._expenses.next(exps);
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  }

}

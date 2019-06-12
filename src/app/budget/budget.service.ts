import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Budget } from '../shared/model/budget/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private budgetEndPoint = environment.api.concat('budget');
  private _budgets = new BehaviorSubject<Budget[]>([]);
  private currentPage = 0;
  private _totalPages;

  constructor(private http: HttpClient) { }

  get budgets() {
    return this._budgets.asObservable();
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

  fetchBudgets() {
    let loadedBudgets: Budget[];
    return this.http.get(this.budgetEndPoint.concat('/list'), {
      params: new HttpParams().set('page', this.currentPage.toString())
        .set('size', '10')
    }).pipe(
      switchMap((page: any) => {
        this._totalPages = page.totalPages;
        loadedBudgets = page.content;
        return this.budgets;
      }),
      take(1),
      map((exps: Budget[]) => {
        const newBudgets = [ ...exps, ...loadedBudgets ];
        return this._budgets.next(newBudgets);
      })
    );
  }

  createBudget(budget: Budget) {
    let newBudget: Budget;
    return this.http.post<Budget>(this.budgetEndPoint.concat('/create'), budget).pipe(
      switchMap((exp: Budget) => {
        newBudget = exp;
        return this.budgets;
      }),
      take(1),
      tap(exps => {
        this._budgets.next(exps.concat(newBudget).sort((bud1, bud2) => new Date(bud1.startDate).getTime() - new Date(bud2.endDate).getTime()));
      })
    );
  }

  editBudget(budget: Budget) {
    return this.http.post<Budget>(this.budgetEndPoint.concat('/update'), budget).pipe(
      map((exp: Budget) => {
        return exp;
      })
    );
  }

  deleteBudget(id: number) {
    return this.http.delete<number>(this.budgetEndPoint.concat('/delete/').concat(id.toString())).pipe(
      switchMap(() => {
        return this.budgets;
      }),
      take(1),
      tap(exps => {
        this._budgets.next(exps.filter(elem => elem.id !== id));
      })
    );
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Income } from '../shared/model/income.model';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  private _incomeEndPoint = environment.api.concat('income');
  private _incomes = new BehaviorSubject<Income[]>([]);
  private _canScroll = new BehaviorSubject<boolean>(true);
  private _currentPage = 0;

  constructor(private http: HttpClient) { }

  get incomes() {
    return this._incomes.asObservable();
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

  resetIncomes() {
    this._incomes.next([]);
  }

  fetchIncomes() {
    let loadedIncomes: Income[];
    return this.http.get(this._incomeEndPoint, {
      params: new HttpParams().set('page', this._currentPage.toString())
        .set('size', '10')
    }).pipe(
      switchMap((page: any) => {
        this._canScroll.next(page.totalPages > this._currentPage);
        loadedIncomes = page.content;
        return this.incomes;
      }),
      take(1),
      map((incs: Income[]) => {
        const newIncomes = [ ...incs, ...loadedIncomes ];
        return this._incomes.next(newIncomes);
      })
    );
  }

  createIncome(income: Income) {
    let newIncome: Income;
    return this.http.post<Income>(this._incomeEndPoint, income).pipe(
      switchMap((inc: Income) => {
        newIncome = inc;
        return this.incomes;
      }),
      take(1),
      tap(incs => {
        const newIncomes = [ ...incs ];
        newIncomes.pop();
        newIncomes.unshift(newIncome);
        newIncomes.sort((inc1, inc2) => new Date(inc2.date).getTime() - new Date(inc1.date).getTime());
        this._incomes.next(newIncomes);
      })
    );
  }

  editIncome(income: Income) {
    return this.http.post<Income>(this._incomeEndPoint.concat('/update'), income).pipe(
      switchMap(() => {
        return this.incomes;
      }),
      take(1),
      tap(incs => {
        const newIncomes = [ ...incs ];
        newIncomes.sort((inc1, inc2) => new Date(inc2.date).getTime() - new Date(inc1.date).getTime());
        this._incomes.next(newIncomes);
      })
    );
  }

  deleteIncome(id: number) {
    return this.http.delete<number>(this._incomeEndPoint.concat('/').concat(id.toString())).pipe(
      switchMap(() => {
        return this.incomes;
      }),
      take(1),
      tap(incs => {
        this._incomes.next(incs.filter(elem => elem.id !== id));
      })
    );
  }
}

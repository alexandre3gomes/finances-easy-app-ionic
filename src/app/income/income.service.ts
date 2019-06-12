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

  private incomeEndPoint = environment.api.concat('income');
  private _incomes = new BehaviorSubject<Income[]>([]);
  private currentPage = 0;
  private _totalPages;

  constructor(private http: HttpClient) { }

  get incomes() {
    return this._incomes.asObservable();
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

  fetchIncomes() {
    let loadedIncomes: Income[];
    return this.http.get(this.incomeEndPoint.concat('/list'), {
      params: new HttpParams().set('page', this.currentPage.toString())
        .set('size', '10')
    }).pipe(
      switchMap((page: any) => {
        this._totalPages = page.totalPages;
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
    return this.http.post<Income>(this.incomeEndPoint.concat('/create'), income).pipe(
      switchMap((exp: Income) => {
        newIncome = exp;
        return this.incomes;
      }),
      take(1),
      tap(incs => {
        this._incomes.next(incs.concat(newIncome).sort((inc1, inc2) => new Date(inc2.date.toISOString()).getTime() - new Date(inc1.date).getTime()));
      })
    );
  }

  editIncome(income: Income) {
    return this.http.post<Income>(this.incomeEndPoint.concat('/update'), income).pipe(
      map((exp: Income) => {
        return exp;
      })
    );
  }

  deleteIncome(id: number) {
    return this.http.delete<number>(this.incomeEndPoint.concat('/delete/').concat(id.toString())).pipe(
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

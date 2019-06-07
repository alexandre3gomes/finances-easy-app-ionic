import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Income } from '../shared/model/income.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private dashboardEndpoint = environment.api.concat('dashboard');
  public _incomes = new BehaviorSubject<Income[]>([]);

  constructor(private http: HttpClient) { }

  get actualIncomes() {
    return this._incomes.asObservable().pipe(
      map(incs => {
        return incs.reduce((inc, inc1) => inc + inc1.value, 0);
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

}

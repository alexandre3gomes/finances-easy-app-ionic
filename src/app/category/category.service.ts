import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Category } from '../shared/model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryEndPoint = environment.api.concat('category');
  private _categories = new BehaviorSubject<Category[]>([]);
  private currentPage = 0;

  constructor(private http: HttpClient, alert: AlertController) { }

  get categories() {
    return this._categories.asObservable();
  }

  fetchCategories() {
    return this.http.get(this.categoryEndPoint.concat('/list'), {
      params: new HttpParams().set('page', this.currentPage.toString())
        .set('size', '10')
    }).pipe(
      map((page: any) => {
        return this._categories.next(page.content);
      })
    );
  }
}

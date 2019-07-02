import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Category } from '../shared/model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _categoryEndPoint = environment.api.concat('category');
  private _categories = new BehaviorSubject<Category[]>([]);
  private _canScroll = new BehaviorSubject<boolean>(true);
  private _currentPage = 0;

  constructor(private http: HttpClient) { }

  get categories() {
    return this._categories.asObservable();
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

  resetCategories() {
    this._categories.next([]);
  }

  fetchCategories() {
    let loadedCategories: Category[];
    return this.http.get(this._categoryEndPoint, {
      params: new HttpParams().set('page', this._currentPage.toString())
        .set('size', '10')
    }).pipe(
      switchMap((page: any) => {
        this._canScroll.next(page.totalPages > this._currentPage);
        loadedCategories = page.content;
        return this.categories;
      }),
      take(1),
      map((cats: Category[]) => {
        const newCategories = [...cats, ...loadedCategories];
        return this._categories.next(newCategories);
      })
    );
  }

  createCategory(category: Category) {
    let newCategory: Category;
    return this.http.post<Category>(this._categoryEndPoint, category).pipe(
      switchMap((cat: Category) => {
        newCategory = cat;
        return this.categories;
      }),
      take(1),
      tap(cats => {
        const newCategories = [...cats];
        newCategories.pop();
        newCategories.unshift(newCategory);
        newCategories.sort((cat1, cat2) => cat1.name.localeCompare(cat2.name));
        this._categories.next(newCategories);
      })
    );
  }

  editCategory(category: Category) {
    return this.http.post<Category>(this._categoryEndPoint.concat('/update'), category).pipe(
      switchMap(() => {
        return this.categories;
      }),
      take(1),
      tap(cats => {
        const newCategories = [...cats];
        newCategories.sort((cat1, cat2) => cat1.name.localeCompare(cat2.name));
        this._categories.next(newCategories);
      })
    );
  }

  deleteCategory(id: number) {
    return this.http.delete<number>(this._categoryEndPoint.concat('/').concat(id.toString())).pipe(
      switchMap(() => {
        return this.categories;
      }),
      take(1),
      tap(cats => {
        this._categories.next(cats.filter(elem => elem.id !== id));
      })
    );
  }

  fetchAllCategories() {
    let loadedCategories: Category[];
    return this.http.get(this._categoryEndPoint, {
      params: new HttpParams().set('page', this._currentPage.toString())
        .set('size', '999')
    }).pipe(
      switchMap((page: any) => {
        this._canScroll.next(page.totalPages > this._currentPage);
        loadedCategories = page.content;
        return this.categories;
      }),
      take(1),
      map(() => {
        const newCategories = [...loadedCategories];
        return this._categories.next(newCategories);
      })
    );
  }
}

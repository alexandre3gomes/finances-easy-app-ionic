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

  private categoryEndPoint = environment.api.concat('category');
  private _categories = new BehaviorSubject<Category[]>([]);
  private currentPage = 0;

  constructor(private http: HttpClient) { }

  get categories() {
    return this._categories.asObservable();
  }

  incrementPage() {
    this.currentPage++;
  }

  resetPage() {
    this.currentPage = 0;
  }

  fetchCategories() {
    let loadedCategoriews: Category[];
    return this.http.get(this.categoryEndPoint.concat('/list'), {
      params: new HttpParams().set('page', this.currentPage.toString())
        .set('size', '10')
    }).pipe(
      switchMap((page: any) => {
        loadedCategoriews = page.content;
        return this.categories;
      }),
      map((cats: Category[]) => {
        return this._categories.next([...cats, ...loadedCategoriews]);
      })
    );
  }

  createCategory(category: Category) {
    let newCategory: Category;
    return this.http.post<Category>(this.categoryEndPoint.concat('/create'), category).pipe(
      switchMap((cat: Category) => {
        newCategory = cat;
        return this.categories;
      }),
      take(1),
      tap(cats => {
        this._categories.next(cats.concat(newCategory).sort((cat1, cat2) => cat1.name.localeCompare(cat2.name)));
      })
    );
  }

  editCategory(category: Category) {
    return this.http.post<Category>(this.categoryEndPoint.concat('/update'), category).pipe(
      map((cat: Category) => {
        return cat;
      })
    );
  }

  deleteCategory(id: number) {
    return this.http.delete<number>(this.categoryEndPoint.concat('/delete/').concat(id.toString())).pipe(
      switchMap(() => {
        return this.categories;
      }),
      take(1),
      tap(cats => {
        this._categories.next(cats.filter(elem => elem.id !== id));
      })
    );
  }
}

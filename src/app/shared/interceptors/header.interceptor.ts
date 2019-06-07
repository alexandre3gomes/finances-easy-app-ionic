import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // loader start
    let token: string;
    this.authService.token.subscribe(tok => {
      token = tok
    });
    const modified = req.clone({ setHeaders: { 'Authorization': 'Bearer ' + token } });
    return next.handle(modified).pipe(
      map((event: HttpHeaderResponse) => {
        if (event.status === 200) {
          // loader stop
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          // Message error
          // loader stop
        } else {
          this.router.navigate(['/auth']);
          // loader stop
          return throwError(error);
        }
      })
    );
  }

}

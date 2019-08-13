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
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    private alertCtrl: AlertController) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loading = this.loadingCtrl.create({ keyboardClose: true, message: this.translate.instant('Loading') });
    const alert = this.alertCtrl.create(
      {
        header: this.translate.instant('Error'),
        message: this.translate.instant('There is some error'),
        buttons: [ this.translate.instant('Close') ]
      }
    );
    loading.then(loadingEl => loadingEl.present());

    let token: string;
    this.authService.token.subscribe(tok => {
      token = tok;
    });
    const modified = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
    return next.handle(modified).pipe(
      map((event: HttpHeaderResponse) => {
        if (event.status === 200) {
          loading.then(loadingEl => loadingEl.dismiss());
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          alert.then(alertEl => {
            alertEl.message = this.translate.instant('There is relationed data');
            alertEl.present();
          });
        } else if (error.status === 401) {
          alert.then(alertEl => {
            alertEl.message = this.translate.instant('Please login again');
            alertEl.present();
          });
          this.router.navigate([ '/auth' ]);
        } else {
          alert.then(alertEl => alertEl.present());
          this.router.navigate([ '/auth' ]);
        }
        loading.then(loadingEl => loadingEl.dismiss());
        return throwError(error);
      })
    );
  }
}

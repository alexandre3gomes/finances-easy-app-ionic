import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../shared/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;
  private logonEndpoint = environment.api.concat('public/logon');
  private userEndpoint = environment.api.concat('user');

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient, private router: Router) { }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          username: string;
          name: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          +parsedData.userId,
          parsedData.name,
          parsedData.username,
          '',
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  login(user: User) {
    return this.http.post<User>(this.logonEndpoint.concat('/login'), user).pipe(
      map((us: User) => {
        this.setUserData(us);
        this.router.navigateByUrl('/home');
      }),
      catchError((err) => {
        console.error(err);
        return of();
      })
    );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    return this.http.get<void>(this.userEndpoint.concat('/logout')).pipe(
      map(() => {
        this._user.next(null);
        Plugins.Storage.remove({ key: 'authData' });
        this.router.navigate(['/auth']);
      }),
      catchError((err) => {
        return of(console.log(err));
      })
    );

  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(user: User) {
    const expirationTime = new Date(
      new Date().getTime() + + 3600 * 1000
    );
    user.tokenExpirationDate = expirationTime;
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    Plugins.Storage.set({ key: 'authData', value: JSON.stringify(user) });
    Plugins.Storage.get({ key: 'authData' }).then(authData => console.log(authData.value));
  }
}

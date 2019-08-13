import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../shared/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

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

  get loggedUser() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user;
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
          id: string;
          username: string;
          name: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          +parsedData.id,
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
          this.setUserData(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  login(user: User) {
    return this.http.post<User>(this.logonEndpoint.concat('/login'), user).pipe(
      take(1),
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
      take(1),
      map(() => {
        this._user.next(new User(-1, '', '', '', '', new Date()));
        Plugins.Storage.remove({ key: 'authData' });
        this.router.navigateByUrl('/auth');
      }),
      catchError((err) => {
        return of(console.error(err));
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
      new Date().getTime() + 86400000 //A day in milliseconds
    );
    const newUser = new User(user.id, user.name, user.username, '', user.token, expirationTime);
    this._user.next(newUser);
    this.autoLogout(newUser.tokenDuration);
    Plugins.Storage.set({ key: 'authData', value: JSON.stringify(newUser) });
  }

  wakeupDyno() {
    this.http.get(this.logonEndpoint.concat('/test'), { responseType: 'text' }).subscribe(msg => console.log(msg));
  }
}

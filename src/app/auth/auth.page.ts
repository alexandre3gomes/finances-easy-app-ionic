import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../shared/model/user.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

  public user: User;
  private userSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = new User(-1, '', '', '', '', new Date());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  login() {
    this.userSubscription = this.authService.login(this.user).subscribe();
  }

}

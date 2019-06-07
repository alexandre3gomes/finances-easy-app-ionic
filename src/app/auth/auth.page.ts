import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../shared/model/user.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

  username = new FormControl();
  password = new FormControl();
  private userSubscription: Subscription;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  login() {
    this.userSubscription = this.authService.login(new User(-1, '', this.username.value, this.password.value, '', new Date())).subscribe();
  }

}

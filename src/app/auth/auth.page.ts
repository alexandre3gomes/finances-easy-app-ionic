import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { User } from '../shared/model/user.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: [ './auth.page.scss' ],
})
export class AuthPage implements OnInit, OnDestroy {

  public formLogin: FormGroup;
  private userSubscription: Subscription;
  constructor(private authService: AuthService, private fb: FormBuilder) { }

  get username() {
    return this.formLogin.get('username');
  }

  get password() {
    return this.formLogin.get('password');
  }

  ngOnInit() {
    this.formLogin = this.fb.group({
      username: [ '', Validators.required ],
      password: [ '', [ Validators.required, Validators.minLength(6) ] ]
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  login() {
    this.userSubscription = this.authService.login(new User(-1, '', this.username.value, this.password.value, '', new Date())).subscribe();
  }

}

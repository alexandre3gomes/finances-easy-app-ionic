import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../shared/model/user.model';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [ 'home.page.scss' ],
})
export class HomePage {

  userObs: Observable<User> = this.authService.loggedUser;
  actualIncomeObs = this.homeService.actualIncomes;
  actualExpenseObs = this.homeService.actualExpenses;

  constructor(private authService: AuthService, private homeService: HomeService) { }

  ionViewWillEnter() {
    this.homeService.fetchActualIncomes().subscribe();
    this.homeService.fetchActualExpenses().subscribe();
  }
}

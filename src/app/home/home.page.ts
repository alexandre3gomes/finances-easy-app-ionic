import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../shared/model/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [ 'home.page.scss' ],
})
export class HomePage implements OnInit {

  userObs: Observable<User> = this.authService.loggedUser;

  constructor(private authService: AuthService, private translate: TranslateService) {
    this.translate.addLangs([ 'en', 'pt' ]);
    this.translate.setDefaultLang('pt');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(
      browserLang.match(/en|pt/) ? browserLang : 'pt'
    );
  }

  ngOnInit() {

  }
}

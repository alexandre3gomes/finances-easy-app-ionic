import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Expenses',
      url: '/expense',
      icon: 'cash'
    },
    {
      title: 'Incomes',
      url: '/income',
      icon: 'logo-euro'
    },
    {
      title: 'Category',
      url: '/category',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private authService: AuthService,
    private menuCtrl: MenuController
  ) {
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('pt');
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(
      browserLang.match(/en|pt/) ? browserLang : 'pt'
    );
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  changeLang(language: string) {
    this.translate.use(language);
  }

  logout() {
    this.menuCtrl.close();
    this.authService.logout().subscribe();
  }
}

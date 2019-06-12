import { Component, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { Income } from '../shared/model/income.model';
import { EditIncomeComponent } from './edit-income/edit-income.component';
import { IncomeService } from './income.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.page.html',
  styleUrls: [ './income.page.scss' ],
})
export class IncomePage implements OnInit {

  private incomesSub: Subscription;
  public incomes: Income[];

  constructor(private incomeService: IncomeService,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.incomesSub = this.incomeService.incomes.subscribe(cats => {
      this.incomes = cats;
    });
  }

  ngOnDestroy() {
    this.incomesSub.unsubscribe;
  }

  ionViewWillLeave() {
    this.incomeService.resetPage();
  }

  ionViewWillEnter() {
    this.incomeService.fetchIncomes().subscribe();
  }

  newIncome() {
    this.modalCtrl
      .create({
        component: EditIncomeComponent
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        if (resultData.role === 'confirm') {
          this.incomeService.createIncome(resultData.data).subscribe();
          let msg = this.translate.instant('Income') + ' ' + this.translate.instant('Saved');
          this.toastCtrl.create(
            {
              header: msg,
              color: 'primary',
              duration: 1000,
              showCloseButton: true
            }
          ).then(toastEl => toastEl.present());
        }
      });
  }

  remove(id: number, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.alertCtrl.create({
      header: this.translate.instant('Are you sure?'),
      buttons: [
        {
          text: this.translate.instant('Yes'),
          cssClass: 'primary',
          handler: () => {
            this.confirmRemove(id)
          }
        },
        {
          text: this.translate.instant('No'),
          role: 'cancel',
          cssClass: 'danger'
        }
      ]
    }).then(toastEl => toastEl.present());
  }

  edit(id: number, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.modalCtrl
      .create({
        component: EditIncomeComponent,
        componentProps: { id: id }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        if (resultData.role === 'confirm') {
          this.incomeService.editIncome(resultData.data).subscribe();
          let msg = this.translate.instant('Income') + ' ' + this.translate.instant('Edited');
          this.toastCtrl.create(
            {
              header: msg,
              color: 'primary',
              duration: 1000,
              showCloseButton: true
            }
          ).then(toastEl => toastEl.present());
        }
      });
  }

  confirmRemove(id: number) {
    this.incomeService.deleteIncome(id).subscribe(() => {
      let msg = this.translate.instant('Income') + ' ' + this.translate.instant('Deleted');
      this.toastCtrl.create(
        {
          header: msg,
          color: 'primary',
          duration: 1000,
          showCloseButton: true
        }
      ).then(toastEl => toastEl.present());
    });
  }

  loadData(event) {
    if (this.incomeService.canScroll()) {
      this.incomeService.incrementPage();
      this.incomeService.fetchIncomes().subscribe(() => event.target.complete());
    } else {
      event.target.complete();
    }
  }


}

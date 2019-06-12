import { Component, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

import { CategoryService } from '../category/category.service';
import { Expense } from '../shared/model/expense.model';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { ExpenseService } from './expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
})
export class ExpensePage implements OnInit {

  private expensesSub: Subscription;
  public expenses: Expense[];
  public DATE_FORMAT = 'L';
  private categorySub: Subscription;
  public canScroll: Observable<boolean>;

  constructor(private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.expensesSub = this.expenseService.expenses.subscribe(exps => {
      this.expenses = exps;
    });
    this.categoryService.fetchAllCategories().subscribe();
    this.expenseService.fetchExpenses().subscribe();
    this.canScroll = this.expenseService.canScroll();
  }

  ngOnDestroy() {
    this.expensesSub.unsubscribe();
    if (this.categorySub) {
      this.categorySub.unsubscribe();
    }
    this.expenseService.resetPage();
    this.expenseService.resetExpenses();
  }

  newExpense() {
    this.categorySub = this.categoryService.categories.subscribe(categories => {
      this.modalCtrl
        .create({
          component: EditExpenseComponent,
          componentProps: { categories }
        })
        .then(modalEl => {
          modalEl.present();
          return modalEl.onDidDismiss();
        }).then(resultData => {
          if (resultData.role === 'confirm') {
            this.expenseService.createExpense(resultData.data).subscribe();
            let msg = this.translate.instant('Expense') + ' ' + this.translate.instant('Saved');
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
    this.categorySub = this.categoryService.categories.subscribe(categories => {
      this.modalCtrl
        .create({
          component: EditExpenseComponent,
          componentProps: { id, categories }
        })
        .then(modalEl => {
          modalEl.present();
          return modalEl.onDidDismiss();
        }).then(resultData => {
          if (resultData.role === 'confirm') {
            this.expenseService.editExpense(resultData.data).subscribe();
            let msg = this.translate.instant('Expense') + ' ' + this.translate.instant('Edited');
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
    });
  }

  confirmRemove(id: number) {
    this.expenseService.deleteExpense(id).subscribe(() => {
      let msg = this.translate.instant('Expense') + ' ' + this.translate.instant('Deleted');
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
    this.expenseService.incrementPage();
    this.expenseService.fetchExpenses().subscribe(() => event.target.complete());
  }


}

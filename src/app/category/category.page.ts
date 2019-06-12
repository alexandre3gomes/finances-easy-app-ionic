import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, IonItemSliding, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { Category } from '../shared/model/category.model';
import { CategoryService } from './category.service';
import { EditCategoryComponent } from './edit-category/edit-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: [ './category.page.scss' ],
})
export class CategoryPage implements OnInit, OnDestroy {

  private categoriesSub: Subscription;
  public categories: Category[];

  constructor(private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.categoriesSub = this.categoryService.categories.subscribe(cats => {
      this.categories = cats;
    });
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe;
  }

  ionViewWillLeave() {
    this.categoryService.resetPage();
  }

  ionViewWillEnter() {
    this.categoryService.fetchCategories().subscribe();
  }

  newCategory() {
    this.modalCtrl
      .create({
        component: EditCategoryComponent
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        if (resultData.role === 'confirm') {
          this.categoryService.createCategory(resultData.data).subscribe();
          let msg = this.translate.instant('Category') + ' ' + this.translate.instant('Saved');
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
        component: EditCategoryComponent,
        componentProps: { id: id }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        if (resultData.role === 'confirm') {
          this.categoryService.editCategory(resultData.data).subscribe();
          let msg = this.translate.instant('Category') + ' ' + this.translate.instant('Edited');
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
    this.categoryService.deleteCategory(id).subscribe(() => {
      let msg = this.translate.instant('Category') + ' ' + this.translate.instant('Deleted');
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
    if (this.categoryService.canScroll()) {
      this.categoryService.incrementPage();
      this.categoryService.fetchCategories().subscribe(() => event.target.complete());
    } else {
      event.target.complete();
    }
  }

}

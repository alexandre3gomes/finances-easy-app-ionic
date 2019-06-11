import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, ModalController } from '@ionic/angular';
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
    private router: Router,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.categoriesSub = this.categoryService.categories.subscribe(cats => {
      this.categories = cats;
    });
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe;
  }

  ionViewWillEnter() {
    this.categoryService.fetchCategories().subscribe();
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
    }).then(alertEl => alertEl.present());
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
        console.log(resultData);
      });
  }

  confirmRemove(id: number) {
    console.log('Category', id);
  }

}

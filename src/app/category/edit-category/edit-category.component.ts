import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Category } from '../../shared/model/category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {

  @Input() public id: number;
  public category: Category;

  constructor(
    private categoryService: CategoryService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.id && this.id > 0) {
      this.categoryService.categories.subscribe(cats => {
        this.category = cats.filter(cat => cat.id === this.id)[0];
      });
    } else {
      this.category = new Category(-1, '');
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.modalCtrl.dismiss(this.category, 'confirm');
  }

}

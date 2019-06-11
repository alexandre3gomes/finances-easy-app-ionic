import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Category } from '../../shared/model/category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: [ './edit-category.component.scss' ],
})
export class EditCategoryComponent implements OnInit {

  @Input() public id: number;
  public category: Category;
  public formCategory: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
    private fb: FormBuilder) { }

  get name() {
    return this.formCategory.get('name');
  }

  ngOnInit() {
    this.categoryService.categories.subscribe(cats => {
      this.category = cats.filter(cat => cat.id === this.id)[ 0 ];
    });
    this.formCategory = this.fb.group({
      name: [ this.category.name, Validators.required ]
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.modalCtrl.dismiss(this.category, 'confirm');
  }

}

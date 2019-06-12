import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AuthService } from '../../auth/auth.service';
import { Category } from '../../shared/model/category.model';
import { Expense } from '../../shared/model/expense.model';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss'],
})
export class EditExpenseComponent implements OnInit {

  @Input() public id: number;
  public expense: Expense;
  @Input() public categories: Category[];

  constructor(
    private expenseService: ExpenseService,
    private modalCtrl: ModalController,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.id && this.id > 0) {
      this.expenseService.expenses.subscribe(exps => {
        this.expense = exps.filter(exp => exp.id === this.id)[0];
      });
    } else {
      this.expense = new Expense(-1, '', null, null, 0, new Date());
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.authService.loggedUser.subscribe(loggedUser => {
      this.expense.user = loggedUser;
      this.modalCtrl.dismiss(this.expense, 'confirm');
    });
  }

  categoryCompare(cat1: Category, cat2: Category) {
    return cat1.id === cat2.id;
  }


}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AuthService } from '../../auth/auth.service';
import { Income } from '../../shared/model/income.model';
import { IncomeService } from '../income.service';

@Component({
  selector: 'app-edit-income',
  templateUrl: './edit-income.component.html',
  styleUrls: [ './edit-income.component.scss' ],
})
export class EditIncomeComponent implements OnInit {

  @Input() public id: number;
  public income: Income;

  constructor(
    private incomeService: IncomeService,
    private modalCtrl: ModalController,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.id && this.id > 0) {
      this.incomeService.incomes.subscribe(incs => {
        this.income = incs.filter(inc => inc.id === this.id)[ 0 ];
      });
    } else {
      this.authService.loggedUser.subscribe(loggedUser => {
        this.income = new Income(-1, loggedUser, '', 0, new Date());
      })
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.modalCtrl.dismiss(this.income, 'confirm');
  }

}

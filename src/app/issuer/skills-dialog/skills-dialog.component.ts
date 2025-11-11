import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-skills-dialog',
  templateUrl: './skills-dialog.component.html',
  styleUrls: ['./skills-dialog.component.css']
})
export class SkillsDialogComponent implements OnInit {
  totalAmount: any = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log(this.data);
    const originalAmount = this.data.amount.cert ? this.data.amount.certAmount : this.data.amount.badgeAmount;
    console.log(originalAmount);
    this.totalAmount = (originalAmount * this.data.amount.no_of_stud).toFixed(1);
  }

}

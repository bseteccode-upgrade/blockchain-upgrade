import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-logactivityhistory',
  templateUrl: './logactivityhistory.component.html',
  styleUrls: ['./logactivityhistory.component.css']
})
export class LogactivityhistoryComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }

}

/*
 * File : matricgraph.component.ts
 * Use: custom api user using this option
 * Find the count of api call on different api request 
 * Copyright : vottun 2019
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-matricgraph',
  templateUrl: './matricgraph.component.html',
  styleUrls: ['./matricgraph.component.css']
})
export class MatricgraphComponent implements OnInit, OnDestroy {
  norecordfound = false;
  chartLabels: any = [];
  resdata: any;
  types: any = [
    {value: 0, viewValue: 'today'},
    {value: 1, viewValue: 'yesterday'},
    {value: 2, viewValue: 'last_7_days'},
    {value: 3, viewValue: 'last_30_days'},
    {value: 4, viewValue: 'this_month'},
    {value: 5, viewValue: 'last_month'},
    // {value: 'range', viewValue: 'Custom Range'}
  ];
  chartOptions = {
    responsive: true
  };
  chartData: any = [
    { data: [], label: '' },
    { data: [], label: '' }
  ];
  getPostUserSubscribtion: any;
  constructor(
    private apiService: ApiService,
    private common: CommonService,
  ) { }

  ngOnInit() {
    this.twofourhours();
    this.getPostUserDetails();
  }

  getPostUserDetails(typeVal = 0) {
    this.norecordfound = false;
    const queryString = '?type=' + typeVal;
    this.getPostUserSubscribtion = this.apiService.getReqResDetails(queryString).subscribe(
      data => {
        this.resdata = data;
        if ( !this.resdata.status ) {
          this.norecordfound = true;
        } else {
          this.chartData = [
            { data: this.resdata.success, label: 'Success' },
              { data: this.resdata.fail, label: 'Fail' },
          ];
        }
      }, err => {
        this.common.openSnackBar('some_error_occurred');
      });
  }

  onChangeType(objType) {
    this.chartLabels = [];
    var date = new Date();
    if (objType === 1) {
      this.twofourhours();
    } else if (objType === 2) {
        this.dayLabels(7);
    } else if (objType === 3) {
        this.dayLabels(30);
    } else if (objType === 4) {
      this.getDaysInMonth(date.getMonth() + 1, date.getFullYear());
    }  else if (objType === 5) {
      this.getDaysInMonth(date.getMonth(), date.getFullYear());
    } else if (objType === 0) {
      this.twofourhours();
    }
    this.getPostUserDetails(objType);
  }

  addZero(value) {
    var pad = '00';
    return pad.substring(0, pad.length - value.toString().length) + value;
  }

  formatDate(date , addDate = 0) {
    var dd = date.getDate();
    var mm = date.getMonth() + addDate;
    var yyyy = date.getFullYear();
    if (dd < 10) {dd = '0' + dd}
    if (mm < 10) {mm = '0' + mm}
    date = mm + '/' + dd + '/' + yyyy;
    return date;
  }

  twofourhours() {
    this.chartLabels = [];
    for (var i = 1; i < 25; i++) {
      let am = 'AM';
      let pm = 'PM';
      let ampm = '';
      let timeUnit; let timeValue; let timeStamp;
      timeUnit = i > 12 ? i - 12 : i;
      timeValue = this.addZero(timeUnit);
      ampm = i < 12 || i > 23 ? am : pm;
      timeStamp = timeValue + ' ' + ampm;
      this.chartLabels.push(timeStamp);
    }
  }
  /**  This function is used for day graph label display */
  dayLabels(dayCount, date = null) {
    var result = [];
    for (var i = 0; i < dayCount; i++) {
      if (date != null) {
        var d = new Date(date);
        d.setDate(d.getDate() - i);
        result.push( this.formatDate(d, 1) );
      } else {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.push( this.formatDate(d, 1) );
      }
    }
    this.chartLabels = result.reverse();
  }
  /** This function is used for this month date label display */
  getDaysInMonth(month, year) {
    // Since no month has fewer than 28 days
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(this.formatDate(new Date(date)));
      date.setDate(date.getDate() + 1);
    }
    this.chartLabels = days;
  }

  ngOnDestroy() {
    if (this.getPostUserSubscribtion) {
      this.getPostUserSubscribtion.unsubscribe();
    }
  }

}

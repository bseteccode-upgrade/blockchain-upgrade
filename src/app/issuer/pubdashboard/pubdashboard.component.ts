import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-pubdashboard',
  templateUrl: './pubdashboard.component.html',
  styleUrls: ['./pubdashboard.component.css']
})
export class PubdashboardComponent implements OnInit, OnDestroy {

  norecordfound = false;
  chartLabels: any = [];
  resdata: any;
  types: any = [
    { value: 0, viewValue: 'today' },
    { value: 1, viewValue: 'yesterday' },
    { value: 2, viewValue: 'last_7_days' },
    { value: 3, viewValue: 'last_30_days' },
    { value: 4, viewValue: 'this_month' },
    // { value: 5, viewValue: 'last_month' },
    { value: 6, viewValue: 'Custom Range' }
  ];
  chartOptions = {
    responsive: true
  };
  chartData: any = [
    { data: [], label: '' },
    { data: [], label: '' },
    { data: [], label: '' },
    { data: [], label: '' }
  ];
  displayRange = false;
  // We describe the date format for filter type functionality
  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false
  };
  public daterange: any = {};
  subcription: any;
  getWalletSubcription: any;
  constructor(
    public apiService: ApiService,
    private common: CommonService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log(this.apiService.pages.dashboard);
    if (!this.apiService.pages.dashboard) {
      this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
      this.router.navigate(['signin']);
    }
    this.getWalletSubcription = this.apiService.getWallet();
    this.twofourhours();
    this.getPostUserDetails();
  }

  public selectedDate(value: any, datepicker?: any) {
    // Any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
    var date1 = new Date(value.start);
    var date2 = new Date(value.end);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.chartLabels = [];
    console.log(diffDays);
    if (diffDays === 1) {
      this.twofourhours();
    } else {
      this.dayLabels(diffDays, date2);
    }
    this.getPostUserDetails(6, this.daterange.start.format('YYYY-MM-DD HH:mm:ss'), this.daterange.end.format('YYYY-MM-DD HH:mm:ss'));
  }

  getPostUserDetails(typeVal = 0, start = '', end = '') {
    this.norecordfound = false;
    const queryString = '?type=' + typeVal + '&from_date=' + start + '&to_date=' + end;
    this.subcription = this.apiService.getActivityCountDetails(queryString).subscribe(
      data => {
        this.resdata = data;
        if (!this.resdata.status) {
          this.norecordfound = true;
        } else {
          this.chartData = [
            { data: this.resdata.success.social, label: 'share' },
            { data: this.resdata.success.download, label: 'download' },
            { data: this.resdata.success.login, label: 'login' },
            { data: this.resdata.success.embed, label: 'reviewed' }
          ];
        }
      }, err => {
        this.common.openSnackBar('some_error_occurred');
      });
  }

  onChangeType(objType) {
    this.displayRange = false;
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
    } else if (objType === 5) {
      this.getDaysInMonth(date.getMonth(), date.getFullYear());
    } else if (objType === 0) {
      this.twofourhours();
    } else if (objType === 6) {
      this.displayRange = true;
      this.twofourhours();
      this.getPostUserDetails(6, moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss'));
    }
    if (!this.displayRange) {
      this.getPostUserDetails(objType);
    }
  }

  addZero(value) {
    var pad = '00';
    return pad.substring(0, pad.length - value.toString().length) + value;
  }

  formatDate(date, addDate = 0) {
    var dd = date.getDate();
    var mm = date.getMonth() + addDate;
    var yyyy = date.getFullYear();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
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
        result.push(this.formatDate(d, 1));
      } else {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.push(this.formatDate(d, 1));
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

  ngOnDestroy(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
    if (this.getWalletSubcription) {
      this.getWalletSubcription.unsubscribe();
    }
  }

}


/*
 * File : downloaddata.component.ts
 * Use: dynamically download the activity list based on search
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ApiService } from '../../service/api.service';

import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';

@Component({
  selector: 'app-downloaddata',
  templateUrl: './downloaddata.component.html',
  styleUrls: ['./downloaddata.component.css']
})
export class DownloaddataComponent implements OnInit {
  searchForm: FormGroup;
  minendDate: any;
  /* Scroll Pagination */
  slimScrollState = new SlimScrollState();
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;
  default_page = 1;
  resProductData: any;
  no_page: number;
  scrollUpDistance = 0;
  throttle = 300;
  scrollDistance = 1;
  inc_page = 1;
  downloadDataList: any = [];
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  process = true;
  blockchainData = [
    { name: 'Ethereum', value: '1' },
    { name: 'Polygon', value: '8' },
  ];

  constructor(
    public productService: ProductService,
    public formbuilder: FormBuilder,
    public apiService: ApiService,
  ) {
    this.searchForm = this.formbuilder.group({
      'start_date': [null],
      'end_date': [null],
      'name': [null]
    });
  }

  ngOnInit() {
    this.getDownloadActivity();
  }

  scrollChanged($event: ISlimScrollState, searchData?: any) {
    this.slimScrollState = $event;
    if ($event.isScrollAtEnd) {
      this.inc_page += 1;
      this.default_page = this.inc_page;
      if (this.inc_page <= this.no_page) {
        this.getDownloadActivity(searchData);
      }
    }
  }

  refreshFromDate() {
    this.searchForm.controls['start_date'].setValue(null);
    this.searchForm.markAsTouched();
    this.minendDate = '';
    return false;
  }

  refreshToDate() {
    this.searchForm.controls['end_date'].setValue(null);
    this.searchForm.markAsTouched();
    return false;
  }

  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
    if (field === 'start_date') {
      this.minendDate = moment(moment(e.value, 'L', true).format('YYYY-MM-DD')).add(1, 'day').format('YYYY-MM-DD');
      this.refreshToDate();
    }
  }

  onScrollDown(searchData) {
    // this.inc_page += 1;
    // this.default_page = this.inc_page;
    // if (this.inc_page <= this.no_page) {
    //   this.getDownloadActivity(searchData);
    // }
  }

  resetForm() {
    this.minendDate = '';
    this.process = true;
    this.downloadDataList = [];
    this.default_page = 1;
    this.inc_page = 1;
    this.getDownloadActivity([]);
  }

  submitSearchForm(searchData) {
    this.process = true;
    this.downloadDataList = [];
    this.default_page = 1;
    this.inc_page = 1;
    this.getDownloadActivity(searchData);
  }

  blockchainName(val: any) {
    const index = this.blockchainData.findIndex(e => e.value == val);
    return this.blockchainData[index]['name'];
  }

  getDownloadActivity(searchData: any = []) {
    searchData['page'] = this.default_page;
    if (localStorage.getItem('userTypeOriginal') === '9') {
      searchData['user'] = this.userDetails.id;
    }
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key]) {
        params.set(key, searchData[key]);
      }
    }
    this.productService.getDownloadDataList(params.toString()).subscribe(data => {
      this.process = false;
      this.resProductData = data;
      if (this.resProductData.count > 0) {
        this.no_page = Math.ceil(this.resProductData.count / 5);
        this.resProductData.results.map(item => {
          return item;
        }).forEach(item => {
          this.downloadDataList.push(item);
        });
      } else {
      }
    }, err => {
    });
  }
}

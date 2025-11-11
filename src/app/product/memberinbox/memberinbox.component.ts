/*
 * File : memberinbox.component.ts
 * Use: using the list the activity mail list and status of activity
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import * as moment from 'moment';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-memberinbox',
  templateUrl: './memberinbox.component.html',
  styleUrls: ['./memberinbox.component.css']
})
export class MemberinboxComponent implements OnInit {

  searchForm: FormGroup;
  productList: any = [];
  productListExport: any = [];
  searchData: any;
  process = false;
  dataSource = new MatTableDataSource<Element>(this.productList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['created', 'message'];
  walletData: any = [];
  SupplytData: any = [];
  walletValue: any;
  minendDate: any;
  allowedFields: any = [];
  displayMobileView = localStorage.getItem('type') ? true : false;
  advanceSearch = false;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  resProductData: any;
  /* Scroll Pagination */
  product_scrollUpDistance = 0;
  product_throttle = 300;
  product_no_page: number;
  product_scrollDistance = 1;
  product_inc_page = 1;
  product_default_page = 1;
  pageEvent: PageEvent;
  totalDataCount: any;

  activityStatus = {
    1: 'status_invite',
    2: 'status_pending',
    3: 'status_completed',
  };
  constructor(
    public productService: ProductService,
    public formbuilder: FormBuilder,
    private common: CommonService,
    public apiService: ApiService,
    private certiService: CertificateService,
    public router: Router,
    private http: HttpClient,
  ) {
    this.searchForm = this.formbuilder.group({
      'message': [null],
      'from_date': [null],
      'to_date': [null],
      'status': [null]
    });
  }

  ngOnInit() {
    if (this.userDetails.userType === '5' || this.userDetails.userType === '9') {
      this.common.openSnackBar('dont_have_privillege', 'Close');
      this.router.navigate(['/signin']);
    }
    this.getProductList();
  }

  redirectToActivityPage(qrCode, workflowId = null) {
    if (workflowId && workflowId != null) {
      localStorage.setItem('wfsteponeid', workflowId);
    } else {
      localStorage.setItem('type', 'qrcode');
      localStorage.setItem('option', qrCode);
    }
    this.router.navigate([`activity`]);
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate([`activity`]));
  }

  submitSearchForm(searchData) {
    this.getProductList(searchData, false, 1, true);
  }
  /**
   * @function onPageChange
   * @description Pagination based form search functionality
   * @param searchData form search data's
   * @param pageevent page event for finding the number
   */
  onPageChange(searchData, pageevent) {
    this.pageEvent = pageevent;
    this.getProductList(searchData, false, pageevent.pageIndex + 1);
  }



  getProductList(searchData: any = {}, reset = false, page = 1, search = false) {
    if (reset) {
      localStorage.removeItem('redirectProduct');
    } else {
      if (localStorage.getItem('redirectProduct')) {
        searchData['product_id'] = localStorage.getItem('redirectProduct');
      }
    }
    this.process = true;
    searchData['page'] = page;
    const params = new URLSearchParams();
    if (searchData !== []) {
      for (const key in searchData) {
        if (searchData[key]) {
          params.set(key, searchData[key]);
        }
      }
    }
    this.certiService.getMailInboxData(params.toString()).subscribe(data => {
      this.process = false;
      this.resProductData = data;
      this.productList = this.resProductData.results;
      this.totalDataCount = this.resProductData.count;
      this.dataSource = new MatTableDataSource<Element>(this.productList);
      // this.dataSource.paginator = this.paginator;
      if (search) {
        this.paginator.pageIndex = 0;
      }
    }, err => {
      this.process = false;
    });
  }

  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
    if (field === 'from_date') {
      this.minendDate = moment(moment(e.value, 'L', true).format('YYYY-MM-DD')).add(1, 'day').format('YYYY-MM-DD');
      this.refreshToDate();
    }
  }

  refreshFromDate() {
    this.searchForm.controls['from_date'].setValue(null);
    this.searchForm.markAsTouched();
    this.minendDate = '';
    return false;
  }

  refreshToDate() {
    this.searchForm.controls['to_date'].setValue(null);
    this.searchForm.markAsTouched();
    return false;
  }
}


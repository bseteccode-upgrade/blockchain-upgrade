/*
 * File : product-list.component.ts
 * Use: list the product data and search functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;
  slimScrollState = new SlimScrollState();
  searchForm: FormGroup;
  /* datatable - start */
  productList: any = [];
  searchData: any;
  advanceSearch = false;
  progress = false;
  dataSource = new MatTableDataSource<Element>(this.productList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['Image', 'Title', 'Barcode', 'actions'];
  /* datatable - end */
  minendDate: any;
  resProductData: any;
  /* Scroll Pagination */
  product_scrollUpDistance = 0;
  product_throttle = 300;
  product_no_page: number;
  product_scrollDistance = 1;
  product_inc_page = 1;
  product_default_page = 1;
  userDetails = JSON.parse(localStorage.getItem('user_details'));

  constructor(
    public productService: ProductService,
    private common: CommonService,
    public formbuilder: FormBuilder,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService,
    private router: Router
  ) {
    this.searchForm = this.formbuilder.group({
      'start_date': [null],
      'end_date': [null],
      'title': [null],
      'search': [null]
    });
  }

  ngOnInit() {
    if (this.userDetails.userType === '5' && !this.userDetails.pages.students) {
      this.common.openSnackBar('dont_have_privillege', 'Close');
      this.router.navigate(['/signin']);
    }
    this.getProductList([]);
  }

  resetProductList() {
    this.searchForm.controls['start_date'].setValue(null);
    this.searchForm.controls['end_date'].setValue(null);
    this.minendDate = '';
    this.searchForm.markAsTouched();
    this.searchForm.reset();
    this.productList = [];
    this.product_default_page = 1;
    this.product_inc_page = 1;
    this.getProductList([]);
  }

  submitSearchForm(searchData) {
    this.productList = [];
    this.product_default_page = 1;
    this.product_inc_page = 1;
    this.getProductList(searchData);
  }

  onScrollDownProduct(searchData) {
    // this.product_inc_page += 1;
    // this.product_default_page = this.product_inc_page;
    // if (this.product_inc_page <= this.product_no_page) {
    //   this.getProductList(searchData);
    // }
  }

  advanceResetForm() {
    this.productList = [];
    this.product_default_page = 1;
    this.product_inc_page = 1;
    this.searchForm.reset();
    this.getProductList([]);
  }

  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
    if (field === 'start_date') {
      this.minendDate = moment(moment(e.value, 'L', true).format('YYYY-MM-DD')).add(1, 'day').format('YYYY-MM-DD');
      this.refreshToDate();
    }
  }

  onRedirectToActivity(productID) {
    localStorage.setItem('redirectProduct', productID);
    this.router.navigate(['productcertificate']);
  }

  getProductList(searchData: any = []) {
    this.progress = this.product_default_page === 1 ? true : false;
    // if (this.product_default_page === 1) {
    //   this.progress = true;
    // }
    searchData['page'] = this.product_default_page;
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key]) {
        params.set(key, searchData[key]);
      }
    }
    this.productService.getProductList(params.toString()).subscribe(data => {
      this.productService.productMatrix();
      this.progress = false;
      this.resProductData = data;
      if (this.resProductData.count > 0) {
        this.product_no_page = Math.ceil(this.resProductData.count / 10);
        this.resProductData.results.map(item => {
          return item;
        }).forEach(item => {
          this.productList.push(item);
        });
      } else {
        this.progress = false;
      }
    }, err => {
      this.progress = false;
    });
  }

  delete(id) {
    this.productService.deleteProduct(id).subscribe(
      data => {
        this.common.openSnackBar('product_deletion_successful', 'Close');
        this.ngxSmartModalService.getModal('myModal').close();
        this.productList = [];
        this.getProductList();
      },
      err => {
        this.common.openSnackBar('some_error_occurred', 'Close');
        this.ngxSmartModalService.getModal('myModal').close();
      }
    );
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

  scrollChanged($event: ISlimScrollState, searchData) {
    this.slimScrollState = $event;
    if ($event.isScrollAtEnd) {
      this.product_inc_page += 1;
      this.product_default_page = this.product_inc_page;
      if (this.product_inc_page <= this.product_no_page) {
        this.getProductList(searchData);
      }
    }
  }

}

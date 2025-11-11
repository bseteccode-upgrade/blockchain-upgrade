/*
 * File : supplychainlogs.component.ts
 * Use: list the posted activity data's
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CertificateService } from '../../product/services/certificate.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import * as moment from 'moment';
import { ProductService } from '../../product/services/product.service';
import { ExportToCsv } from 'export-to-csv';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { LogactivityhistoryComponent } from '../../product/logactivityhistory/logactivityhistory.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-supplychainlogs',
  templateUrl: './supplychainlogs.component.html',
  styleUrls: ['./supplychainlogs.component.css']
})
export class SupplychainlogsComponent implements OnInit {
  searchForm: FormGroup;
  productList: any = [];
  productListExport: any = [];
  searchData: any;
  process = false;
  dataSource = new MatTableDataSource<Element>(this.productList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['created_date', 'name', 'workflow', 'step', 'role', 'company', 'product', 'barcode', 'out_batch_id', 'actions'];
  walletData: any = [];
  SupplytData: any = [];
  walletValue: any;
  minendDate: any;
  allowedFields: any = [];
  displayMobileView = localStorage.getItem('type') ? true : false;
  advanceSearch = false;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  /* Scroll Pagination */
  product_scrollUpDistance = 0;
  product_throttle = 300;
  product_no_page: number;
  product_scrollDistance = 1;
  product_inc_page = 1;
  product_default_page = 1;
  pageEvent: PageEvent;
  searchOutbatchId = '';
  constructor(
    public productService: ProductService,
    public formbuilder: FormBuilder,
    private common: CommonService,
    public apiService: ApiService,
    private certiService: CertificateService,
    public router: Router,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.searchForm = this.formbuilder.group({
      'search': [null],
      'start_date': [null],
      'end_date': [null],
      'title': [null],
      'batch_id': [null],
      'workflow_id': [null],
      'step': [null],
      'role': [null],
      'organization': [null],
      'first_name': [null],
      'last_name': [null]
    });
  }

  ngOnInit() {
    if ((localStorage.getItem('userTypeOriginal') === '5' || localStorage.getItem('userTypeOriginal') === '9') && !this.userDetails.pages.certificate) {
      this.common.openSnackBar('dont_have_privillege', 'Close');
      this.router.navigate(['/signin']);
    }
    this.productService.productMatrix();
    this.getProductList();
  }

  downloadPdf(pdf) {
    this.http.get(pdf, { responseType: 'blob' }).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        FileSaver.saveAs(blob, 'certificate-' + Date.now() + '.pdf');
      },
      err => {
        // console.log(err);
      }
    );
  }
  /**
   * @function onlyNumber
   * @param event - key events
   * @description input only accept numeric input
   */
  onlyNumber(event) {
    var key = event.charCode || event.keyCode || 0;
    // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
    // home, end, period, and numpad decimal
    if (event.shiftKey) {
      event.preventDefault();
    } else {
      return (
        key == 8 ||
        key == 9 ||
        key == 13 ||
        key == 46 ||
        key == 110 ||
        (key >= 35 && key <= 40) ||
        (key >= 48 && key <= 57) ||
        (key >= 96 && key <= 105));
    }
  }

  viewDetails(res) {
    const dialogRef = this.dialog.open(LogactivityhistoryComponent, {
      data: {
        certData: res
      }
    });
  }
  

  submitSearchForm(searchData) {
    this.productList = [];
    this.getProductList(searchData, false, true);
  }

  onScrollDownProduct(searchData) {
    this.product_inc_page += 1;
    this.product_default_page = this.product_inc_page;
    if (this.product_inc_page <= this.product_no_page) {
      this.getProductList(searchData);
    }
  }

  resetForm() {
    localStorage.removeItem('searchworkflowid');
    localStorage.removeItem('searchoutbatchid');
    this.paginator.pageIndex = 0;
    this.minendDate = '';
    this.searchOutbatchId = '';
    this.productList = [];
  }
  /**
   * @description function using for getting the product activity list
   * @param searchData - search form data
   * @param reset - boolean value (find search or reset)
   * @param search - boolean value (find search or reset)
   * @param page - pagination value
   */
  getProductList(searchData: any = {}, reset = false, search = false, page = 1) {
    if (reset) {
      localStorage.removeItem('redirectProduct');
    } else {
      if (localStorage.getItem('redirectProduct')) {
        searchData['product_id'] = localStorage.getItem('redirectProduct');
      }
    }
    this.process = true;
    const params = new URLSearchParams();
    searchData['page'] = page;
    if (searchData !== []) {
      for (const key in searchData) {
        if (searchData[key]) {
          params.set(key, searchData[key]);
        }
      }
    }
    this.certiService.getLogCertList(params.toString()).subscribe(data => {
      this.process = false;
      this.productList = data;
      this.dataSource = new MatTableDataSource<Element>(this.productList.results);
      if (search) {
        this.paginator.pageIndex = 0;
      }
    }, err => {
      this.process = false;
    });
  }
  /**
   * @description product actvity data get based on the formdate and page event
   * @param formData - enetered form data
   * @param event - page event
   */
  onPageChange(formData, event) {
    this.pageEvent = event;
    this.getProductList(formData, false, false, event.pageIndex + 1);
  }

  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
    if (field === 'start_date') {
      this.minendDate = moment(moment(e.value, 'L', true).format('YYYY-MM-DD')).add(1, 'day').format('YYYY-MM-DD');
      this.refreshToDate();
    }
  }

  post(id) {
    this.process = true;
    this.certiService.postBlockchain(id).subscribe(
      data => {
        this.process = false;
        this.getProductList(this.searchData);
        this.common.openSnackBar(data['msg'], 'Close');
      },
      err => {
        this.process = false;
        this.common.openSnackBar('some_error_occurred', 'Close');
      }
    );
  }

  refreshFromDate() {
    this.searchForm.controls['start_date'].setValue(null);
    this.searchForm.markAsTouched();
    this.minendDate = '';
    return false;
  }

  logout() {
    this.apiService.logout();
  }

  refreshToDate() {
    this.searchForm.controls['end_date'].setValue(null);
    this.searchForm.markAsTouched();
    return false;
  }

  ngOnDestroy() {
    localStorage.removeItem('redirectProduct');
  }
}

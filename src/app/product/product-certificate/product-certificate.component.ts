/*
 * File : product-certificate.component.ts
 * Use: list the posted activity data's
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
import { ExportToCsv } from 'export-to-csv';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { ProdcertactivemodalComponent } from '../prodcertactivemodal/prodcertactivemodal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-certificate',
  templateUrl: './product-certificate.component.html',
  styleUrls: ['./product-certificate.component.css']
})
export class ProductCertificateComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  productList: any = [];
  productListExport: any = [];
  searchData: any;
  process = false;
  dataSource = new MatTableDataSource<Element>(this.productList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['created_date', 'workflow', 'step', 'role', 'company', 'product', 'barcode', 'out_batch_id', 'actions'];
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
  searchOutbatchId = '';
  exportLoading = false;
  resSearchDataLocal: any;
  userType = localStorage.getItem('userTypeOriginal');
  page_size: any = localStorage.getItem('actDetailPageSize') && typeof localStorage.getItem('actDetailPageSize') != 'undefined' ? localStorage.getItem('actDetailPageSize') : 5;
  resActive: any;
  resCache: any = [];
  constructor(
    public productService: ProductService,
    public formbuilder: FormBuilder,
    private common: CommonService,
    public apiService: ApiService,
    private certiService: CertificateService,
    public router: Router,
    private http: HttpClient,
    public dialog: MatDialog
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
      'organization': [null]
    });
  }

  ngOnInit() {
    localStorage.removeItem('openHistoryPopup');
    if ((localStorage.getItem('userTypeOriginal') === '5' || localStorage.getItem('userTypeOriginal') === '9') && !this.userDetails.pages.certificate) {
      this.common.openSnackBar('dont_have_privillege', 'Close');
      this.router.navigate(['/signin']);
    }
    this.productService.productMatrix();
    if (localStorage.getItem('activitySearchData') != null && localStorage.getItem('activitySearchData') !== undefined) {
      this.resSearchDataLocal = JSON.parse(localStorage.getItem('activitySearchData'));
      if (this.resSearchDataLocal.start_date === null && this.resSearchDataLocal.end_date === null && this.resSearchDataLocal.batch_id === null && this.resSearchDataLocal.title === null && this.resSearchDataLocal.workflow_id === null && this.resSearchDataLocal.step === null && this.resSearchDataLocal.role === null && this.resSearchDataLocal.organization === null) {
        this.advanceSearch = false;
        this.searchOutbatchId = this.resSearchDataLocal.search;
      } else {
        if (typeof this.resSearchDataLocal.start_date != 'undefined' || typeof this.resSearchDataLocal.end_date != 'undefined' || typeof this.resSearchDataLocal.batch_id != 'undefined' || typeof this.resSearchDataLocal.title != 'undefined' || typeof this.resSearchDataLocal.workflow_id != 'undefined' || typeof this.resSearchDataLocal.step != 'undefined' || typeof this.resSearchDataLocal.role != 'undefined' || typeof this.resSearchDataLocal.organization != 'undefined') {
          this.advanceSearch = true;
          this.searchForm.controls['start_date'].setValue(this.resSearchDataLocal.start_date);
          this.searchForm.controls['end_date'].setValue(this.resSearchDataLocal.end_date);
          this.searchForm.controls['batch_id'].setValue(this.resSearchDataLocal.batch_id);
          this.searchForm.controls['title'].setValue(this.resSearchDataLocal.title);
          this.searchForm.controls['workflow_id'].setValue(this.resSearchDataLocal.workflow_id);
          this.searchForm.controls['step'].setValue(this.resSearchDataLocal.step);
          this.searchForm.controls['role'].setValue(this.resSearchDataLocal.role);
          this.searchForm.controls['organization'].setValue(this.resSearchDataLocal.organization);
        }
      }
      this.paginator.pageIndex = this.resSearchDataLocal.page - 1;
      this.getProductList(this.resSearchDataLocal, false, false, this.resSearchDataLocal.page);
    } else if (localStorage.getItem('searchworkflowid') != null && localStorage.getItem('searchworkflowid') !== undefined) {
      const searchDefault = [];
      this.searchOutbatchId = localStorage.getItem('searchoutbatchid');
      this.getProductList({ 'search': localStorage.getItem('searchoutbatchid') });
    } else {
      this.getProductList();
    }
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

  submitSearchForm(searchData) {
    this.productList = [];
    // this.product_default_page = 1;
    // this.product_inc_page = 1;
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
    localStorage.removeItem('openHistoryPopup');
    if (reset) {
      localStorage.removeItem('redirectProduct');
    } else {
      if (localStorage.getItem('redirectProduct')) {
        searchData['product_id'] = localStorage.getItem('redirectProduct');
      }
    }
    this.process = true;
    // const exportSearch = searchData;
    const params = new URLSearchParams();
    // const exportparams = new URLSearchParams();
    searchData['page'] = page;
    searchData['page_size'] = this.page_size;
    localStorage.setItem('activitySearchData', JSON.stringify(searchData));
    if (searchData !== []) {
      for (const key in searchData) {
        if (searchData[key]) {
          params.set(key, searchData[key]);
          // if (key !== 'page') {
          //   exportparams.set(key, exportSearch[key]);
          // }
        }
      }
    }
    this.certiService.getCertificateList(params.toString()).subscribe(data => {
      this.process = false;
      this.productList = data;
      this.dataSource = new MatTableDataSource<Element>(this.productList.results);
      if (search) {
        if (this.productList.results.length !== 0) {
          localStorage.setItem('searchworkflowid', this.productList.results[0].workflow_id);
          localStorage.setItem('searchoutbatchid', this.productList.results[0].out_batch_id);
        }
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
    this.page_size = event.pageSize;
    localStorage.setItem('actDetailPageSize', this.page_size);
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

  downloadProductList(searchData: any = {}) {
    this.exportLoading = true;
    const exportSearch = searchData;
    const exportparams = new URLSearchParams();

    if (searchData !== []) {
      for (const key in searchData) {
        if (searchData[key]) {
          exportparams.set(key, exportSearch[key]);
        }
      }
    }
    this.certiService.getCertificateListExport(exportparams.toString()).subscribe(data => {
      this.exportLoading = false;
      this.productListExport = data;
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Activity-Export',
        useBom: true,
        filename: 'Activity-export_' + Date.now(),
        useKeysAsHeaders: true
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(this.productListExport);
    }, err => {
      this.productListExport = [];
    });
  }

  redirectWithPopup(productId) {
    localStorage.setItem('openHistoryPopup', 'open');
    this.router.navigate(['/productcertificateassign/' + productId]);
  }

  redirectToAddActivity(workFlowDbId, outbatchId, uniKey = null, step, actid) {
    console.log(workFlowDbId + '**1**' + outbatchId + '**2**' + uniKey + '**3**' + step + '**4**' + actid);
    localStorage.setItem('selectionCorrection', 'yes');
    this.router.navigate(['/activity/' + workFlowDbId + '/' + outbatchId + '/' + uniKey + '/' + step + '/' + actid]);
  }

  redirectToActivityPage(workflowId, qrCode, step) {
    if (step == 1) {
      localStorage.removeItem('wfsteponeid');
      localStorage.removeItem('type');
      localStorage.removeItem('option');
      localStorage.setItem('wfsteponeid', workflowId);
      this.router.navigate([`activity`]);
    } else {
      localStorage.setItem('type', 'qrcode');
      localStorage.setItem('option', qrCode);
      this.router.navigate([`activity`]);
    }
  }

  onActiveAction(val, id) {
    // if (!val) {
    const dialogRef = this.dialog.open(ProdcertactivemodalComponent, {
      data: {
        id: id,
        status: val ? false : true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.productList.results.findIndex(e => e.id === id);
        if (index != -1) {
          this.productList.results[index].activity_status = val ? false : true;
        }
      }
    });
    // } else {
    //   let params = {
    //     product_certificate_id : id,
    //     status: val
    //   };
    //   this.certiService.updateDeactiveProduct(params).subscribe(data => {
    //     this.resActive = data;
    //     if (this.resActive.msg) {
    //       this.common.openSnackBar(this.resActive.msg, 'Close');
    //     } else {
    //       this.common.openSnackBar(this.resActive.msg, 'Close');
    //     }
    //   });
    // }
  }

  onClearCache(data) {
    this.certiService.clearcache(data.barcode + '-and-' + data.out_batch_id).subscribe(resdata => {
      this.resCache = resdata;
      if (this.resCache.status) {
        this.common.openSnackBar(this.resCache.msg, 'Close');
      } else {
        this.common.openSnackBar(this.resCache.msg, 'Close');
      }
    });
  }
}

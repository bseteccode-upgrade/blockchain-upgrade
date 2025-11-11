/*
 * File : product-certificate-assign.component.ts
 * Use: product certificate details display option
 * Copyright : vottun 2019
 */
import { Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { ProductService } from '../services/product.service';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { environment as env } from '../../../environments/environment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ActivityhistoryComponent } from '../activityhistory/activityhistory.component';
import { MatDialog } from '@angular/material';
import { ProdcertactivemodalComponent } from '../prodcertactivemodal/prodcertactivemodal.component';

@Component({
  selector: 'app-product-certificate-assign',
  templateUrl: './product-certificate-assign.component.html',
  styleUrls: ['./product-certificate-assign.component.css']
})
export class ProductCertificateAssignComponent implements OnInit, DoCheck {
  baseUrl = env.baseUrl;
  productCertForm: FormGroup;
  productList: any = [];
  barcodeList: any = [];
  batchList: any = [];
  responseData: any;
  certiModel: any = {
    product: ''
  };
  public options: Object = {
    placeholderText: '',
    height: '250'
  };
  // error message
  errorMsg: any;
  errorMsgArr: any;
  errRes: any;
  // file upload
  certificateLogo = new FormData();
  fileUploaded = false;
  file: File;
  uploadedFile: any = '';
  process = false;
  selectedBatch: any = [];
  minendDate: any;
  teamMemberDetails: any = {
    register_type: '',
    org_name: '',
    profile_details: {
      product_step: '',
      custom_template: ''
    }
  };
  submitted = false;
  emailID: any;
  activityDetails: any = {
    'product': null,
    'date_certified': null,
    'country_certified': '',
    'manufacture_date': null,
    'description': '',
    'certifier_name': '',
    'certifier_designation': '',
    'expiry_date': null,
    'certificate_number': '',
    'transport': '',
    'shipping': '',
    'barcode': null,
    'in_batch_id': null,
    'out_batch_id': null,
    'category': '',
    'weight': '',
    'type_of_packing': '',
    'storage_condition': '',
    'processing_plant': '',
    'grade': '',
    'minimum_shell_life': '',
    'product_name': '',
    'field_set': []
  };
  displayField: any = [];
  activityId: any;
  viewMode = false;
  maxDateSelect: any;
  // allowedFields: any = [];
  hideSideNav: any;
  // pre_select_in_batch: any = [];
  emailProcess = false;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  isLoading = false;
  correctionDatas: any = [];
  offset: any = '';
  resActive: any = [];

  constructor(
    public formbuilder: FormBuilder,
    private certiService: CertificateService,
    private common: CommonService,
    public apiService: ApiService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public ngxSmartModalService: NgxSmartModalService,
    private dialog: MatDialog
  ) {
    this.createForm();
  }

  createForm() {
    this.offset = new Date().getTimezoneOffset();
    this.productCertForm = this.formbuilder.group({
      'product': [this.activityDetails.product],
      'date_certified': [this.activityDetails.date_certified],
      'country_certified': [this.activityDetails.country_certified],
      'manufacture_date': [this.activityDetails.manufacture_date],
      'description': [this.activityDetails.description],
      'certifier_name': [this.activityDetails.certifier_name],
      'certifier_designation': [this.activityDetails.certifier_designation],
      'expiry_date': [this.activityDetails.expiry_date],
      'certificate_number': [this.activityDetails.certificate_number],
      'transport': [this.activityDetails.transport],
      'shipping': [this.activityDetails.shipping],
      'barcode': [this.activityDetails.barcode],
      'in_batch_id': [this.activityDetails.in_batch_id, Validators.required],
      'out_batch_id': [this.activityDetails.out_batch_id, Validators.required],
      // 'location': [''],
      'category': [this.activityDetails.category],
      'weight': [this.activityDetails.weight],
      'type_of_packing': [this.activityDetails.type_of_packing],
      'storage_condition': [this.activityDetails.storage_condition],
      'processing_plant': [this.activityDetails.processing_plant],
      'grade': [this.activityDetails.grade],
      'minimum_shell_life': [this.activityDetails.minimum_shell_life]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.activityId = data['id'];
      this.productService.getActivitydetails(this.activityId, this.offset).subscribe(info => {
        this.activityDetails = info;
        this.createForm();
        this.viewMode = true;
        var i = 0;
        this.activityDetails.field_set.map((val, index) => {
          var oldStr = val.name;
          var newStr = oldStr.substring(0, oldStr.length - 2);

          if (newStr !== 'out_batch' && newStr !== 'out_batch_' && newStr !== 'out_batch_lable' && newStr !== 'out_batch_lable_' && newStr !== 'produ' && newStr !== 'barco') {
            if (val.type === 'timestamp' || val.type === 'date') {
              this.displayField[i] = { 'label': val.label, 'value': val.value, 'type': val.type, 'dateformat': val.dateformat };
            } else {
              this.displayField[i] = { 'label': val.label, 'value': val.value, 'type': val.type };
            }
            i++;
          }
        });
      });
      this.certiService.historyActivityDetails(this.activityId).subscribe(res => {
        this.correctionDatas = res;
      });
      if (localStorage.getItem('openHistoryPopup')) {
        localStorage.removeItem('openHistoryPopup');
        this.dataHistory(this.activityId);

        this.isLoading = true;

      }
    });
    this.getAllProductDetails();
    this.getBatchList();
    this.maxDateSelect = moment(new Date()).format('YYYY-MM-DD');
  }

  onActiveAction(val, id) {
    const dialogRef = this.dialog.open(ProdcertactivemodalComponent, {
      data: {
        id: id,
        status: val ? false : true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activityDetails.activity_status = val ? false : true;
      }
    });
  }

  dataHistory(certId) {
    this.isLoading = true;
    this.certiService.historyActivityDetails(certId).subscribe(res => {
      this.isLoading = false;
      const dialogRef = this.dialog.open(ActivityhistoryComponent, {
        data: {
          certData: res
        }
      });
    });
  }

  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }

  ngDoCheck() {
    this.teamMemberDetails = this.apiService.user;
  }

  backToPage() {
    if (localStorage.getItem('userTypeOriginal') == '5' && this.apiService.user.pages.certificate) {
      this.router.navigate(['productcertificate']);
    } else if (localStorage.getItem('userTypeOriginal') == '5' && this.apiService.user.pages.issue_certificate) {
      this.router.navigate(['activity']);
    } else if (localStorage.getItem('userTypeOriginal') != '5') {
      this.router.navigate(['productcertificate']);
    }
  }

  onAvoidComma(event) {
    const re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    if (re.test(event.key)) {
      event.preventDefault();
    }
  }

  getAllProductDetails(searchData?: any) {
    this.productService.getProductNameList(searchData).subscribe(data => {
      this.productList = data;
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  changeDateEvent(e, field) {
    this.productCertForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  submitProdCertForm(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    this.fileUploaded = false;
    formData.certifier_name = formData.certifier_name ? formData.certifier_name : this.teamMemberDetails.first_name + " " + this.teamMemberDetails.last_name;
    formData.certifier_designation = formData.certifier_designation ? formData.certifier_designation : this.teamMemberDetails.profile_details.custom_template;
    if (this.productCertForm.valid) {
      this.process = true;
      formData.in_batch_id = formData.in_batch_id.toString();
      this.certiService.assignCertificate(formData).subscribe(
        res => {
          this.process = false;
          this.responseData = res;
          if (this.responseData.id !== '') {
            if (localStorage.getItem('type')) {
              setTimeout(() => {
                const url = 'activity/' + this.responseData.barcode_id;
                this.router.navigate([url]);
              }, 300);
            } else {
              this.router.navigate(['productcertificate']);
            }
            this.common.openSnackBar('activity_addes', 'Close');
          }
        }, err => {
          this.errRes = err;
          this.errorMsg = 'provide_valid_inputs';
          this.process = false;
          if (this.errRes.status === 400) {
            if (this.errRes.error[0] !== '' && this.errRes.error[0] === 'batch_id_already_exists') {
              this.errorMsgArr['in_batch_id'] = 'batch_id_already_exists';
            } else if (this.errRes.error[0] !== '' && this.errRes.error[0] === 'out_batch_id_already_exists') {
              this.errorMsgArr['out_batch_id'] = 'batch_id_already_exists';
            } else {
              this.errorMsg = this.errRes.error[0];
            }
          }
        });
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  geterrorMsg(field) {
    if (field === 'date_certified') {
      return this.productCertForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    } else {
      return this.productCertForm.controls[field].hasError('required')
        || this.productCertForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    }
  }

  changeImage(e) {
    const fileTypeArray = ['png', 'jpeg', 'jpg']; // upload only png, jpeg & jpg
    this.fileUploaded = false;
    this.file = e.target.files[0];
    this.certificateLogo = new FormData();
    // get file name from uploaded file
    const fileName = this.file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

    if (fileTypeArray.some(x => x === fileExtension) && this.file.size < 3000000) {
      this.certificateLogo.append('file', this.file, this.file.name);
      this.certificateLogo.append('user', this.apiService.user.id);
      this.apiService.uploadFile(this.certificateLogo).subscribe(
        data => {
          this.uploadedFile = data['file'];
        },
        err => {
          e.target.value = '';
          this.fileUploaded = true;
          this.uploadedFile = '';
        }
      );
      this.fileUploaded = false;
    } else {
      e.target.value = '';
      this.fileUploaded = true;
    }
  }

  getBatchBarcode(id) {
    this.getBarcodeList(id);
  }

  getBarcodeList(id) {
    this.productService.getBarcodeList(id).subscribe(data => {
      this.barcodeList = data;
    });
  }

  getBatchList() {
    this.productService.getInBatchList().subscribe(data => {
      this.batchList = data;
    });
  }

  onStartDateChange(date) {
    this.minendDate = moment(date).add(1, 'day').format('YYYY-MM-DD');
  }

  refreshFromDate() {
    this.productCertForm.controls['date_certified'].setValue(null);
    this.productCertForm.markAsTouched();
    return false;
  }

  refreshToDate() {
    this.productCertForm.controls['expiry_date'].setValue(null);
    this.productCertForm.markAsTouched();
    return false;
  }

  downloadQrCodeImg(img) {
    this.http.get(img, { responseType: 'blob' }).subscribe(
      res => {
        const blob = new Blob([res], { type: 'image/png' });
        FileSaver.saveAs(blob, 'qrcode-' + Date.now());
      },
      err => {
        // console.log(err);
      }
    );
  }

  shareEmail(id, email) {
    if (email.valid) {
      this.emailProcess = true;
      this.certiService.sendActivityEmail(id, email.value).subscribe(
        data => {
          this.emailProcess = false;
          this.ngxSmartModalService.getModal('EmailModal').close();
          this.common.openSnackBar('email_send_successfully', 'Close');
        },
        err => {
          this.emailProcess = false;
          this.common.openSnackBar('could_not_send_email', 'Close');
        }
      );
    }
  }

  logout() {
    this.apiService.logout();
  }
}

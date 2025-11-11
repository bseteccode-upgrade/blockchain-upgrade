/*
 * File : product.component.ts
 * Use: add. edit product details
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  productPic = new FormData();
  responseData: any;
  minendDate: any;
  productId: string;
  errorMsg: any;
  errorMsgArr: any = [];
  mode = '';
  process = false;
  productModel: any = {
    'title': '',
    'storage_condition': '',
    'grade': '',
    'location': '',
    'description': '',
    'category': '',
    'processing_plant': '',
    'weight': '',
    'manufacture_date': '',
    'barcode': '',
    'batch_id': null,
    'minimum_shell_life': '',
    'type_of_packing': '',
    'expire_date': null,
    'image': '',
    'enduser_qr_type': 1,
    'sup_barcode': '',
    'qr_density_type': 1
  };
  userDetails = JSON.parse(localStorage.getItem('user_details'));

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    uploadUrl: env.url + 'files/new/upload/',
    sanitize: false,
    toolbarPosition: 'top'
  };
  public options: Object = {
    placeholderText: '',
    height: '250'
  };
  qrcodeListFormats = [
    { index: 1, val: 'dynamic' },
    { index: 2, val: 'fixed' }
  ];

  qrcodeDensityLists = [
    { index: 1, val: 'high_density' },
    { index: 2, val: 'low_density' }
  ];
  constructor(
    public formbuilder: FormBuilder,
    private common: CommonService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService
  ) {
    this.createForm();
  }

  ngOnInit() {
    if ( (this.userDetails.userType === '5' || this.userDetails.userType === '0' ) && !this.userDetails.pages.add_product) {
      this.common.openSnackBar('dont_have_privillege', 'Close');
      this.router.navigate(['/signin']);
    }
    this.route.queryParams.subscribe(res => {
      this.mode = res['mode'];
    });
    this.route.params.subscribe(data => {
      this.productId = data['id'];
      if (this.productId) {
        this.getProduct(this.productId);
      }
    });
  }

  getProduct(id) {
    this.productService.getProduct(id).subscribe(data => {
      this.productModel = data;
      this.createForm();
    });
  }

  createForm() {
    this.productForm = this.formbuilder.group({
      'title': [this.productModel.title, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'barcode': [this.productModel.barcode, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'batch_id': [this.productModel.batch_id],
      'description': [this.productModel.description],
      'image': [this.productModel.image],
      'enduser_qr_type': [this.productModel.enduser_qr_type],
      'sup_barcode': [this.productModel.sup_barcode],
      'qr_density_type': [this.productModel.qr_density_type]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  changeManufactureEvent(e) {
    this.productForm.controls['manufacture_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  changeExpireDateEvent(e) {
    this.productForm.controls['expire_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  onStartDateChange(date) {
    this.minendDate = moment(date).add(1, 'day').format('YYYY-MM-DD');
  }

  onAvoidComma(event) {
    const re = /[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi;
    if (re.test(event.key)) {
      event.preventDefault();
    }
  }

  submitProdForm(formData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.productForm.valid) {
      if (this.productId) {
        this.updateProduct(this.productId, formData);
      } else {
        this.addProduct(formData);
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  addProduct(formData) {
    this.process = true;
    this.productService.addProduct(formData).subscribe(
      res => {
        this.process = false;
        this.responseData = res;
        if (this.responseData.id !== '') {
          if (this.userDetails.userType === '5' && this.userDetails.user.pages.students) {
            this.router.navigate(['product']);
          } else if (this.userDetails.userType === '5' && this.userDetails.user.pages.add_product) {
            this.router.navigate(['productlist']);
          } else {
            this.router.navigate(['productlist']);
          }

          this.common.openSnackBar('product_added', 'Close');
        }
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else if (err.status === 400) {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = 'provide_valid_inputs';
        } else {
          this.errorMsg = 'some_error_occurred';
        }
      }
    );
  }

  updateProduct(id, formData) {
    this.process = true;
    this.productService.updateProduct(id, formData).subscribe(
      res => {
        this.process = false;
        this.responseData = res;
        if (this.responseData.id !== '') {
          this.router.navigate(['productlist']);
          this.common.openSnackBar('product_added', 'Close');
        }
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else if (err.status === 400) {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = 'provide_valid_inputs';
        } else {
          this.errorMsg = 'some_error_occurred';
        }
      }
    );
  }

  uploadProductLogo(e) {
    this.errorMsg = '';
    this.errorMsgArr['image'] = '';
    this.productPic = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.productPic.append('file', file, file.name);
        this.productPic.append('user', this.apiService.user.id);
        this.apiService.uploadFile(this.productPic).subscribe(data => {
          this.productModel.image = data['file_url'];
          this.productForm.controls['image'].setValue(data['file_url']);
          this.productForm.markAsTouched();
        });
      } else {
        this.errorMsg = 'provide_valid_inputs';
        this.productForm.controls['image'].setValue(null);
        this.productModel.image = '';
        this.errorMsgArr['image'] = 'file_size_more';
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
      this.productForm.controls['image'].setValue(null);
      this.productModel.image = '';
      this.errorMsgArr['image'] = 'invalid_file_format';
    }
  }

  geterrorMsg(field) {
    return this.productForm.controls[field].hasError('required') || this.productForm.controls[field].hasError('whitespace') ?
      'enter_a_value' : (field === 'expire_date') && (this.productForm.controls['expire_date'].value) &&
        moment(this.productForm.controls['manufacture_date'].value).isBefore(moment(this.productForm.controls['expire_date'].value)) === false ?
        'expire_date_after' : '';
  }

  refreshFromDate() {
    this.productForm.controls['manufacture_date'].setValue(null);
    this.productForm.markAsTouched();
    return false;
  }

  refreshToDate() {
    this.productForm.controls['expire_date'].setValue(null);
    this.productForm.markAsTouched();
    return false;
  }

}

import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { CertificateService } from '../../services/certificate.service';
import { CommonService } from '../../../service/common.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';

@Component({
  selector: 'dynamic-form-builder',
  styleUrls: ['./dynamic-form-builder.component.css'],
  template: `
  <div class="form-build-container">
    <form (ngSubmit)="onFormSubmit(this.form.value)" [formGroup]="form" class="form-horizontal">
      <div *ngFor="let field of fields" class="col-lg-6 col-md-6 col-sm-12">
          <field-builder [field]="field" [form]="form" style="position:relative;"></field-builder>
      </div>
      <div class="form-row"></div>
      <div class="col-sm-12" *ngIf="formError">
        <div class="alert alert-danger">
          {{errMsg | translate}}
        </div>
      </div>

      <div class="col-md-12 col-sm-12">
        <div class="col-md-6 col-sm-6 col-xs-12">
          <div class="dynamic-button-block margin">
            <button mat-button [disabled]="!form.valid || process" class="btn btn-form-save btn_center mat-button">POST TO BLOCKCHAIN</button>
          </div>
        </div>

        <div class="col-md-6 col-sm-6 col-xs-12">
          <div *ngIf="!RedirectoActivityForm && !outBatchList?.is_qc" class="dynamic-button-block margin">
            <button type="button" (click)="submitFormRedirect(this.form.value)" mat-button [disabled]="!form.valid || process" class="btn btn-form-save btn_center mat-button">ADD ANOTHER ACTIVITY FOR THIS STEP</button>
          </div>
        </div>
      </div>
    </form>
    </div>
  `,
})
export class DynamicFormBuilderComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() field: any[];
  @Input() fields: any[] = [];
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  form: FormGroup;
  fieldSet: any;
  submitedData: any;
  responseData: any;
  process = false;
  finalFormData: any = [];
  outBatchList: any = [];
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  summaryDetails: any = {
    current_step: null
  };
  formError = false;
  RedirectoActivityForm = false;
  errResArr: any;
  errMsg = '';
  workflowList: any = this.userDetails.workflow_list;
  formCreationData: any;
  gotGeoLocationCall: any = false;
  constructor(
    public productService: ProductService,
    public certiService: CertificateService,
    private router: Router,
    public common: CommonService
  ) { }

  ngOnInit() {
    console.log(this.workflowList);
    // this.productService.getActivitydetailsForm(localStorage.getItem('option')).subscribe(data => {
    if (localStorage.getItem('option') != null) {
      this.summaryDetails = JSON.parse(localStorage.getItem('summaryData'));
      if (this.summaryDetails.allow_test_activity) {
        this.RedirectoActivityForm = true;
      }
    }
    // });
    let fieldsCtrls = {};
    for (let f of this.fields) {
      if (f.type != 'checkbox') {
        if (f.required) {
          fieldsCtrls[f.name] = new FormControl(f.value || '', Validators.required);
        } else {
          fieldsCtrls[f.name] = new FormControl(f.value || '');
        }
      } else {
        let opts = {};
        for (let opt of f.options) {
          opts[opt.key] = new FormControl(opt.value);
        }
        fieldsCtrls[f.name] = new FormGroup(opts);
      }
    }
    this.productService.getOutBatchListWF(localStorage.getItem('workflow_db_id')).subscribe(data => {
      this.outBatchList = data;
      if (this.outBatchList.allow_test_activity) {
        this.RedirectoActivityForm = true;
      }
    });

    this.form = new FormGroup(fieldsCtrls);
    this.certiService.gotGeoCode.subscribe(updated => {
      this.gotGeoLocationCall = updated;
      if (updated && localStorage.getItem('currentAddress') && typeof localStorage.getItem('currentAddress') != undefined) {
        this.prepopulateLocation();
      }
    });
    setTimeout(() => {
      if (!this.gotGeoLocationCall && localStorage.getItem('currentAddress') && typeof localStorage.getItem('currentAddress') != undefined) {
        this.prepopulateLocation();
      }
      if (this.gotGeoLocationCall && localStorage.getItem('currentAddress') && typeof localStorage.getItem('currentAddress') != undefined) {
        this.prepopulateLocation();
      }
    }, 1500);
  }

  prepopulateLocation() {
    if (this.userDetails.profile_details.product_step === 1 && !localStorage.getItem('option')) {
      if (this.workflowList.length === 1) {
        this.fieldSet = this.workflowList['0'].field_set;
        console.log(this.fieldSet);
        this.locationPrepoplate();
      } else {
        if (this.workflowList.length > 1) {
          const index = this.userDetails.workflow_list.findIndex(e => e.workflow_db_id === localStorage.getItem('workflow_db_id'));
          this.fieldSet = this.userDetails.workflow_list[index]['field_set'];
          this.locationPrepoplate();
        }
      }
    } else {
      setTimeout(() => {
        this.fieldSet = JSON.parse(localStorage.getItem('notFirstForm'));
        this.locationPrepoplate();
      }, 1500);
    }
  }

  locationPrepoplate() {
    setTimeout(() => {
      this.fieldSet.map((element) => {
        if (element.type === 'location' && element.automatic) {
          this.form.controls[element.name].setValue(element.value && element.value != null && element.value != '' ? element.value : localStorage.getItem('currentAddress'));
          this.form.controls[element.name + '_lnglat'].setValue(element.value && element.value != null && element.value != '' ? element.value : localStorage.getItem('addressLatlng'));
        }
      });
    }, 1500);
  }


  submitFormRedirect(formData) {
    this.onFormSubmit(formData, true);
  }

  onFormSubmit(formData, resubmit: any = false) {
    console.log(this.workflowList);
    this.submitedData = formData;
    this.process = true;
    this.formError = false;
    if (localStorage.getItem('token') && localStorage.getItem('token') != null && typeof localStorage.getItem('token') != 'undefined') { } else {
      this.common.openSnackBar('Invalid Login, Please login again!', 'Close');
      this.router.navigate(['/signin']);
    }
    if (this.form.valid) {
      if (this.userDetails.profile_details.product_step === 1 && !localStorage.getItem('option')) {
        console.log('hiii');
        if (resubmit) {
          localStorage.setItem('wfsteponeid', localStorage.getItem('workflow_db_id'));
        }
        console.log(this.workflowList);
        if (this.workflowList.length === 1) {
          this.fieldSet = this.workflowList['0'].field_set;
        } else {
          if (this.workflowList.length > 1) {
            const index = this.userDetails.workflow_list.findIndex(e => e.workflow_db_id === localStorage.getItem('workflow_db_id'));
            this.fieldSet = this.userDetails.workflow_list[index]['field_set'];
          }
        }
      } else {
        this.fieldSet = JSON.parse(localStorage.getItem('notFirstForm'));
      }
      let i = 0;
      let primaryKey = [];
      let primaryValue = [];
      var finalFormDataTest = [{ 'field_set': '' }];
      var outBatch = { 'out_batch_id': [], 'out_batch_lable': [], 'barcode': [], 'product': [] };
      console.log(this.fieldSet);
      for (var key in formData) {
        i++;
        this.fieldSet.map((val, index) => {
          if (this.fieldSet[index].name === key) {
            this.fieldSet[index].value = typeof formData[key] === 'undefined' ? '' : formData[key];
            if (this.fieldSet[index].primary === true) {
              primaryKey.push(this.fieldSet[index].name);
              primaryValue.push(formData[key]);
            }
          }
        });
        finalFormDataTest['field_set'] = this.fieldSet;
        var productVal = null;
        var barcodeVal = null;
        if (this.fieldSet.length === i) {
          this.fieldSet.map((val, index) => {
            var oldStr = this.fieldSet[index].name;
            var newStr = oldStr.substring(0, oldStr.length - 2);
            if (newStr === 'out_batch' || newStr === 'out_batch_') {
              outBatch['out_batch_id'].push(this.fieldSet[index].value);
            } else if (newStr === 'out_batch_lable' || newStr === 'out_batch_lable_') {
              outBatch['out_batch_lable'].push(this.fieldSet[index].value);
            } else if (newStr === 'produ') {
              productVal = this.fieldSet[index].value;
            } else if (newStr === 'barco') {
              barcodeVal = this.fieldSet[index].value;
            }
          });
          if (typeof this.summaryDetails.current_step != 'undefined' && this.summaryDetails.current_step && this.summaryDetails.current_step != null && this.summaryDetails.current_step != '1') {
            primaryKey = this.summaryDetails.primary_key;
            primaryValue = this.summaryDetails.primary_variable;
          }
          localStorage.setItem('out_batch_id_dynamic', outBatch['out_batch_id'].toString());
          let formDateGenerate = {
            'in_batch_id': localStorage.getItem('in_batch_id_dynamic') ? localStorage.getItem('in_batch_id_dynamic') : null,
            'field_set': finalFormDataTest['field_set'],
            'barcode': barcodeVal ? barcodeVal : null,
            'product': productVal ? productVal : null,
            'out_batch_id': outBatch['out_batch_id'].toString(),
            'out_batch_lable': outBatch['out_batch_lable'].toString(),
            'unique_code': localStorage.getItem('option'),
            'workflow_db_id': localStorage.getItem('workflow_db_id'),
            'primary_key': primaryKey.length === 0 ? [] : primaryKey,
            'primary_value': primaryKey.length === 0 ? [] : primaryValue,
            'edit_id': localStorage.getItem('selectOutBatchID') ? localStorage.getItem('selectOutBatchID') : null,
            'qc_users': formData['quality_check_users'] ? formData['quality_check_users'].toString() : null,
            'next_users': formData['next_step_users'] ? formData['next_step_users'].toString() : null
          }
          if (localStorage.getItem('selectOutBatchID')) {
            this.certiService.assignEditCertificate(formDateGenerate, localStorage.getItem('selectOutBatchID')).subscribe(res => {
              this.process = false;
              this.responseData = res;
              if (this.responseData.id !== '') {
                localStorage.setItem('activity_id_dynamic', this.responseData.id);
                this.certiService.callFunctionUserListSteps.next(true);
                if (this.RedirectoActivityForm) {
                  // this.router.navigateByUrl('/productcertificate', { skipLocationChange: true }).then(() =>
                  // this.router.navigate([`activity`]));
                } else if (localStorage.getItem('type')) {
                  setTimeout(() => {
                    if (resubmit) {
                      this.router.navigateByUrl('/productcertificate', { skipLocationChange: true }).then(() =>
                        this.router.navigate([`activity`]));
                    } else {
                      if (this.userDetails.pages.certificate) {
                        this.router.navigate(['productcertificate']);
                      } else {
                        const url = 'activity/' + this.responseData.barcode_id;
                        this.router.navigate([url]);
                      }
                    }
                  }, 800);
                } else {
                  if (resubmit) {
                    this.router.navigateByUrl('/productcertificate', { skipLocationChange: true }).then(() =>
                      this.router.navigate([`activity`]));
                  } else {
                    if (this.userDetails.pages.certificate) {
                      this.router.navigate(['productcertificate']);
                    } else {
                      const url = 'activity/' + this.responseData.barcode_id;
                      this.router.navigate([url]);
                    }
                  }
                }
                this.common.openSnackBar('activity_addes', 'Close');
              }
            }, err => {
              this.formError = true;
              this.process = false;
              this.errResArr = err;
              if (this.errResArr.status === 400) {
                this.errMsg = this.errResArr.error[0];
              }
              if (this.errResArr.status === 401) {
                this.errMsg = this.errResArr.error['detail'];
              }
            });
          } else {
            this.certiService.assignCertificate(formDateGenerate).subscribe(res => {
              this.process = false;
              this.responseData = res;
              if (this.responseData.id !== '') {
                localStorage.setItem('activity_id_dynamic', this.responseData.id);
                this.certiService.callFunctionUserListSteps.next(true);
                if (this.RedirectoActivityForm) {
                  // this.router.navigateByUrl('/productcertificate', { skipLocationChange: true }).then(() =>
                  // this.router.navigate([`activity`]));
                } else if (localStorage.getItem('type')) {
                  setTimeout(() => {
                    if (resubmit) {
                      this.router.navigateByUrl('/productcertificate', { skipLocationChange: true }).then(() =>
                        this.router.navigate([`activity`]));
                    } else {
                      if (this.userDetails.pages.certificate) {
                        this.router.navigate(['productcertificate']);
                      } else {
                        const url = 'activity/' + this.responseData.barcode_id;
                        this.router.navigate([url]);
                      }
                    }
                  }, 800);
                } else {
                  if (resubmit) {
                    this.router.navigateByUrl('/productcertificate', { skipLocationChange: true }).then(() =>
                      this.router.navigate([`activity`]));
                  } else {
                    if (this.userDetails.pages.certificate) {
                      this.router.navigate(['productcertificate']);
                    } else {
                      const url = 'activity/' + this.responseData.barcode_id;
                      this.router.navigate([url]);
                    }
                  }
                }
                this.common.openSnackBar('activity_addes', 'Close');
              }
            }, err => {
              this.formError = true;
              this.process = false;
              this.errResArr = err;
              if (this.errResArr.status === 400) {
                this.errMsg = this.errResArr.error[0];
              }
              if (this.errResArr.status === 401) {
                this.errMsg = this.errResArr.error['detail'];
              }
            });
          }

        }
      }
    } else {
      this.process = false;
    }
  }
}

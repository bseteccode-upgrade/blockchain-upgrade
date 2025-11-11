import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { CertificateService } from '../../../services/certificate.service';
import { ProductService } from '../../../services/product.service';
import { CommonService } from '../../../../service/common.service';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
declare var jQuery;
import * as moment from 'moment';

@Component({
  selector: 'textbox',
  template: `
      <div [formGroup]="form">
        <input *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdownmember' && field.type !== 'dropdowninbatchid' && !field.multiline && field.type !== 'date' && field.type === 'location' && !field.primary && field.type !== 'timestamp'" ngx-google-places-autocomplete [options]="{types: []}" #placesRef="ngx-places" class="form-control non_primary" (onAddressChange)="selectedLocation($event, field.name)" [id]="field.name" [placeholder]="field.placeholder" [name]="field.name" [formControlName]="field.name" [readonly]="field?.is_lock_it">
        <input *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdownmember' && field.type !== 'dropdowninbatchid' && !field.multiline && field.type !== 'date' && field.type === 'location' && field.primary && field.type !== 'timestamp'" ngx-google-places-autocomplete [options]="{types: []}" #placesRef="ngx-places" class="form-control non_primary" (onAddressChange)="selectedLocation($event, field.name)" [id]="field.name" [placeholder]="field.placeholder" [name]="field.name" [formControlName]="field.name" (change)="changeValuePrimaryField($event, field.name);" [readonly]="field?.is_lock_it">
        <input *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdowninbatchid' && field.type !== 'dropdownmember' && field.name === 'out_batch_0' && !field.multiline && field.type !== 'date' && field.type !== 'location' && !field.primary && field.type !== 'timestamp'" [attr.type]="field.type" class="form-control non_primary"  [id]="field.name" [placeholder]="field.placeholder" [name]="field.name" [formControlName]="field.name" [readonly]="field?.readonly" (keydown)="onAvoidComma($event)" onPaste="return false">
        <input *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdowninbatchid' && field.type !== 'dropdownmember' && field.name !== 'out_batch_0' && !field.multiline && field.type !== 'date' && field.type !== 'location' && !field.primary && field.type !== 'timestamp'" [attr.type]="field.type" class="form-control non_primary"  [id]="field.name" [placeholder]="field.placeholder" [name]="field.name" [formControlName]="field.name" [readonly]="field?.readonly">
        <textarea *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdowninbatchid' && field.type !== 'dropdownmember' && field.multiline && field.type !== 'date' && field.type !== 'location' && !field.primary && field.type !== 'timestamp'" [class.is-invalid]="isDirty && !isValid" [formControlName]="field.name" [id]="field.name"
        rows="9" class="form-control" [placeholder]="field.placeholder"></textarea>


        <mat-form-field *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdownmember' && field.type !== 'dropdowninbatchid' && !field.multiline && field.type === 'date' && field.type !== 'location' && !field.primary && field.type !== 'timestamp'" class="angular-datepicker field-datepicker">
                <input matInput [placeholder]="field.placeholder" [matDatepicker]="todate" [readonly]="true" [id]="field.name" [placeholder]="field.placeholder" [name]="field.name" [formControlName]="field.name" (click)="todate.open()" (dateChange)="changeDateEvent(field.name, $event)" [min]="field.enable_furture == 4 || field.enable_furture == 3 ? today : ''" [max]="field.enable_furture == 2 ? today : field.enable_furture == 3 ? today : ''">
                <mat-datepicker-toggle matSuffix [for]="todate"></mat-datepicker-toggle>
                <mat-datepicker #todate></mat-datepicker>
              </mat-form-field>
              <div *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdownmember' && field.type !== 'dropdowninbatchid' && !field.multiline && field.type === 'date' && field.type !== 'location' && !field.primary && field.type !== 'timestamp'" class="refresh-icon" (click)="refreshDate(field.name)">
                <mat-icon>refresh</mat-icon>
              </div>

            <ng-select [ngClass]="field?.readonly ? 'disabledSelect' : ''" *ngIf="field.type !== 'companyadminuser' && field.type === 'dropdownmember' && field.type !== 'dropdowninbatchid' && field.type !== 'dropdownproduct' && !field.primary" [items]="field.options" [multiple]="true"
            bindLabel="user"
            bindValue="key"
            placeholder="Select" [searchFn]="customSearchFn" groupBy="company_name" [formControlName]="field.name">
     <ng-template ng-label-tmp let-item="item">
         <b>{{item.user}}</b>
     </ng-template>
     <ng-template ng-option-tmp let-item="item" let-index="index">
         <b>{{item.user}}</b>
     </ng-template>
 </ng-select>

 <ng-select [ngClass]="field?.readonly ? 'disabledSelect' : ''" *ngIf="field.type === 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdowninbatchid' && field.type !== 'dropdownmember'  && !field.primary" [items]="field.options" [multiple]="true"
            bindLabel="user"
            bindValue="key"
            placeholder="{{'select' | translate}}" [searchFn]="customSearchFnMember" [formControlName]="field.name">
     <ng-template ng-label-tmp let-item="item">
         <b>{{item.user}}</b>
     </ng-template>
     <ng-template ng-option-tmp let-item="item" let-index="index">
         <b>{{item.user}}</b>
     </ng-template>
 </ng-select>

 <ng-select [ngClass]="field?.readonly ? 'disabledSelect' : ''" *ngIf="field.type !== 'companyadminuser' && field.type === 'dropdownproduct' && field.type !== 'dropdowninbatchid' && field.type !== 'dropdownmember'  && !field.primary" [items]="field.options" [multiple]="true"
            bindLabel="title"
            bindValue="id"
            placeholder="{{'select' | translate}}" [searchFn]="customSearchFnProduct" [formControlName]="field.name">
     <ng-template ng-label-tmp let-item="item">
         <b>{{item.title}}</b>
     </ng-template>
     <ng-template ng-option-tmp let-item="item" let-index="index">
         <b>{{item.title}}</b>
     </ng-template>
 </ng-select>

 <ng-select [ngClass]="field?.readonly ? 'disabledSelect' : ''" *ngIf="field.type !== 'companyadminuser' && field.type === 'dropdowninbatchid' && field.type !== 'dropdownproduct' && field.type !== 'dropdownmember'  && !field.primary" [items]="field.options" [multiple]="true"
            bindLabel="title"
            bindValue="id"
            placeholder="{{'select' | translate}}" [searchFn]="customSearchFnInBatchId" [formControlName]="field.name">
     <ng-template ng-label-tmp let-item="item">
         <b>{{item.title}}</b>
     </ng-template>
     <ng-template ng-option-tmp let-item="item" let-index="index">
         <b>{{item.title}}</b>
     </ng-template>
 </ng-select>


        <input *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdowninbatchid' && field.type !== 'dropdownmember' && !field.multiline && field.type !== 'date' && field.type !== 'location' && field.primary && field.type !== 'timestamp'" [attr.type]="field.type" class="form-control" [id]="field.name" [placeholder]="field.placeholder" [name]="field.name" [formControlName]="field.name" (keyup)="changeValuePrimaryField($event, field.name);" class="form-control">

        <dp-date-picker format="DD-MM-YYYY HH:mm A" *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdowninbatchid' && field.type !== 'dropdownmember' && !field.multiline && field.type !== 'date' && field.type !== 'location' && !field.primary && field.type === 'timestamp';" theme="dp-material" [mode]="'daytime'" [name]="field.name" [placeholder]="field.placeholder" [formControlName]="field.name" [config]="field.enable_furture == 1 ? datePickerConfig : field.enable_furture == 2 ? datePickerPastConfig : field.enable_furture == 3 ? datePickerCurrentConfig : datePickerFutureConfig" class="form-control"></dp-date-picker>  
        <div *ngIf="field.type !== 'companyadminuser' && field.type !== 'dropdownproduct' && field.type !== 'dropdownmember' && field.type !== 'dropdowninbatchid' && !field.multiline && field.type !== 'date' && field.type !== 'location' && !field.primary && field.type === 'timestamp';" class="refresh-icon" (click)="refreshTimeDate(field.name)">
                <mat-icon>refresh</mat-icon>
              </div>

        <!-- <button mat-button class="save" type="button" *ngIf="field.placeholder !== 'Product' && field.placeholder !== 'Out Batch ID' && !field.primary && field.save" (click)="savePrimaryValue(field.name, field.type)"><i class="material-icons">
        save
        </i></button> -->
      </div>
    `,
  styles: [
    `

::-webkit-inner-spin-button { display: none;-webkit-appearance: none;}
/*::-webkit-calendar-picker-indicator { display: none;-webkit-appearance: none;}*/

  .form-control { width:100%; }
  .form-control.non_primary { width:85%;}
  .mat-input-element { font-size:16px;}
  .save{min-width:auto; color:#1e232b;background-color: transparent;border-color: transparent;border-radius:2px;border:none;box-shadow:none;outline:none;padding:5px 10px;text-transform: capitalize;position:relative;font-size:24px;top:-10px;position:relative;}
  dp-date-picker ~ .save { top:0;}
  dp-date-picker.dp-material .dp-input-container input.dp-picker-input {margin-right: 10px;font-family: 'Roboto-Regular';font-size: 16px;height: 43px;display: inline-block;border-color: #eaeaea;padding: 6px 12px;    line-height: 1.42857143;color: #555; background-color: #fff; background-image: none; border: 1px solid #ccc; border-radius: 4px;}
  dp-date-picker ~ .refresh-icon {position: relative;top: 5px;}
  
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) 
{
dp-date-picker ~ .save { top:4px;}
.save{min-width:auto; color:#1e232b;background-color: transparent;border-color: transparent;border-radius:2px;border:none;box-shadow:none;outline:none;padding:5px 10px;text-transform: capitalize;position:relative;font-size:24px;top:4px;position:relative;}
:host /deep/ .mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button, :host /deep/ .mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button {position:relative;top:10px;}
}
:host /deep/ .ng-select .ng-select-container { border: 1px solid #eaeaea; }
:host /deep/ .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder { top: auto; }
:host /deep/ .ng-select.disabledSelect:hover {cursor: no-drop;}
:host /deep/ .ng-select.disabledSelect .ng-select-container {cursor: no-drop; }
:host /deep/ .ng-select.disabledSelect div {cursor: no-drop; background-color: #ccc; pointer-events: none; }


`
  ]
})
export class TextBoxComponent {
  @Input() field: any = {};
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  workflowList: any = this.userDetails.workflow_list;
  workFlowName: any;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  primaryFinalValue: any = '';
  resFieldData: any = [];
  summaryDetails: any = [];
  today = moment().format('YYYY-MM-DD');
  timeStampToday = moment().format('DD-MM-YYYY HH:mm A');

  // <dp-date-picker format="DD-MM-YYYY" *ngIf="field.type !== 'dropdownmember' && !field.multiline && field.type === 'date' && field.type !== 'location' && !field.primary && field.type !== 'timestamp'" theme="dp-material" [placeholder]="field.placeholder" [name]="field.name" class="form-control" [config]="field.dateformat == 1 ? dateConfigmmdd : dateConfigddmm"></dp-date-picker>  
  //       <div *ngIf="field.type !== 'dropdownmember' && !field.multiline && field.type === 'date' && field.type !== 'location' && !field.primary && field.type !== 'timestamp'" class="refresh-icon" (click)="refreshTimeDate(field.name)">
  //               <mat-icon>refresh</mat-icon>
  //             </div>

  // dateConfigddmm = {
  //   min: moment(),
  //   format: 'DD-MM-YYYY',
  //   closeOnSelect: true,
  //   closeOnSelectDelay: 100,
  //   firstDayOfWeek: 'mo'
  // };
  // dateConfigmmdd = {
  //   min: moment(),
  //   format: 'MM-DD-YYYY',
  //   closeOnSelect: true,
  //   closeOnSelectDelay: 100,
  //   firstDayOfWeek: 'mo'
  // };

  datePickerFutureConfig = {
    min: moment(),
    format: 'DD-MM-YYYY HH:mm A',
    closeOnSelect: true,
    closeOnSelectDelay: 100,
    firstDayOfWeek: 'mo'
  };
  datePickerPastConfig = {
    max: moment(),
    format: 'DD-MM-YYYY HH:mm A',
    closeOnSelect: true,
    closeOnSelectDelay: 100,
    firstDayOfWeek: 'mo'
  };
  datePickerConfig = {
    format: 'DD-MM-YYYY HH:mm A',
    closeOnSelect: true,
    closeOnSelectDelay: 100,
    firstDayOfWeek: 'mo'
  };
  datePickerCurrentConfig = {
    max: moment(),
    min: moment(),
    format: 'DD-MM-YYYY HH:mm A',
    closeOnSelect: true,
    closeOnSelectDelay: 100,
    firstDayOfWeek: 'mo'
  };
  resultCorrectArr: any = [];
  constructor(
    public certiService: CertificateService,
    public productService: ProductService,
    public common: CommonService
  ) {
    if (localStorage.getItem('option') != null) {
      this.summaryDetails = JSON.parse(localStorage.getItem('summaryData'));
      if (this.userDetails.profile_details.product_step !== 1) {
        this.searchWithPrimary();
      }
    }
    // this.productService.getActivitydetailsForm(localStorage.getItem('option')).subscribe(data => {
     
    // });
    if (localStorage.getItem('correctEditId')) {
      this.productService.getActivityDetailsEdit(localStorage.getItem('correctEditId')).subscribe(data => {
        this.resultCorrectArr = data;
        if (this.resultCorrectArr != []) {
          this.resultCorrectArr.result.field_set.map((element) => {
            if (element.type === 'document' || element.type === 'productimage') {
              this.form.controls[element.name].setValue(element.value);
              if (element.value != '') {
                jQuery('.' + element.name).css('display', 'none');
                jQuery('.edit' + element.name).css('display', 'block');
                jQuery('.edit' + element.name + ' a').attr('href', element.value);
              }
            } else {
              if (element.field_type === 'timestamp') {
                this.form.controls[element.name].setValue(moment(element.value, 'DD-MM-YYYY HH:mm A').format('DD-MM-YYYY HH:mm A'));
              } else {
                this.form.controls[element.name].setValue(element.value);
              }
            }
          });
        }

      }, err => {
        console.log(err);
      });
    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.user.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchFnMember(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.title.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchFnProduct(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.title.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchFnInBatchId(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.title.toLocaleLowerCase().indexOf(term) > -1;
  }

  onAvoidComma(event) {
    const re = /[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi;
    if (re.test(event.key)) {
      event.preventDefault();
    }
  }

  changeDateEvent(fieldName, e) {
    this.form.controls[fieldName].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD-MM-YYYY HH:mm A');
  }

  selectedLocation(mapValue, fieldName) {
    this.form.controls[fieldName].setValue(mapValue.formatted_address);
    this.form.controls[fieldName + '_lnglat'].setValue(mapValue.geometry.location.lat() + ',' + mapValue.geometry.location.lng());
  }

  savePrimaryValue(fieldName, fieldType) {
    let primaryKey = [];
    let primaryValue = [];
    if (this.userDetails.profile_details.product_step === 1) {
      if (this.workflowList.length === 1) {
        this.workFlowName = this.workflowList[0].workflow_id;
        this.userDetails.profile_details.field_set.map((element) => {
          if (element.primary === true) {
            primaryKey.push(element.name);
            primaryValue.push(this.form.controls[element.name].value ? this.form.controls[element.name].value : '');
            this.storeDefaultValues(fieldName, fieldType, primaryKey, primaryValue);
          }
        });
      } else {
        if (this.workflowList.length > 1) {
          const index = this.workflowList.findIndex(e => e.workflow_db_id === localStorage.getItem('workflow_db_id'));
          this.workFlowName = this.workflowList[index].workflow_id;
          this.workflowList[index]['field_set'].map((element) => {
            if (element.primary === true) {
              primaryKey.push(element.name);
              primaryValue.push(this.form.controls[element.name].value ? this.form.controls[element.name].value : '');
              this.storeDefaultValues(fieldName, fieldType, primaryKey, primaryValue);
            }
          });
        }
      }
    } else {
      primaryKey = this.summaryDetails.primary_key;
      primaryValue = this.summaryDetails.primary_variable;
      this.storeDefaultValues(fieldName, fieldType, primaryKey, primaryValue);
    }
  }

  storeDefaultValues(fieldName, fieldType, primaryKey, primaryValue) {
    if (this.form.controls[fieldName].value && this.form.controls[fieldName].value.trim() !== '') {
      this.certiService.defaultValueStore(
        {
          step: this.userDetails.profile_details.product_step,
          key: fieldName,
          value: this.form.controls[fieldName].value,
          type: fieldType,
          workflow_id: this.workFlowName,
          primary_key: primaryKey,
          primary_value: primaryValue,
        }).subscribe(res => {
          this.common.openSnackBar('value_stored', 'Close');
        }, err => {
          // console.log(err);
        });
    } else {
      this.common.openSnackBar('field_should_not_be_empty', 'Close');
      this.form.controls[fieldName].markAsDirty();
    }
  }

  changeValuePrimaryField(event: any, fieldName) {
    this.primaryFinalValue = event.target.value;
    this.form.controls[fieldName].setValue(event.target.value);
    this.searchWithPrimaryType(fieldName, event.target.value);
  }

  searchWithPrimaryType(fieldName = '', value = '') {
    let primaryKey = [];
    let primaryValue = [];
    if (this.userDetails.profile_details.product_step === 1) {
      if (this.workflowList.length === 1) {
        this.workFlowName = this.workflowList[0].work_pk_id;
        primaryKey.push(fieldName);
        primaryValue.push(value && value != '' ? value : '');
        // const requests = this.userDetails.profile_details.field_set.map((element) => {
        //   if (element.primary === true) {
        //     primaryKey.push(fieldName);
        //     primaryValue.push(value && value != '' ? value : '');
        //   }
        // });
        // Wait for all requests, and then setState
        // Promise.all(requests).then(() => {
        this.prepoulateToField(primaryKey, primaryValue);
        // });
      } else {
        if (this.workflowList.length > 1) {
          const index = this.workflowList.findIndex(e => e.workflow_db_id === localStorage.getItem('workflow_db_id'));
          this.workFlowName = this.workflowList[index].work_pk_id;
          // const requests = this.userDetails.profile_details.field_set.map((element) => {
          //   if (element.primary === true) {
          primaryKey.push(fieldName);
          primaryValue.push(value && value != '' ? value : '');
          //   }
          // });
          // Wait for all requests, and then setState
          // Promise.all(requests).then(() => {
          this.prepoulateToField(primaryKey, primaryValue);
          // });
        }
      }
    } else {
      primaryKey = this.summaryDetails.primary_key;
      primaryValue = this.summaryDetails.primary_variable;
      setTimeout(() => {
        this.prepoulateotherStep();
      }, 3000);
    }
  }

  searchWithPrimary() {
    let primaryKey = [];
    let primaryValue = [];
    if (this.userDetails.profile_details.product_step === 1) {
      if (this.workflowList.length === 1) {
        this.workFlowName = this.workflowList[0].work_pk_id;
        // this.userDetails.profile_details.field_set.map((element) => {
        //   if (element.primary === true) {
        //     primaryKey.push(element.name);
        //     primaryValue.push(this.form.controls[element.name].value ? this.form.controls[element.name].value : '');
        //   }
        // });
        // this.prepoulateToField(primaryKey, primaryValue);

        const requests = this.userDetails.profile_details.field_set.map((element) => {
          if (element.primary === true) {
            primaryKey.push(element.name);
            primaryValue.push(this.form.controls[element.name].value ? this.form.controls[element.name].value : '');
          }
        });
        // Wait for all requests, and then setState
        Promise.all(requests).then(() => {
          this.prepoulateToField(primaryKey, primaryValue);
        });
      } else {
        if (this.workflowList.length > 1) {
          const index = this.workflowList.findIndex(e => e.workflow_db_id === localStorage.getItem('workflow_db_id'));
          this.workFlowName = this.workflowList[index].work_pk_id;
          // this.workflowList[index]['field_set'].map((element) => {
          //   if (element.primary === true) {
          //     primaryKey.push(element.name);
          //     primaryValue.push(this.form.controls[element.name].value ? this.form.controls[element.name].value : '');
          //   }
          // });
          // this.prepoulateToField(primaryKey, primaryValue);
          const requests = this.userDetails.profile_details.field_set.map((element) => {
            if (element.primary === true) {
              primaryKey.push(element.name);
              primaryValue.push(this.form.controls[element.name].value ? this.form.controls[element.name].value : '');
            }
          });
          // Wait for all requests, and then setState
          Promise.all(requests).then(() => {
            this.prepoulateToField(primaryKey, primaryValue);
          });
        }
      }
    } else {
      primaryKey = this.summaryDetails.primary_key;
      primaryValue = this.summaryDetails.primary_variable;
      setTimeout(() => {
        this.prepoulateotherStep();
      }, 3000);
    }
  }

  prepoulateotherStep() {
    if (this.summaryDetails.default_value_list != []) {
      this.summaryDetails.default_value_list.map((element) => {
        // console.log(element);
        if (element.type === 'document' || element.type === 'productimage') {
          console.log(element.field_value);
          if (element.field_value != '') {
            console.log(element.field_name);
            const formControl = this.form.get(element.field_name);
            console.log(formControl);
            if (formControl != null) {
              this.form.controls[element.field_name].setValue(element.field_value);
            }
            jQuery('.' + element.field_name).css('display', 'none');
            jQuery('.edit' + element.field_name).css('display', 'block');
            jQuery('.edit' + element.field_name + ' a').attr('href', element.field_value);
          }
        } else {
          if (element.type === 'timestamp') {
            const formControl = this.form.get(element.field_name);
            if (formControl != null) {
              this.form.controls[element.field_name].setValue(moment(element.field_value, 'DD-MM-YYYY HH:mm A').format('DD-MM-YYYY HH:mm A'));
            }
          } else {
            const formControl = this.form.get(element.field_name);
            if (formControl != null) {
              if (element.type === 'location' && element.automatic) {
                this.form.controls[element.field_name].setValue(element.field_value && element.field_value != null && element.field_value != '' ? element.field_value : localStorage.getItem('currentAddress'));
                this.form.controls[element.field_name + '_lnglat'].setValue(element.field_value && element.field_value != null && element.field_value != '' ? element.field_value : localStorage.getItem('addressLatlng'));
              } else {
                this.form.controls[element.field_name].setValue(element.field_value);
              }
            }
          }
        }
      });
    }
  }

  prepoulateToField(primaryKey, primaryValue) {
    this.certiService.fetchDefaultValues(
      {
        step: this.userDetails.profile_details.product_step,
        workflow_id: this.workFlowName ? this.workFlowName : this.userDetails.profile_details.workflow_id,
        primary_key: primaryKey,
        primary_value: primaryValue,
      }).subscribe(res => {
        // this.resetForm();
        this.resFieldData = res;
        if (!this.resFieldData.message && this.resFieldData.message != 'Data Not Found') {
          this.resFieldData.defaults.map((element) => {
            if (element.field_type === 'document' || element.field_type === 'productimage') {
              if (element.field_value != "") {
                const formControl = this.form.get(element.field_name);
                if (formControl != null) {
                  this.form.controls[element.field_name].setValue(element.field_value);
                }
                jQuery('.' + element.field_name).css('display', 'none');
                jQuery('.edit' + element.field_name).css('display', 'block');
                jQuery('.edit' + element.field_name + ' a').attr('href', element.field_value);
              }
            } else {
              if (element.field_type === 'timestamp') {
                const formControl = this.form.get(element.field_name);
                if (formControl != null) {
                  this.form.controls[element.field_name].setValue(moment(element.field_value, 'DD-MM-YYYY HH:mm A').format('DD-MM-YYYY HH:mm A'));
                }
              } else {
                const formControl = this.form.get(element.field_name);
                if (formControl != null) {
                  if (element.type === 'location' && element.automatic) {
                    this.form.controls[element.field_name].setValue(element.field_value && element.field_value != null && element.field_value != '' ? element.field_value : localStorage.getItem('currentAddress'));
                    this.form.controls[element.field_name + '_lnglat'].setValue(element.field_value && element.field_value != null && element.field_value != '' ? element.field_value : localStorage.getItem('addressLatlng'));
                  } else {
                    this.form.controls[element.field_name].setValue(element.field_value);
                  }
                }
              }
            }
          });
        }
      }, err => {
        // console.log(err);
        // this.resetForm();
        this.common.openSnackBar('no_records_found', 'Close');
      });
  }

  refreshDate(fieldName) {
    this.form.controls[fieldName].setValue(null);
    this.form.markAsTouched();
    return false;
  }

  refreshTimeDate(fieldName) {
    this.form.controls[fieldName].setValue('');
    this.form.markAsTouched();
    return false;
  }

  resetForm() {
    if (this.workflowList.length === 1) {
      this.workFlowName = this.workflowList[0].workflow_id;
      this.userDetails.profile_details.field_set.map((element) => {
        if (element.primary !== true) {
          const formControl = this.form.get(element.field_name);
          if (formControl != null) {
            this.form.controls[element.field_name].setValue(null);
          }
        }
      });
    } else {
      if (this.workflowList.length > 1) {
        const index = this.workflowList.findIndex(e => e.workflow_db_id === localStorage.getItem('workflow_db_id'));
        this.workFlowName = this.workflowList[index].workflow_id;
        this.workflowList[index]['field_set'].map((element) => {
          if (element.primary !== true) {
            const formControl = this.form.get(element.field_name);
            if (formControl != null) {
              this.form.controls[element.field_name].setValue(null);
            }
          }
        });
      }
    }
  }
}
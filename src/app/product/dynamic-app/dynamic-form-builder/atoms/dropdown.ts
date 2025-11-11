import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CertificateService } from '../../../services/certificate.service';
import { CommonService } from '../../../../service/common.service';
import * as moment from 'moment';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'dropdown',
  template: `
      <div [formGroup]="form">
        <select *ngIf="field.name !== 'barcode' && !field.primary" class="form-control non_primary" [id]="field.name" [formControlName]="field.name">
          <option [disabled]="true" [value]="null" [selected]="true">{{'select' | translate}} {{field.placeholder}}</option>
          <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.label}}</option>
        </select>

        <select (change)="changeValuePrimaryField($event, field.name);" *ngIf="field.name !== 'barcode' && field.primary" class="form-control non_primary" [id]="field.name" [formControlName]="field.name">
          <option [disabled]="true" [value]="null" [selected]="true">{{'select' | translate}} {{field.placeholder}}</option>
          <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.label}}</option>
        </select>
        <!-- <button mat-button class="save" type="button" *ngIf="field.name !== 'product' && !field.primary && field.save" (click)="savePrimaryValue(field.name, field.type)"><i class="material-icons">
        save
        </i></button> -->
      </div>
    `,
  styles: [
    `
        .form-control { width:100%; }
        .form-control.non_primary { width:85%;}
        .save{ color:#1e232b;background-color: transparent;border-color:transparent;border-radius:2px;border:none;box-shadow:none;outline:none;padding:5px 10px;text-transform: capitalize;position:relative;font-size:24px;top:4px;position:relative;}
          `
  ]
})
export class DropDownComponent {
  public moment = moment;
  @Input() field: any = {};
  @Input() form: FormGroup;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  summaryDetails: any = [];
  resFieldData: any = [];
  primaryFinalValue: any = '';
  workflowList: any = this.userDetails.workflow_list;
  workFlowName: any;
  resultCorrectArr: any = [];
  constructor(
    public certiService: CertificateService,
    public common: CommonService,
    public productService: ProductService,
  ) {
    if (localStorage.getItem('option') != null) {
      this.summaryDetails = JSON.parse(localStorage.getItem('summaryData'));
      if (this.userDetails.profile_details.product_step !== 1) {
        this.searchWithPrimary();
      }
    }

    if (localStorage.getItem('correctEditId')) {
      this.productService.getActivityDetailsEdit(localStorage.getItem('correctEditId')).subscribe(data => {
        this.resultCorrectArr = data;
        if (this.resultCorrectArr != []) {
          this.resultCorrectArr.result.field_set.map((element) => {
            if (element.type === 'document' || element.type === 'productimage') {
              if (element.value != '') {
                this.form.controls[element.name].setValue(element.value);
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
        //     this.prepoulateToField(primaryKey, primaryValue);
        //   }
        // });
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
          //     this.prepoulateToField(primaryKey, primaryValue);
          //   }
          // });
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

  prepoulateotherStep() {
    if (this.summaryDetails.default_value_list != []) {
      this.summaryDetails.default_value_list.map((element) => {
        if (element.type === 'document' || element.type === 'productimage') {
          console.log('hi4');
          console.log(element.field_value);
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
          if (element.type === 'timestamp') {
            const formControl = this.form.get(element.field_name);
            if (formControl != null) {
              this.form.controls[element.field_name].setValue(moment(element.field_value, 'DD-MM-YYYY HH:mm A').format('DD-MM-YYYY HH:mm A'));
            }
          } else {
            const formControl = this.form.get(element.field_name);
            if (formControl != null) {
              if (element.type === 'location' && element.automatic) {
                this.form.controls[element.field_name].setValue(element.field_value && element.field_value != '' ? element.field_value : localStorage.getItem('currentAddress'));
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
        workflow_id: this.workFlowName,
        primary_key: primaryKey,
        primary_value: primaryValue,
      }).subscribe(res => {
        // this.resetForm();
        this.resFieldData = res;
        this.resFieldData.defaults.map((element) => {
          if (element.field_type === 'document' || element.field_type === 'productimage') {
            console.log('hi3');
            console.log(element.field_value);
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
                  this.form.controls[element.field_name].setValue(element.field_value && element.field_value != '' ? element.field_value : localStorage.getItem('currentAddress'));
                  this.form.controls[element.field_name + '_lnglat'].setValue(element.field_value && element.field_value != null && element.field_value != '' ? element.field_value : localStorage.getItem('addressLatlng'));
                } else {
                  this.form.controls[element.field_name].setValue(element.field_value);
                }
              }
            }
          }
        });
      }, err => {
        // this.resetForm();
        // console.log(err);
        this.common.openSnackBar('no_records_found', 'Close');
      });
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
          // if (element.primary !== true) {
          const formControl = this.form.get(element.field_name);
          if (formControl != null) {
            this.form.controls[element.field_name].setValue(null);
          }
          // }
        });
      }
    }
  }
}
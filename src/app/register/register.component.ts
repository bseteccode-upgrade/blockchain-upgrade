/*
 * File : register.component.ts
 * Use: register multiple user
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { CommonService } from '../service/common.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup; // initailaize
  registerButDisable = true; // submit button disable
  registerTypes: any = [
    { code: '1', name: 'student' },
    { code: '2', name: 'university_publisher' },
    { code: '3', name: 'supply_chain_publisher' },
    { code: '6', name: 'Translator' },
    { code: '8', name: 'Custom API' }
  ];
  registerTypeAPI = {
    '1': 'student',
    '2': 'university_publisher',
    '3': 'supply_chain_publisher',
    '6': 'Translator',
    '8': 'Custom API',
  };
  registerDefVal: any = 'undefined';
  errorMsg: string;
  errorMsgArr = [];
  languages: any = [];
  disableReg = false;
  pagelogo = env.white_logo;
  existingUserData: any;
  isReadOnly = false;
  displayRegTypeField = false;
  constructor(
    public formbuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private common: CommonService,
    public ngxSmartModalService: NgxSmartModalService
  ) {
    this.regForm = formbuilder.group({
      'register_type': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'last_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'email': [null, [Validators.required, Validators.email, this.noWhitespaceValidator]],
      // 'student_email': [null, [Validators.required, Validators.email, this.noWhitespaceValidator]],
      'password1': [null, Validators.compose([Validators.required])],
      'password2': [null, Validators.compose([Validators.required])],
      'terms': [false, Validators.compose([Validators.requiredTrue])],
      'translator': [null]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.apiService.getLangList().subscribe(data => {
      this.languages = data;
    });
    this.displayLogo();
  }

  selectUserType(userType) {
    if (userType === '6') {
      this.regForm.controls['translator'].setValue(null);
      this.regForm.controls['translator'].setValidators([Validators.required]);
      this.regForm.controls['translator'].updateValueAndValidity();
    } else {
      this.regForm.controls['translator'].setValue(null);
      this.regForm.controls['translator'].clearValidators();
      this.regForm.controls['translator'].updateValueAndValidity();
    }
  }

  displayLogo() {
    if (localStorage.getItem('stud_org_logo')) {
      this.pagelogo = localStorage.getItem('stud_org_logo');
    } else {
      this.pagelogo = env.white_logo;
    }
  }

  userRegistration(regData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.regForm.valid) {
      if (this.displayRegTypeField) {
        this.apiService.userReRegistration(regData).subscribe(
          response => {
            this.disableReg = true;
            this.router.navigate(['/signin']);
          },
          err => {
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
              this.errorMsg = (errArr.length !== 0) ? errArr[0][0] : err.error;
            } else {
              this.errorMsg = 'some_error_occurred';
            }
          }
        );
      } else {
        this.apiService.userRegistration(regData).subscribe(
          response => {
            this.disableReg = true;
            this.ngxSmartModalService.setModalData('PLEASE VERIFY YOUR EMAIL ADDRESS TO CONTINUE', 'emailverifypopup');
            this.ngxSmartModalService.getModal('emailverifypopup').open();
          },
          err => {
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
              this.errorMsg = (errArr.length !== 0) ? errArr[0][0] : err.error;
            } else {
              this.errorMsg = 'some_error_occurred';
            }
          }
        );
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  geterrorMsg(field) {
    if (field === 'terms') {
      return this.regForm.controls[field].hasError('required') ? 'please_accept_term_condition' : '';
    } else {
      return this.regForm.controls[field].hasError('required')
        || this.regForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
        this.regForm.controls[field].hasError('email') ? 'not_valid_email' : '';
    }
  }

  enterEmailSearch(emailAddress, userType) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress.toLowerCase())) {
      this.apiService.getRegistereduserDetails(emailAddress).subscribe(
        response => {
          this.existingUserData = response;
          // if (this.existingUserData.list_actual.length >= 1) {
          this.ngxSmartModalService.setModalData(this.existingUserData, 'userexists');
          this.ngxSmartModalService.getModal('userexists').open();
          // } else {
          //   this.existingUserData = [];
          // }
        }, err => {
          this.existingUserData = [];
        });
    } else {
      this.regForm.controls['register_type'].setValue(userType ? userType : '2');
      this.regForm.controls['register_type'].clearValidators();
      this.regForm.controls['password1'].setValidators([Validators.required]);
      this.regForm.controls['password2'].setValidators([Validators.required]);
      this.regForm.controls['password1'].updateValueAndValidity();
      this.regForm.controls['password2'].updateValueAndValidity();
      this.regForm.updateValueAndValidity();
    }
  }

  closeTheApproch() {
    this.displayRegTypeField = false;
    this.regForm.controls['register_type'].setValue('2');
    this.regForm.controls['register_type'].clearValidators();
    this.regForm.controls['password1'].setValidators([Validators.required]);
    this.regForm.controls['password2'].setValidators([Validators.required]);
    this.regForm.controls['password1'].updateValueAndValidity();
    this.regForm.controls['password2'].updateValueAndValidity();
    this.ngxSmartModalService.getModal('userexists').close();
  }

  okTheApproch() {
    this.displayRegTypeField = true;
    this.regForm.controls['register_type'].setValue(null);
    this.regForm.controls['register_type'].setValidators([Validators.required]);
    this.regForm.controls['password1'].clearValidators();
    this.regForm.controls['password2'].clearValidators();
    this.regForm.controls['password1'].updateValueAndValidity();
    this.regForm.controls['password2'].updateValueAndValidity();
    this.regForm.controls['first_name'].setValue(this.existingUserData.first_name);
    this.regForm.controls['last_name'].setValue(this.existingUserData.last_name);
    this.regForm.controls['email'].setValue(this.existingUserData.email);
    this.isReadOnly = true;
    this.ngxSmartModalService.getModal('userexists').close();
  }

  trimInput(field, e) {
    this.regForm.controls[field].setValue(e.target.value.trim());
  }

  closeEmailVerify() {
    this.router.navigate(['/signin']);
  }
}

/*
 * File : apiregister.component.ts
 * Use: only using for api user type registration option
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-apiregister',
  templateUrl: './apiregister.component.html',
  styleUrls: ['./apiregister.component.css']
})
export class ApiregisterComponent implements OnInit {

  regForm: FormGroup; // initailaize
  registerButDisable = true; // submit button disable
  registerTypes: any = [
    { code: '2', name: 'university_publisher' },
    { code: '3', name: 'supply_chain_publisher' },
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
  existingUserData: any = [];
  isReadOnly = false;
  displayRegTypeField = false;
  constructor(
    public formbuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService
  ) {
    // register form creation
    this.regForm = formbuilder.group({
      'register_type': ['8'],
      'first_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'last_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'email': [null, [Validators.required, Validators.email, this.noWhitespaceValidator]],
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
    // get language data
    this.apiService.getLangList().subscribe(data => {
      this.languages = data;
    });
    this.displayLogo();
  }

  displayLogo() {
    if (localStorage.getItem('stud_org_logo')) {
      this.pagelogo = localStorage.getItem('stud_org_logo');
    } else {
      this.pagelogo = env.white_logo;
    }
  }

  /**
   * @function userRegistration
   * @description api user type data submission functionality
   * @param regData submitted form data
   */
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

  enterEmailSearch(emailAddress) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress.toLowerCase())) {
      this.apiService.getRegistereduserDetails(emailAddress).subscribe(
        response => {
          this.existingUserData = response;
          this.existingUserData.list_actual = this.existingUserData.list_actual.filter(item => item !== '6');
          this.ngxSmartModalService.setModalData(this.existingUserData, 'userexists');
          this.ngxSmartModalService.getModal('userexists').open();
        }, err => {
          this.existingUserData = [];
        });
    } else {
      this.regForm.controls['register_type'].setValue('8');
      this.regForm.controls['register_type'].clearValidators();
      this.regForm.controls['password1'].setValidators([Validators.required]);
      this.regForm.controls['password2'].setValidators([Validators.required]);
      this.regForm.controls['password1'].updateValueAndValidity();
      this.regForm.controls['password2'].updateValueAndValidity();
      this.regForm.controls['register_type'].updateValueAndValidity();
      this.regForm.updateValueAndValidity();
    }
  }

  /**
     * @function closeTheApproch
     * @description if exiating user no need to add with previous data means password field must need to entered
     */
  closeTheApproch() {
    this.displayRegTypeField = false;
    this.regForm.controls['register_type'].setValue('8');
    this.regForm.controls['register_type'].clearValidators();
    this.regForm.controls['password1'].setValidators([Validators.required]);
    this.regForm.controls['password2'].setValidators([Validators.required]);
    this.regForm.controls['password1'].updateValueAndValidity();
    this.regForm.controls['password2'].updateValueAndValidity();
    this.regForm.controls['register_type'].updateValueAndValidity();
    this.ngxSmartModalService.getModal('userexists').close();
  }

  /**
     * @function okTheApproch
     * @description if exiating user need to add with previous data means no need to provide password
     */
  okTheApproch() {
    this.displayRegTypeField = true;
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

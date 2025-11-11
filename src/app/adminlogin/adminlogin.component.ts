/*
 * File : adminlogin.component.ts
 * Use: Admin user can view the any type user account with use of admin password
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {
  appName = env.project_name;
  siteName = env.project_site;
  process = true;
  pagelogo = env.white_logo;

  loginForm: FormGroup;
  errorMsg: string;
  disableReg = false;
  resLoginData: any;
  constructor(
    public formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {
    this.loginForm = formbuilder.group({
      'password': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
  }

  ngOnInit() {
    this.apiService.logoutAdminLogin();
    this.clearLocalStorage();
    this.displayLogo();
  }

  getErrorMessage(field) {
    return this.loginForm.controls[field].hasError('required')
      || this.loginForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.loginForm.controls[field].hasError('email') ? 'not_valid_email' : '';
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  /**
   * @function userLogin
   * @description submit admin password and based on user type redirect to the user privillege pages
   * @param formData submitted form data
   */
  userLogin(formData) {

    // this.route.params.subscribe(params => {
    //   localStorage.setItem('token', 'Token ' + params['token']);
    //   localStorage.setItem('user_reg_type', params['regtype']);
    //   this.apiService.getUser();
    // });
    this.errorMsg = '';
    if (formData.email) {
      formData.email = formData.email.trim();
    }
    if (this.loginForm.valid) {
      this.apiService.adminverifyLogin(formData).subscribe(
        res => {
          this.resLoginData = res;
          this.disableReg = true;
          if (this.resLoginData.status) {
            this.route.params.subscribe(params => {
              localStorage.setItem('token', 'Token ' + params['token']);
              localStorage.setItem('user_reg_type', params['regtype']);
              this.apiService.getUser();
            });
          } else {
            this.disableReg = false;
            this.errorMsg = 'unable_to_login';
          }
        },
        err => {
          this.disableReg = false;
          if (err.error && err.error.detail) {
            this.errorMsg = err.error.detail;
          } else if (err.status === 400) {
            const errArr = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
              }
            }
            this.errorMsg = (errArr.length !== 0) ? errArr[0][0] : err.error;
          } else {
            this.errorMsg = 'some_error_occurred';
          }
        }
      );
    } else {
      this.disableReg = false;
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  /**
   * @function clearLocalStorage
   * @description Clear localstroage value before login
   */
  clearLocalStorage() {
    localStorage.removeItem('workflow_db_id');
    localStorage.removeItem('redirectwhichcert');
    localStorage.removeItem('redirectWhich');
    localStorage.removeItem('redirectFrom');
    localStorage.removeItem('redirectProduct');
    localStorage.removeItem('option');
    localStorage.removeItem('in_batch_id_dynamic');
    localStorage.removeItem('out_batch_id_dynamic');
    localStorage.removeItem('activity_id_dynamic');
    localStorage.removeItem('user_details');
    localStorage.removeItem('type');
    localStorage.removeItem('paymentPlan');
    localStorage.removeItem('user_reg_type');
    localStorage.removeItem('user_email');
    localStorage.removeItem('searchworkflowid');
    localStorage.removeItem('searchoutbatchid');
    localStorage.removeItem('selectOutBatchID');
    localStorage.removeItem('token');
  }

  /**
   * @function displayLogo
   * @description display the logo to admin login page
   */
  displayLogo() {
    if (localStorage.getItem('stud_org_logo')) {
      this.pagelogo = localStorage.getItem('stud_org_logo');
    } else {
      this.pagelogo = env.white_logo;
    }
  }

}

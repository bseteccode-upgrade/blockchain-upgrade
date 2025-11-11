/*
 * File : signin.component.ts
 * Use: signin page functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { CommonService } from '../service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment as env } from '../../environments/environment';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  appName = env.project_name;
  siteName = env.project_site;
  loginForm: FormGroup; // initailaize
  errorMsg: string;
  pagelogo = env.white_logo;
  orgID: any;
  resLogoUrl: any;
  baseUrl = env.baseUrl;
  disableReg = false;
  resLoginData: any;
  verifyId: any;
  verifyResData: any;
  getReturnData: any;
  initialUserType = '2';
  qr_code: any = '';
  option: any = '';
  register_list = {
    '0': 'sc_sub_admin',
    '1': 'student',
    '2': 'publisher_signup',
    '3': 'supply chain',
    '4': 'team member',
    '5': 'supply chain team member',
    '6': 'translator',
    '7': 'super user',
    '8': 'API',
    '9': 'reviewer'
  };
  fromAdmin = false;
  batchId: any;
  constructor(
    public formbuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public common: CommonService,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
    this.route.queryParams.subscribe(data => {
      this.batchId = data['id'];
      if (this.batchId !== '' && this.batchId != null) {
        this.router.navigate(['/viewproduct', this.batchId]);
      }
    });
    if (localStorage.getItem('token')) {
      this.apiService.logoutAdminLogin();
    }
    this.loginForm = formbuilder.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'is_web': 'true',
      'site_url': env.baseUrl
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    /**
     * View product page redirect
     */
    if (localStorage.getItem('fromqrscanned') && localStorage.getItem('fromqrscanned') !== null) {
      // this.router.navigate(['/viewproduct', localStorage.getItem('fromqrscanned')]);
      window.location.href = '/viewproduct/' + localStorage.getItem('fromqrscanned');
    }

    this.clearLocalStorage();
    this.displayLogo();

    this.route.queryParams.subscribe(params => {
      this.orgID = params['activation'];
      if (this.orgID !== '' && this.orgID != null) {
        this.apiService.getOrgLogo(this.orgID).subscribe(
          data => {
            this.resLogoUrl = data;
            if (this.resLogoUrl.org_logo != null) {
              this.pagelogo = this.resLogoUrl.org_logo ? this.resLogoUrl.org_logo : env.white_logo;
              localStorage.setItem('stud_org_logo', this.resLogoUrl.org_logo);
              this.router.navigate(['signin']);
            } else {
              this.displayLogo();
              this.router.navigate(['signin']);
            }
          }, err => {
            this.displayLogo();
            this.router.navigate(['signin']);
          }
        );
      } else {
        this.displayLogo();
        this.router.navigate(['signin']);
      }
      this.verifyId = params['verifyid'];
      if (this.verifyId) {
        this.apiService.verfyEmail({ verify_code: this.verifyId }).subscribe(resData => {
          this.verifyResData = resData;
          if (this.verifyResData.message) {
            if (this.verifyResData.message === 'email_notverified') {
              // this.common.openSnackBar('Email Not Verified', 'Close');
              this.ngxSmartModalService.setModalData('Email Not Verified', 'emailverifypopup');
              this.ngxSmartModalService.getModal('emailverifypopup').open();
            } else if (this.verifyResData.message === 'email_verified') {
              // this.common.openSnackBar('Email Verified', 'Close');
              this.ngxSmartModalService.setModalData('Email Verified, Please login', 'emailverifypopup');
            }
            this.ngxSmartModalService.getModal('emailverifypopup').open();
            this.router.navigate(['signin']);
            setTimeout(() => {
              this.ngxSmartModalService.getModal('emailverifypopup').close();
            }, 4000);
          }
        });
      }
      this.qr_code = params['type'];
      this.option = params['option'];
      if (this.qr_code) {
        localStorage.setItem('type', this.qr_code);
      }
      if (this.option) {
        localStorage.setItem('option', this.option);
      }
    },
      err => {
        this.displayLogo();
      });
  }

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
    localStorage.removeItem('token');
  }

  displayLogo() {
    if (localStorage.getItem('stud_org_logo')) {
      this.pagelogo = localStorage.getItem('stud_org_logo');
    } else {
      this.pagelogo = env.white_logo;
    }
  }

  /**
   *@function onCheckWho
   *@description multiple user login, we used this function
   *@param userType user register type
   */
  onCheckWho(userType) {
    localStorage.setItem('user_reg_type', userType);
    this.ngxSmartModalService.getModal('myModal').close();
    this.apiService.getUser();
    if (userType == '1') {
      this.apiService.shareUpdate(0).subscribe(
        returndata => {});
    }
  }

  userLogin(formData) {
    this.errorMsg = '';
    if (formData.email) {
      formData.email = formData.email.trim();
    }
    if (this.loginForm.valid) {
      if (localStorage.getItem('token')) {
        this.apiService.getUser();
      } else {
        this.apiService.userLogin(formData).subscribe(
          res => {
            this.resLoginData = res;
            this.disableReg = true;
            this.apiService.showTooltip = true;
            localStorage.setItem('token', 'Token ' + this.resLoginData.key);
            this.apiService.getUserPub().subscribe(data => {
              this.getReturnData = data;
              if (this.getReturnData.register_list.length > 1) {
                this.ngxSmartModalService.setModalData(this.getReturnData.register_list, 'myModal');
                this.ngxSmartModalService.getModal('myModal').open();
              } else {
                this.disableReg = false;
                localStorage.setItem('user_reg_type', this.getReturnData.register_list[0]);
                if (this.getReturnData.register_list[0] == '1') {
                  this.apiService.shareUpdate(0).subscribe(
                    returndata => {});
                }
                this.apiService.getUser();
              }
            });
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
      }
    } else {
      this.disableReg = false;
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  getErrorMessage(field) {
    return this.loginForm.controls[field].hasError('required')
      || this.loginForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.loginForm.controls[field].hasError('email') ? 'not_valid_email' : '';
  }

  trimInput(field, e) {
    if (e.target.value) {
      this.loginForm.controls[field].setValue(e.target.value.trim());
    }
  }
}

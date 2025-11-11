/*
 * File : forgot-pwd.component.ts
 * Use: User forgot password functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment as env } from '../../environments/environment';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent implements OnInit {
  appName = env.project_name;
  siteName = env.project_site;
  forPwdForm: FormGroup; // initailaize
  errorMsg: string;
  pagelogo = env.white_logo;
  orgID: any;
  resLogoUrl: any;
  baseUrl = env.baseUrl;
  linkSent = false;
  isLoad = false;
  errorMsgArr: any = [];
  constructor(
    formbuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.forPwdForm = formbuilder.group({
      'email': [null, Validators.compose([Validators.required, Validators.email, this.noWhitespaceValidator])],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    localStorage.clear();
    this.route.params.subscribe(params => {
      this.orgID = params['activation'];
      if (this.orgID !== '' && this.orgID != null) {
        this.apiService.getOrgLogo(this.orgID).subscribe(
          data => {
            this.resLogoUrl = data;
            if (this.resLogoUrl.org_logo != null) {
              this.pagelogo = this.resLogoUrl.org_logo ? this.resLogoUrl.org_logo : env.white_logo;
              localStorage.setItem('stud_org_logo', this.resLogoUrl.org_logo);
            } else {
              this.displayLogo();
            }
          }, err => {
            this.displayLogo();
          }
        );
      } else {
        this.displayLogo();
      }
    });
  }

  /**
   * @function displayLogo
   * @description display the vottun logo or company logo based on user login
   */
  displayLogo() {
    if (localStorage.getItem('stud_org_logo')) {
      this.pagelogo = localStorage.getItem('stud_org_logo');
    }
  }

  /**
   * @function sendLink
   * @description submit user mail and send forgot mail with use of api call
   * @param formData forgot password form data
   */
  sendLink(formData) {
    this.errorMsg = '';
    this.isLoad = true;
    if (this.forPwdForm.valid) {
      this.apiService.resetLink(formData).subscribe(
        data => {
          this.isLoad = false;
          this.linkSent = true;
        },
        err => {
          this.isLoad = false;
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = 'provide_valid_inputs';
        }
      );
    } else {
      this.isLoad = false;
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  getErrorMessage(field) {
    return this.forPwdForm.controls[field].hasError('required')
      || this.forPwdForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.forPwdForm.controls[field].hasError('email') ? 'not_valid_email' : '';
  }

}

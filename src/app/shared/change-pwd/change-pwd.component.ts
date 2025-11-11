/*
 * File : change-pwd.component.ts
 * Use: change password page common for all user
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent implements OnInit {
  changeForm: FormGroup;
  errorMsg = '';
  successMsg = '';
  errorMsgArr = [];
  process = false;
  constructor(
    formbuilder: FormBuilder,
    private apiService: ApiService,
    public common: CommonService,
    private router: Router
  ) {
    this.changeForm = formbuilder.group({
      'old_password': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'new_password1': [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(8)])],
      'new_password2': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      if ((this.apiService.userType === '4' || this.apiService.userType === '5') && !this.apiService.pages.change_password) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
      if (this.apiService.userType === '9' && !this.apiService.pages.change_password) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
    }, 1000);
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  changePassword(formData) {
    this.errorMsg = '';
    if (this.changeForm.valid && formData.new_password1 === formData.new_password2) {
      this.process = true;
      this.apiService.changePassword(formData).subscribe(
        data => {
          this.process = false;
          this.successMsg = 'password_changed_successfully';
          this.errorMsg = '';
          this.changeForm.reset();
        },
        err => {
          this.process = false;
          this.successMsg = '';
          if (err.error && err.error.detail) {
            this.errorMsg = 'password_mis';
          } else {
            const errArr = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
                this.errorMsgArr[key] = 'password_invalid';
              }
            }
            this.errorMsg = (errArr.length !== 0) ? errArr[0][0] : err.error;
          }
        }
      );
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  getErrorMessage(field, err?: string) {
    return this.changeForm.controls[field].hasError('required')
      || this.changeForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.changeForm.controls[field].hasError('minlength') ? 'minimum_characters' :
        (err !== '') ? err : '';
  }

}

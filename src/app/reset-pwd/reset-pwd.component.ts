/*
 * File : reset-pwd.component.ts
 * Use: user password reset password functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';

import { ApiService } from '../service/api.service';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.css']
})
export class ResetPwdComponent implements OnInit {
  resetForm: FormGroup;
  errorMsg: string;
  pagelogo = env.white_logo;
  constructor(formbuilder: FormBuilder, private apiService: ApiService, private router: Router) {
    this.resetForm = formbuilder.group({
      'new_password1': [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      'new_password2': [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
  }

  reset(formData) {
    if (this.resetForm.valid) {
      this.router.navigate(['/signin']);
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  getErrorMessage(field) {
    return this.resetForm.controls[field].hasError('required')
      || this.resetForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.resetForm.controls[field].hasError('minlength') ? 'You must enter minimum 8 charactors' :
        '';
  }
}

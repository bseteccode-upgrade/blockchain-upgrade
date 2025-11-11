/*
 * File : multiple-email.component.ts
 * Use: Student can use the secondary mail address
 * add / edit / delete functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CommonService } from '../../service/common.service';
import { StudentService } from '../services/student.service';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multiple-email',
  templateUrl: './multiple-email.component.html',
  styleUrls: ['./multiple-email.component.css']
})
export class MultipleEmailComponent implements OnInit {
  resStudMailLists: any = [];
  reasonForm: FormGroup;
  reasonErrorMsg = '';
  resData: any;
  submitButtonDisable = false;
  errorMsgArr: any = [];
  mailAddressId = '';
  resDelete: any;
  resPrimaryMail: any;
  resVerifyMail: any;
  @ViewChild('resetFormID') resetFormCheck;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private stdService: StudentService,
    private apiService: ApiService,
    public formbuilder: FormBuilder,
    private common: CommonService,
    public router: Router
  ) { }

  ngOnInit() {
    if (this.apiService.userType !== '1') {
      this.router.navigateByUrl('/');
    }
    this.getUserEmailAddress();
    this.reasonForm = this.formbuilder.group({
      'email': [null, Validators.compose([Validators.required, Validators.email, this.noWhitespaceValidator])]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  getUserEmailAddress() {
    this.stdService.getStudentMailAddress().subscribe(data => {
      this.resStudMailLists = data;
    }, err => {
      this.resStudMailLists = [];
      this.common.openSnackBar('some_error_occurred', 'Close');
    });
  }

  openDialogReset() {
    this.reasonErrorMsg = '';
    this.errorMsgArr = [];
    this.reasonForm.reset();
    this.resetFormCheck.resetForm();
  }

  reasonFormSubmit(formdata) {
    this.reasonErrorMsg = '';
    this.errorMsgArr = [];
    if (!this.reasonForm.invalid) {
      const params = {
        'email': formdata.email
      };
      this.submitButtonDisable = true;
      this.stdService.addNewMailAddress(params).subscribe(
        data => {
          this.resData = data;
          if (this.resData.id !== '') {
            this.submitButtonDisable = false;
            this.common.openSnackBar('email_added_successfully', 'Close');
            this.ngxSmartModalService.getModal('deletemyModal').close();
            this.getUserEmailAddress();
          } else {
            this.submitButtonDisable = false;
            this.common.openSnackBar('some_error_occurred', 'Close');
          }
        },
        err => {
          this.reasonErrorMsg = 'error';
          this.submitButtonDisable = false;
          this.errorMsgArr['email'] = 'user_email_already_exits';
        }
      );
    } else {
      this.reasonErrorMsg = 'error';
    }
  }

  getreasonErrorMsg(field) {
    return this.reasonForm.controls[field].hasError('required')
      || this.reasonForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.reasonForm.controls[field].hasError('email') ? 'not_valid_email' :
        '';
  }

  getDeleteMailID(idMailAddress) {
    this.mailAddressId = idMailAddress;
  }

  deleteMailAddress() {
    this.stdService.deleteStudentMailAddrss(this.mailAddressId).subscribe(data => {
      this.resDelete = data;
      if (this.resDelete.message === 'Content Deleted') {
        this.common.openSnackBar('deleted_successfully', 'Close');
        this.ngxSmartModalService.getModal('myModal').close();
        this.getUserEmailAddress();
      }
    }, err => {
      this.common.openSnackBar('some_error_occurred', 'Close');
    });
  }

  makePrimaryEmail(id, mail) {
    const params = {
      'primary': true,
      'email': mail
    };
    this.stdService.makeMailAsPrimary(id, params).subscribe(data => {
      this.resPrimaryMail = data;
      this.getUserEmailAddress();
      this.common.openSnackBar('mail_make_as_primary', 'Close');
    }, err => {
      this.common.openSnackBar('some_error_occurred', 'Close');
    });
  }

  resendEmail(id) {
    const params = {
      'email_id': id
    };
    this.stdService.reSendVerifyMail(params).subscribe(data => {
      this.resVerifyMail = data;
      this.getUserEmailAddress();
      this.common.openSnackBar('resend_mail_sent', 'Close');
    }, err => {
      this.common.openSnackBar('some_error_occurred', 'Close');
    });
  }

}

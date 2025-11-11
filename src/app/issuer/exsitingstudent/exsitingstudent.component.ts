/*
 * File : exsitingstudent.component.ts
 * Use: add existing student to the current publisher
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { CommonService } from '../../service/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-exsitingstudent',
  templateUrl: './exsitingstudent.component.html',
  styleUrls: ['./exsitingstudent.component.css']
})
export class ExsitingstudentComponent implements OnInit {
  searchForm: FormGroup;
  addStudentExtra: FormGroup;
  studentDetails: any = [];
  norecordfound = true;
  errorMsg = '';
  selectedStudents: any = [];
  responseData: any = [];
  @ViewChild('resetFormID') resetFormCheck;
  baseUrl = env.baseUrl;
  exsitmailaddress: any = '';
  certificateLists: any = [];

  constructor(
    public formbuilder: FormBuilder,
    public studentService: StudentService,
    private common: CommonService,
    private router: Router,
    public apiService: ApiService
  ) {
    this.searchForm = this.formbuilder.group({
      'search': [null, Validators.compose([Validators.required, Validators.email])]
    });
    this.addStudentExtra = this.formbuilder.group({
      'company_code': [null],
      'sap_code': [null],
      'social_security_code': [null]
    });
    // this.addStudentExtra = this.formbuilder.group({
    //   'company_code': [''],
    //   'sap_code': [''],
    //   'social_security_code': ['']
    // });
    if (apiService.user.profile_details.is_private_user) {
      this.addStudentExtra.controls['company_code'].setValidators([Validators.required, this.noWhitespaceValidator]);
      this.addStudentExtra.controls['sap_code'].setValidators([Validators.required, this.noWhitespaceValidator]);
      this.addStudentExtra.controls['social_security_code'].setValidators([Validators.required, this.noWhitespaceValidator]);
      this.addStudentExtra.updateValueAndValidity();
    } else {
      this.addStudentExtra.controls['company_code'].setValidators([]);
      this.addStudentExtra.controls['sap_code'].setValidators([]);
      this.addStudentExtra.controls['social_security_code'].setValidators([]);
      this.addStudentExtra.updateValueAndValidity();
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.exsitmailaddress = localStorage.getItem('exsitmailaddress');
    localStorage.removeItem('exsitmailaddress');
    if (this.exsitmailaddress && this.exsitmailaddress !== '') {
      this.studentService.searchGetStudent(this.exsitmailaddress).subscribe( data => {
        this.studentDetails = data;
        if (this.studentDetails.id !==  '' ) {
          this.selectedStudents = this.studentDetails;
          this.certificateLists = this.studentDetails.certificate_list;
          this.norecordfound = false;
        } else {
          this.norecordfound = true;
        }
      }, err => {
        this.common.openSnackBar('some_error_occurred', 'Close');
      });
    } else {
      this.router.navigate(['students']);
    }
  }

  redirectFind() {
    if (localStorage.getItem('requestredirect') === 'yes') {
      this.router.navigate(['request']);
    } else {
      this.router.navigate(['students']);
    }
  }

  // search student based on the input data
  getStudents(formData) {
    this.errorMsg = '';
    if (this.searchForm.valid) {
      this.studentService.searchGetStudent(formData.search).subscribe( data => {
        this.studentDetails = data;
        if (typeof this.studentDetails !== 'undefined' && this.studentDetails.length > 0 ) {
          this.selectedStudents = this.studentDetails;
          this.norecordfound = false;
        } else {
          this.norecordfound = true;
        }
      }, err => {
        this.common.openSnackBar('some_error_occurred', 'Close');
      });
    } else {
      this.errorMsg = 'error';
    }
  }

  /**
   * @function addExsitingStud
   * @description add the existing student
   * @param formData selected student data
   */
  addExsitingStud(formData) {
    this.errorMsg = '';
    if (!this.addStudentExtra.invalid) {
      const params = {
        'student': this.selectedStudents.id,
        'company_code': formData.company_code,
        'sap_code':  formData.sap_code,
        'social_security_code': formData.social_security_code
      };
      this.studentService.addExsitingStud(params).subscribe(res => {
        this.responseData = res;
        this.common.openSnackBar('student_add_successful', 'Close');
        this.router.navigate(['students']);
      }, err => {
        this.common.openSnackBar('some_error_occurred', 'Close');
      });
    } else {
      this.errorMsg = 'error';
    }
  }

  geterrorMsg(field) {
    return this.addStudentExtra.controls[field].hasError('required')
      || this.addStudentExtra.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

  resetSearch() {
    this.errorMsg = '';
    this.norecordfound = true;
    this.searchForm.reset();
    this.resetFormCheck.resetForm();
  }

}

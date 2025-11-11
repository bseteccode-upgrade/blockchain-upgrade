/*
 * File : custom-feature.component.ts
 * Copyright : vottun 2019
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-custom-feature',
  templateUrl: './custom-feature.component.html',
  styleUrls: ['./custom-feature.component.css']
})
export class CustomFeatureComponent implements OnInit, OnDestroy {
  groupnameinput: any = '';
  studentModel: any = {
    dob: null,
    phone: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    avatar: '',
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    profile_id: '',
    student_id: '',
    group_name_data: null
  };
  search: any;
  errorMsg: string;
  studentForm: FormGroup;
  profilePic = new FormData();
  errorMsgArr: any = [];
  studentId: string;
  process = false;

  options: any = [];
  filteredOptions: any = [];
  myControl = new FormControl();
  getGroupDataSubscribtion: any;
  constructor(
    private formbuilder: FormBuilder,
    private stdService: StudentService,
    public apiService: ApiService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(group_name => group_name ? this._filter(group_name) : this.options.slice())
      );
  }

  getGroupData() {
    this.getGroupDataSubscribtion = this.stdService.getGroupList().subscribe(data => {
      this.options = data;
    });
  }

  ngOnInit() {
    this.getGroupData();
    this.studentId = this.route.snapshot.paramMap.get('id');
    if (this.studentId) {
      this.stdService.getStudent(this.studentId).subscribe(data => {
        this.studentModel = data;
        this.createForm();
        this.displayFn(this.studentModel.group_name_data);
      });
    }
  }

  /** Group Auto Filter - start */
  displayFn(data) {
    return data.group_name ? data.group_name : data;
  }

  private _filter(group_name) {
    const filterValue = group_name.toLowerCase();
    return this.options.filter(option => option.group_name.toLowerCase().indexOf(filterValue) === 0);
  }
  /** Group Auto Filter - end */

  createForm() {
    this.studentForm = this.formbuilder.group({
      'student_id': [this.studentModel.student_id, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_name': [this.studentModel.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'last_name': [this.studentModel.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'email': [this.studentModel.email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'issuer_description': [''],
      'phone': [this.studentModel.phone, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
      'dob': [this.studentModel.dob],
      'gender': [this.studentModel.gender],
      'address': [this.studentModel.address],
      'city': [this.studentModel.city],
      'state': [this.studentModel.state],
      'country': [this.studentModel.country],
      'zipcode': [this.studentModel.zipcode, Validators.compose([Validators.pattern(/^-?([0-9]\d*)?$/)])],
      'avatar': [this.studentModel.avatar],
      'group_id': [this.studentModel.group_name_data]
    });
  }

  changeDateEvent(e) {
    this.studentForm.controls['dob'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit(formData) {
    this.errorMsgArr = [];
    if (this.studentForm.valid) {
      if (this.studentId) {
        this.editStudent(formData, this.studentId);
      } else {
        this.addStudent(formData);
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  getinputgroupname(inputVal) {
    this.groupnameinput = inputVal;
  }

  addStudent(formData) {
    this.process = true;
    if (typeof formData.group_id === 'object') {
      formData['group_id'] = formData.group_id.group_name;
    } else {
      formData['group_id'] = this.groupnameinput;
    }
    this.stdService.addStudent(formData).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('student_add_successful', 'Close');
        this.router.navigate(['students']);
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = 'provide_valid_inputs';
        }
      }
    );
  }

  editStudent(formData, id) {
    this.process = true;
    if (typeof formData.group_id === 'object' && formData.group_id) {
      formData['group_id'] = formData.group_id.group_name;
    } else {
      formData['group_id'] = this.groupnameinput;
    }
    this.stdService.editStudent(formData, id).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('student_detail_edit', 'Close');
        this.router.navigate(['students']);
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = 'provide_valid_inputs';
        }
      }
    );
  }

  uploadFile(e) {
    this.errorMsg = '';
    this.errorMsgArr['avatar'] = '';
    this.profilePic = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.profilePic.append('file', file, file.name);
        this.profilePic.append('user', this.apiService.user.id);
        this.apiService.uploadFile(this.profilePic).subscribe(
          data => {
            this.studentModel.avatar = data['file_url'];
            this.studentForm.controls['avatar'].setValue(data['file_url']);
            this.profilePic = new FormData();
          },
          err => {
            this.common.openSnackBar('error_in_file_upload', 'Close');
          }
        );
      } else {
        this.studentModel.avatar = '';
        this.errorMsgArr['avatar'] = 'file_size_more';
      }
    } else {
      this.studentModel.avatar = '';
      this.errorMsgArr['avatar'] = 'invalid_file_type';
    }
  }

  geterrorMsg(field) {
    if (field === 'phone') {
      return this.studentForm.controls[field].hasError('pattern') ? 'enter_valid_phonenumber' : '';
    } else if (field === 'zipcode') {
      return this.studentForm.controls[field].hasError('pattern') ? 'enter_only_number' : '';
    } else {
      return this.studentForm.controls[field].hasError('required')
        || this.studentForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
        this.studentForm.controls[field].hasError('email') ? 'not_valid_email' : '';
    }
  }
  refreshDobDate() {
    this.studentForm.controls['dob'].setValue(null);
    this.studentForm.markAsTouched();
    return false;
  }

  ngOnDestroy() {
    if (this.getGroupDataSubscribtion) {
      this.getGroupDataSubscribtion.unsubscribe();
    }
  }
}

/*
 * File : add-student.component.ts
 * Use: add new and existing student
 * Copyright : vottun 2019
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit, OnDestroy {
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
    group_name_data: '',
    company_code: '',
    sap_code: '',
    social_security_code: ''
  };
  search: any;
  errorMsg: string;
  studentForm: FormGroup;
  profilePic = new FormData();
  errorMsgArr: any = [];
  studentId: string;
  process = false;
  searchData: any;
  mainPubError = false;

  options: any = [];
  filteredOptions: any = [];
  myControl = new FormControl();
  resExsitingStud: any;
  exsitingButton = false;
  exsitingEmailAdd = '';
  searchInputVal = '';
  getGroupListSubscription: any;
  getStudentSubscription: any;
  constructor(
    private formbuilder: FormBuilder,
    private stdService: StudentService,
    public apiService: ApiService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
    this.createForm();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(group_name => group_name ? this._filter(group_name) : this.options.slice())
      );
  }

  /**
   * @function getGroupData
   * @description get group list
   */
  getGroupData() {
    this.getGroupListSubscription = this.stdService.getGroupList().subscribe(data => {
      this.options = data;
    });
  }

  ngOnInit() {
    localStorage.removeItem('exsitmailaddress');
    this.getGroupData();
    this.studentId = this.route.snapshot.paramMap.get('id');
    if (this.studentId) {
      this.getStudentSubscription = this.stdService.getStudent(this.studentId).subscribe(data => {
        this.studentModel = data;
        this.createForm();
        this.displayFn(this.studentModel.group_name_data);
        this.groupnameinput = this.studentModel.group_name_data;
      });
    }
  }

  /** Group Auto Filter - start */
  displayFn(data) {
    return data.group_name ? data.group_name : data;
  }

  private _filter(group_name) {
    // const filterValue = group_name.toLowerCase();
    return this.options.filter(option => option.group_name.toLowerCase().indexOf(group_name) === 0);
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
      'zipcode': [''],
      'avatar': [this.studentModel.avatar],
      'group_id': [this.studentModel.group_name_data],
      'company_code': [this.studentModel.company_code],
      'sap_code': [this.studentModel.sap_code],
      'social_security_code': [this.studentModel.social_security_code]
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

  /**
   * @function submit
   * @description create and edit student details submit option
   * @param formData user entered stduent data
   */
  submit(formData) {
    localStorage.removeItem('exsitmailaddress');
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

  /**
   * @function addStudent
   * @description create new student details and form validation
   * @param formData new student form data
   */
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

  /**
   * @function editStudent
   * @description edit student details and form validation
   * @param formData student form data
   * @param id edited student id
   */
  editStudent(formData, id) {
    this.process = true;
    if (typeof formData.group_id === 'object' && formData.group_id) {
      formData['group_id'] = formData.group_id.group_name;
    } else {
      if (this.groupnameinput.trim() !== '' && this.groupnameinput.trim() !== null) {
        formData['group_id'] = this.groupnameinput.trim();
      } else {
        formData['group_id'] = formData.group_id;
      }
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

  /**
   * @function uploadFile
   * @description upload student image files and validate image file and file size
   * @param e uploaded student profile image
   */
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

  /**
   * @function findEmailExist
   * @description if student already exist means, we need to display the popup window
   * @param inputVal entered student name
   * @param type email
   */
  findEmailExist(inputVal, type) {
    this.mainPubError = false;
    const params = new URLSearchParams();
    if (type === 'id') {
      this.searchData = { 'student_id': inputVal };
      if (inputVal.length >= 5) {
        this.searchInputVal = inputVal;
      } else {
        this.searchInputVal = '';
      }
    } else {
      this.searchData = { 'email': inputVal };
      this.searchInputVal = inputVal;
    }
    for (const key in this.searchData) {
      if (this.searchData[key]) {
        params.set(key, this.searchData[key]);
      }
    }
    localStorage.removeItem('exsitmailaddress');
    this.exsitingButton = false;
    this.exsitingEmailAdd = '';

    if (this.searchInputVal !== '') {
      this.stdService.findExsitingStud(params.toString()).subscribe(data => {
        this.resExsitingStud = data;
        if (this.resExsitingStud.status === 1 || this.resExsitingStud.status === 2) {
          if (this.resExsitingStud.response.is_other_publisher_student === true ||
            this.resExsitingStud.response.is_main_publisher_student === true) {
            this.exsitingButton = true;
            this.exsitingEmailAdd = this.searchInputVal;
            if (this.resExsitingStud.status === 2) {
              this.mainPubError = true;
            } else {
              this.mainPubError = false;
            }
          } else {
            this.exsitingButton = false;
            this.exsitingEmailAdd = '';
          }
        }
      });
    } else {
      this.exsitingButton = false;
      this.exsitingEmailAdd = '';
    }
  }

  /**
   * @function findIDExist
   * @description if student already exist means, we need to display the popup window
   * @param inputVal entered student id
   */
  findIDExist(inputVal) {
    const params = new URLSearchParams();
    this.searchData = { 'student_id': inputVal };
    if (inputVal.length >= 5) {
      this.searchInputVal = inputVal;
    } else {
      this.searchInputVal = '';
    }
    for (const key in this.searchData) {
      if (this.searchData[key]) {
        params.set(key, this.searchData[key]);
      }
    }
    if (this.searchInputVal !== '') {
      this.stdService.findExsitingStud(params.toString()).subscribe(data => {
        this.resExsitingStud = data;
        if (this.resExsitingStud.status === 1 || this.resExsitingStud.status === 2) {
          if (this.resExsitingStud.response.is_current_publisher_student === true || this.resExsitingStud.response.is_other_publisher_student === true) {
            this.ngxSmartModalService.getModal('studexist').open();
          }
        }
      });
    }
  }

  /**
   * @function redirectToExsit
   * @description close popup means, rediect to the existing student details page
   */
  redirectToExsit() {
    localStorage.setItem('exsitmailaddress', this.exsitingEmailAdd);
    localStorage.setItem('requestredirect', 'no');
    this.router.navigate(['existingstudent']);
  }

  ngOnDestroy() {
    if (this.getGroupListSubscription) {
      this.getGroupListSubscription.unsubscribe();
    }
    if (this.getStudentSubscription) {
      this.getStudentSubscription.unsubscribe();
    }
  }
}

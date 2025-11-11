/*
 * File : student.component.ts
 * Use: Student list and search functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-student-new',
  templateUrl: './student-new.component.html',
  styleUrls: ['./student-new.component.css']
})
export class StudentNewComponent implements AfterViewInit, OnInit, OnDestroy {
  reasonForm: FormGroup;
  searchForm: FormGroup;
  studentList: any = [];
  searchData: any = [];
  process = false;
  dataSource = new MatTableDataSource<Element>(this.studentList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('resetFormID') resetFormCheck;
  displayedColumns = ['profile', 'firstname', 'lastname', 'email', 'phone', 'achievement', 'studentId', 'actions'];
  advanceSearch = false;
  /* table Pagination */
  pageEvent: PageEvent;
  searchFieldVal = '';

  resInitialTutorial: any;
  checkSubmit = false;
  hideOtherField = false;
  certID = '';
  reasonTypeVal: any;
  reasonErrorMsg = '';
  resDelete: any = [];
  disableYes = true;

  allStudentData: any;
  studentIdControl = new FormControl();
  firstNameControl = new FormControl();
  lastNameControl = new FormControl();
  emailControl = new FormControl();
  phoneControl = new FormControl();
  groupNameControl = new FormControl();
  optionStudentId: any = [];
  filterStudentIdOptions: any = [];
  optionFirstName: any = [];
  filterFirstName: any = [];
  optionLastName: any = [];
  filterLastName: any = [];
  optionEmail: any = [];
  filterEmail: any = [];
  optionPhone: any = [];
  filterPhone: any = [];
  optionGroupName: any = [];
  filterGroupName: any = [];

  studentIdInput: any;
  titleInput: any;
  codeInput: any;
  firstNameInput: any;
  lastNameInput: any;
  emailInput: any;
  groupNameInput: any;
  phoneInput: any;
  getUserSubscribtion: any;
  getStudentSubscribtion: any;
  getAutoSubscribtion: any;
  constructor(
    public formbuilder: FormBuilder,
    private common: CommonService,
    public apiService: ApiService,
    public router: Router,
    private stdService: StudentService,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
    this.searchForm = this.formbuilder.group({
      'first_name': [null],
      'student_id': [null],
      'last_name': [null],
      'phone': [null],
      'email': [null],
      'search': [null],
      'group_name': [null]
    });
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
    this.getUserSubscribtion = this.apiService.getUser();

    this.filterStudentIdOptions = this.studentIdControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._studentIdfilter(data) : this.optionStudentId.slice())
      );

    this.filterFirstName = this.firstNameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._firstnamefilter(data) : this.optionFirstName.slice())
      );

    this.filterLastName = this.lastNameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._lastnamefilter(data) : this.optionLastName.slice())
      );

    this.filterEmail = this.emailControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._emailfilter(data) : this.optionEmail.slice())
      );

    this.filterPhone = this.phoneControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._phonefilter(data) : this.optionPhone.slice())
      );

    this.filterGroupName = this.groupNameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._groupnamefilter(data) : this.optionGroupName.slice())
      );
  }

  private _studentIdfilter(dataValue) {
    return this.optionStudentId.filter(option => option.student_id.toLowerCase().indexOf(dataValue) === 0);
  }

  private _firstnamefilter(dataValue) {
    return this.optionFirstName.filter(option => option.first_name.toLowerCase().indexOf(dataValue) === 0);
  }

  private _lastnamefilter(dataValue) {
    return this.optionLastName.filter(option => option.last_name.toLowerCase().indexOf(dataValue) === 0);
  }

  private _emailfilter(dataValue) {
    return this.optionEmail.filter(option => option.email.toLowerCase().indexOf(dataValue) === 0);
  }

  private _phonefilter(dataValue) {
    return this.optionPhone.filter(option => option.phone.toLowerCase().indexOf(dataValue) === 0);
  }

  private _groupnamefilter(dataValue) {
    return this.optionGroupName.filter(option => option.group_name.toLowerCase().indexOf(dataValue) === 0);
  }

  getinputStudentId(inputVal) {
    this.studentIdInput = inputVal;
  }

  getinputTitle(inputVal) {
    this.titleInput = inputVal;
  }

  getinputCode(inputVal) {
    this.codeInput = inputVal;
  }

  getinputfirstname(inputVal) {
    this.firstNameInput = inputVal;
  }

  getinputlastname(inputVal) {
    this.lastNameInput = inputVal;
  }

  getinputemail(inputVal) {
    this.emailInput = inputVal;
  }

  getinputphone(inputVal) {
    this.phoneInput = inputVal;
  }

  getinputgroup(inputVal) {
    this.groupNameInput = inputVal;
  }

  ngOnInit() {
    this.getStudentList();
    this.getAutoStudentDetails();
  }

  getAutoStudentDetails() {
    this.getAutoSubscribtion = this.stdService.getStudentData().subscribe(data => {
      this.allStudentData = data;
      this.optionStudentId = this.allStudentData.student_id;
      this.optionFirstName = this.allStudentData.first_name;
      this.optionLastName = this.allStudentData.last_name;
      this.optionEmail = this.allStudentData.email;
      this.optionPhone = this.allStudentData.phone;
      this.optionGroupName = this.allStudentData.group_name;
    }, err => {
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.apiService.userType === '2' && this.apiService.is_tutorial === false) {
        this.ngxSmartModalService.getModal('initialTourPopup').open();
      }
      if (this.apiService.userType === '4' && !this.apiService.pages.students) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
    }, 1000);
  }

  onDoneInitialTour() {
    this.apiService.updateInitialTour().subscribe(data => {
      this.resInitialTutorial = data;
      if (this.resInitialTutorial.message === 'Done') {
        this.apiService.all_stud_count.next(false);
        this.apiService.getUser();
        this.ngxSmartModalService.getModal('initialTourPopup').close();
      }
    });
  }

  submitSearchForm(searchData) {
    this.studentList = [];
    this.getStudentList(searchData, false, true);
  }

  resetForm() {
    this.studentIdInput = '';
    this.titleInput = '';
    this.firstNameInput = '';
    this.lastNameInput = '';
    this.emailInput = '';
    this.groupNameInput = '';
    this.phoneInput = '';
    this.paginator.pageIndex = 0;
    this.searchFieldVal = '';
    this.studentList = [];
  }
  /**
   * @description function using for getting the student list
   * @param searchData - search form data
   * @param reset - boolean value (find search or reset)
   * @param search - boolean value (find search or reset)
   * @param page - pagination value
   */
  getStudentList(searchData: any = {}, reset = false, search = false, page = 1) {
    this.process = true;
    const params = new URLSearchParams();
    searchData['student_id'] = this.studentIdInput;
    searchData['title'] = this.titleInput;
    searchData['first_name'] = this.firstNameInput;
    searchData['last_name'] = this.lastNameInput;
    searchData['email'] = this.emailInput;
    searchData['group_name'] = this.groupNameInput;
    searchData['phone'] = this.phoneInput;
    searchData['page'] = page;
    if (searchData !== []) {
      for (const key in searchData) {
        if (searchData[key]) {
          params.set(key, searchData[key]);
        }
      }
    }
    this.getStudentSubscribtion = this.stdService.getStudentList(params.toString()).subscribe(data => {
      this.process = false;
      this.studentList = data;
      this.dataSource = new MatTableDataSource<Element>(this.studentList.results);
      if (search) {
        this.paginator.pageIndex = 0;
      }
    }, err => {
      this.process = false;
    });
  }
  /**
   * @description product actvity data get based on the formdate and page event
   * @param formData - enetered form data
   * @param event - page event
   */
  onPageChange(formData, event) {
    this.pageEvent = event;
    this.getStudentList(formData, false, false, event.pageIndex + 1);
  }


  reasonFormSubmit(formdata) {
    if (!this.reasonForm.invalid) {
      const params = {
        'reason_type': formdata.reason_type,
        'reason': formdata.reason
      };
      this.checkSubmit = true;
      this.stdService.deleteStudent(this.certID, params).subscribe(
        data => {
          this.resDelete = data;
          if (this.resDelete.msg === 'Student deleted successfully') {
            this.common.openSnackBar('deletion_successful', 'Close');
            this.ngxSmartModalService.getModal('myModal').close();
            this.getStudentList(this.searchData, true);
          } else {
            this.checkSubmit = false;
            this.common.openSnackBar('some_error_occurred', 'Close');
          }
        },
        err => {
          this.checkSubmit = false;
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      );
    } else {
      this.reasonErrorMsg = 'error';
    }
  }

  getreasonErrorMsg(field) {
    if (field === 'reason_type' || field === 'reason') {
      return this.reasonForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    }
  }

  getReasonType(type) {
    this.reasonTypeVal = type;
    this.disableYes = false;
    if (type === 5) {
      this.reasonForm.controls['reason'].setValidators(Validators.compose([Validators.required]));
      this.reasonForm.controls['reason'].updateValueAndValidity();
      this.hideOtherField = true;
    } else {
      this.reasonForm.controls['reason'].clearValidators();
      this.reasonForm.controls['reason'].updateValueAndValidity();
      this.hideOtherField = false;
    }
  }

  setCertId(id) {
    this.checkSubmit = false;
    this.certID = id;
    this.formValidationReset();
  }

  formValidationReset() {
    this.hideOtherField = false;
    this.reasonErrorMsg = '';
    this.reasonForm.reset();
    this.resetFormCheck.resetForm();
  }

  ngOnDestroy() {
    if (this.getUserSubscribtion) {
      this.getUserSubscribtion.unsubscribe();
    }
    if (this.getStudentSubscribtion) {
      this.getStudentSubscribtion.unsubscribe();
    }
    if (this.getAutoSubscribtion) {
      this.getAutoSubscribtion.unsubscribe();
    }
  }
}

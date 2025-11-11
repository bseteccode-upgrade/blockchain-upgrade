/*
 * File : student.component.ts
 * Use: Student list and search functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../service/payment.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements AfterViewInit, OnInit {
  reasonForm: FormGroup;
  searchForm: FormGroup;
  searchData: any = '';
  advanceSearch = false;
  resDelete: any = [];
  disableYes = true;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  certID = '';
  checkSubmit = false;
  displayStudNotif: any = false;
  resInitialTutorial: any;
  constructor(
    private formbuilder: FormBuilder,
    private stdService: StudentService,
    private payService: PaymentService,
    private common: CommonService,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService,
    private router: Router,
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
    this.apiService.getUser();
  }

  displayedColumns = ['profile', 'firstname', 'lastname', 'email', 'phone', 'achievement', 'studentId', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('resetFormID') resetFormCheck;
  studentList: any = [];
  dataSource = new MatTableDataSource<any>(this.studentList);
  selection = new SelectionModel<any>(true, []);
  process = false;
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnInit() {
    this.getStudents(this.searchData);
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

  getStudents(searchData?: any, isDelete = false, advanced = false) {
    if (advanced) {
      searchData['search'] = null;
    }
    this.process = true;
    const params = new URLSearchParams();
    this.studentList = [];
    for (const key in searchData) {
      if (searchData[key]) {
        if (key !== 'search' && searchData[key]) {
          searchData['search'] = null;
        }
        params.set(key, searchData[key]);
      }
    }
    this.stdService.getStudentList(params.toString()).subscribe(
      data => {
        this.process = false;
        this.studentList = data;
        this.dataSource = new MatTableDataSource<any>(this.studentList);
        this.dataSource.paginator = this.paginator;
        if (isDelete) {
          this.paginator.pageIndex = this.dataSource.paginator.pageIndex !== 0 ? this.dataSource.paginator.pageIndex - 1 : 0;
          this.paginator._changePageSize(this.paginator.pageSize);
        } else {
          this.dataSource.paginator.firstPage();
        }
      },
      err => {
        this.process = false;
      }
    );
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
            this.getStudents(this.searchData, true);
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
}

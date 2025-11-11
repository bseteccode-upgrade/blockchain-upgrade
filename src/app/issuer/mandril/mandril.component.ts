/*
 * File : mandril.component.ts
 * Use: mail sent data display and search option
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-mandril',
  templateUrl: './mandril.component.html',
  styleUrls: ['./mandril.component.css']
})
export class MandrilComponent implements OnInit, OnDestroy {
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
  resMandrilData: any = { 'to': { 'email': '' } };
  loaderMailcontent = false;
  getStudentsSubscribtion: any;
  constructor(
    private formbuilder: FormBuilder,
    private stdService: StudentService,
    private common: CommonService,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
    this.searchForm = this.formbuilder.group({
      'subject': [null],
      'email': [null],
      'state': [null]
    });
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
  }

  displayedColumns = ['email', 'sender', 'subject', 'state', 'actions'];
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
    // this.apiService.matrixData();
  }

  getStudents(searchData?: any, isDelete = false, reset = false) {
    this.process = true;
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (key !== 'search' && searchData[key]) {
        searchData['search'] = null;
      }
      if (searchData[key]) {
        params.set(key, searchData[key]);
      }
    }
    if (reset) {
      this.studentList = [];
      this.paginator.pageIndex = 0;
    }
    this.getStudentsSubscribtion = this.stdService.getMandrilData(params.toString()).toPromise().then(
      data => {
        this.process = false;
        this.studentList = data;
        this.dataSource = new MatTableDataSource<any>(this.studentList);
        this.dataSource.paginator = this.paginator;
        if (isDelete) {
          this.paginator.pageIndex = this.dataSource.paginator.pageIndex !== 0 ? this.dataSource.paginator.pageIndex - 1 : 0;
          this.paginator._changePageSize(this.paginator.pageSize);
        }
      },
      err => {
        this.process = false;
      }
    );
  }

  reasonFormSubmit(id) {
    if (id !== '') {
      this.checkSubmit = true;
      this.stdService.resendMandril(id).subscribe(
        data => {
          this.resDelete = data;
          if (this.resDelete[0].status === 'queued' || this.resDelete[0].status === 'sent') {
            this.common.openSnackBar('resend_successful', 'Close');
            this.ngxSmartModalService.getModal('myModal').close();
          } else if (this.resDelete[0].status === 'rejected') {
            this.common.openSnackBar('rejected_error_msg', 'Close');
            this.ngxSmartModalService.getModal('myModal').close();
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
    this.loaderMailcontent = true;
    this.stdService.getMandrailDetails(id).subscribe(
      data => {
        this.resMandrilData = data;
        this.loaderMailcontent = false;
      }, err => {
        // console.log(err);
      });
    this.checkSubmit = false;
    this.certID = id;
    // this.formValidationReset();
  }

  formValidationReset() {
    this.hideOtherField = false;
    this.reasonErrorMsg = '';
    this.reasonForm.reset();
    this.resetFormCheck.resetForm();
  }

  ngOnDestroy() {
    if (this.getStudentsSubscribtion) {
      this.getStudentsSubscribtion.unsubscribe();
    }
  }
}

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import * as moment from 'moment';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { CertificateService } from '../services/certificate.service';

@Component({
  selector: 'app-email-logs',
  templateUrl: './email-logs.component.html',
  styleUrls: ['./email-logs.component.css']
})
export class EmailLogsComponent implements OnInit, OnDestroy {
  reasonForm: FormGroup;
  searchForm: FormGroup;
  searchData: any = [];
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
  minendDate: any;

  displayedColumns = ['date', 'student_name', 'publisher_name', 'subject', 'state', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('resetFormID') resetFormCheck;
  studentList: any = [];
  dataSource = new MatTableDataSource<any>(this.studentList);
  selection = new SelectionModel<any>(true, []);
  process = false;

  allEmailLogsData: any;
  studentnameControl = new FormControl();
  publishernameControl = new FormControl();
  subjectControl = new FormControl();
  optionstudentname: any = [];
  filterstudentname: any = [];
  optionpublishername: any = [];
  filterpublishername: any = [];
  optionsubject: any = [];
  filtersubject: any = [];

  studentnameInput: any;
  publishernameInput: any;
  subjectInput: any;

  getStudentsSubscribtion: any;
  getAllEmaillogsSubscribtion: any;
  constructor(
    private formbuilder: FormBuilder,
    private stdService: StudentService,
    private common: CommonService,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService,
    public certiService: CertificateService
  ) {
    this.searchForm = this.formbuilder.group({
      'from_date': [null],
      'to_date': [null],
      'student_name': [null],
      'publisher_name': [null],
      'subject': [null],
      'state': [null]
    });
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });

    this.filterstudentname = this.studentnameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._studentnamefilter(data) : this.optionstudentname.slice())
      );

    this.filterpublishername = this.publishernameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._publishernamefilter(data) : this.optionpublishername.slice())
      );

    this.filtersubject = this.subjectControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._subjectfilter(data) : this.optionsubject.slice())
      );
  }

  private _studentnamefilter(dataValue) {
    return this.optionstudentname.filter(option => option.student_name.toLowerCase().indexOf(dataValue) === 0);
  }

  private _publishernamefilter(dataValue) {
    return this.optionpublishername.filter(option => option.publisher_name.toLowerCase().indexOf(dataValue) === 0);
  }

  private _subjectfilter(dataValue) {
    return this.optionsubject.filter(option => option.subject.toLowerCase().indexOf(dataValue) === 0);
  }

  getinputstudentname(inputVal) {
    this.studentnameInput = inputVal;
  }

  getinputpublishername(inputVal) {
    this.publishernameInput = inputVal;
  }

  getinputsubject(inputVal) {
    this.subjectInput = inputVal;
  }

  resetForm() {
    this.studentnameInput = '';
    this.publishernameInput = '';
    this.subjectInput = '';
  }

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
    this.getAllEmaillogs();
    this.getStudents(this.searchData);
    // this.apiService.matrixData();
  }

  getAllEmaillogs() {
    this.getAllEmaillogsSubscribtion = this.certiService.getEmailLogsAll().subscribe(
      data => {
        this.allEmailLogsData = data;
        this.optionstudentname = this.allEmailLogsData.student_name;
        this.optionpublishername = this.allEmailLogsData.publisher_name;
        this.optionsubject = this.allEmailLogsData.subject;
      });
  }

  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
    if (field === 'from_date') {
      this.minendDate = moment(moment(e.value, 'L', true).format('YYYY-MM-DD')).add(1, 'day').format('YYYY-MM-DD');
      this.refreshToDate();
    }
  }

  refreshFromDate() {
    this.searchForm.controls['from_date'].setValue(null);
    this.searchForm.markAsTouched();
    this.minendDate = '';
    return false;
  }

  refreshToDate() {
    this.searchForm.controls['to_date'].setValue(null);
    this.searchForm.markAsTouched();
    return false;
  }

  getStudents(searchData?: any, isDelete = false, reset = false) {
    this.process = true;
    const params = new URLSearchParams();
    searchData['student_name'] = this.studentnameInput;
    searchData['publisher_name'] = this.publishernameInput;
    searchData['subject'] = this.subjectInput;
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
      this.searchForm.controls['from_date'].setValue(null);
      this.searchForm.controls['to_date'].setValue(null);
      this.minendDate = '';
      this.searchForm.markAsTouched();
    }
    this.getStudentsSubscribtion = this.stdService.getMailLogData(params.toString()).toPromise().then(
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

  setCertId(id) {
    this.loaderMailcontent = true;
    this.stdService.getMailLogDetail(id).subscribe(
      data => {
        this.resMandrilData = data;
        this.loaderMailcontent = false;
      }, err => {
        // console.log(err);
      });
    this.checkSubmit = false;
    this.certID = id;
  }

  ngOnDestroy() {
    // if (this.getStudentsSubscribtion) {
    //   this.getStudentsSubscribtion.unsubscribe();
    // }
    if (this.getAllEmaillogsSubscribtion) {
      this.getAllEmaillogsSubscribtion.unsubscribe();
    }
  }
}

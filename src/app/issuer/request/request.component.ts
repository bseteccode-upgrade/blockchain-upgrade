import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import {Observable} from 'rxjs';
import {merge} from 'rxjs';
import {of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { TooltipPosition } from '@angular/material';

import { ApiService } from '../../service/api.service';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
import { StudentService } from '../services/student.service';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy {

    searchForm: FormGroup;
    certIssueForm: FormGroup;
    searchTxt = '';
    displayedColumns = ['avatar', 'name', 'email', 'created', 'actions'];
    roles = ['', 'Student', 'Publisher', '', 'Team Member'];
    reasonTypeArr = ['', 'misspelling', 'issued_by_mistake', 'sanction', 'test', 'other'];
    exampleDatabase: ExampleHttpDao | null;
    dataSource = new MatTableDataSource();

    resultsLength = 0;
    isLoadingResults = true;
    getreasonTypeVal: any;
    otherFieldDisplay = false;
    reasonTypeSelect: any;
    otherReasonVal: any;
    studentId = '';
    requestID = '';
    responseData: any = [];
    errorMsg: string;
    errorMsgArr = [];

    expireAction = [
      {'id': '1', 'text': 'no_actions'},
      {'id': '2', 'text': 'invalidate_cert'},
      {'id': '3', 'text': 'delete_cert'},
      {'id': '4', 'text': 'notify'}
    ];
    minendDate: any;
    certificatelists: any = [];


    positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
    position = new FormControl(this.positionOptions[0]);
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('searchVal') searchVal: ElementRef;
    @ViewChild('reasonOther') reasonOther: ElementRef;
    getCertSubscribtion: any;

    constructor(
      private http: HttpClient,
      public formbuilder: FormBuilder,
      private router: Router,
      public ngxSmartModalService: NgxSmartModalService,
      public apiService: ApiService,
      private certificateService: CertificateService,
      private common: CommonService,
      ) {
        this.searchForm = this.formbuilder.group({
          'search': [''],
          'reason_type': [''],
          'reason': ['']
        });
        this.certIssueForm = this.formbuilder.group({
          'certificate': [null, Validators.compose([Validators.required])],
          'students': [null],
          'post_blockchain': false,
          'testimonial': [null],
          'issue_date': [null, Validators.compose([Validators.required])],
          'end_validity': [null],
          'start_date': [null],
          'end_date': [null],
          'certificate_number': [null],
          'issuer': [null],
          'expiry_actions': [null],
          'expiry_text': [null],
          'status': false,
          'social_media_sharing' : true,
          'evidence': this.formbuilder.array([
            this.initNqCoordinators() // we'll use the same function for adding new
          ]),
          'testcheck': false
        });
      }

    initNqCoordinators() {
        return this.formbuilder.group({
          'evid': ['', Validators.compose([Validators.pattern('https?://.+')])],
          'lable': ['']
        });
      }

      addEvidence() {
        const control = <FormArray>this.certIssueForm.controls['evidence'];
        control.push(this.initNqCoordinators());
      }
    
      removeEvidence(index) {
        if (index !== 0) {
          const control = <FormArray>this.certIssueForm.controls['evidence'];
          control.removeAt(index);
        } else {
          const control = <FormArray>this.certIssueForm.controls['evidence'];
          control.reset();
          const controllabel = <FormArray>this.certIssueForm.controls['evidence_lable'];
          controllabel.reset();
        }
      }

      onStartDateChange(date) {
        this.minendDate = moment(date).add(1, 'day').format('YYYY-MM-DD');
      }

      changeDateEvent(e) {
        this.certIssueForm.controls['issue_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
      }
    
      changeendDateEvent(e) {
        this.certIssueForm.controls['end_validity'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
      }
    
      changeStartDateEvent(e) {
        this.certIssueForm.controls['start_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
      }
    
      changeEndDateEvent(e) {
        this.certIssueForm.controls['end_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
      }

      refreshIssueDate(field) {
        if (field === 1) {
          this.certIssueForm.controls['issue_date'].setValue(null);
        } else if (field === 2) {
          this.certIssueForm.controls['end_validity'].setValue(null);
        } else if (field === 3) {
          this.certIssueForm.controls['start_date'].setValue(null);
        } else if (field === 4) {
          this.certIssueForm.controls['end_date'].setValue(null);
        }
        this.certIssueForm.markAsTouched();
      }
  
    ngOnInit() {
      localStorage.setItem('requestredirect', 'no');
      this.callDatasource();
      this.getCertificates();
    }

    certIssueFormSubmit(addData) {
      this.errorMsg = '';
      this.errorMsgArr = [];
      if (this.certIssueForm.valid) {
        const evidString = addData.evidence.map(o => o.evid).toString();
        const labelString = addData.evidence.map(o => o.lable).toString();
        addData['evidence'] = evidString;
        addData['evidence_lable'] = labelString;
        addData['post_blockchain'] = true;
        addData['course'] = null;
        addData['studentid'] = this.studentId;
        addData['issuer'] = this.apiService.user.id;
        addData['social_media_sharing'] = addData['social_media_sharing'] === true ? true : false;
        this.certificateService.addIssueDetails([addData]).subscribe(
          res => {
              this.responseData = res;
              this.common.openSnackBar(res['msg'], 'Close');
              this.apiService.getWallet();
              this.ngxSmartModalService.getModal('myModal').close();
              this.router.navigate(['issuecertificate']);
              this.certificateService.requestIssuerUpdate({'request_id' : this.requestID}).subscribe(
                resdata => {
                });
          },
          err => {
            if (err.error && err.error.detail) {
              this.errorMsg = err.error.detail;
            } else if (err.status === 400) {
              const errArr = [];
              for (const key in err.error) {
                if (err.error.hasOwnProperty(key)) {
                  errArr.push(err.error[key]);
                  this.errorMsgArr[key] = err.error[key][0];
                }
              }
              this.errorMsg = 'provide_valid_inputs';
            } else {
              this.errorMsg = 'some_error_occurred';
            }
          }
        );
      } else {
        this.geterrorMsg();
        this.errorMsg = 'provide_valid_inputs';
      }
    }

    geterrorMsg() {
      return this.certIssueForm.controls['issue_date'].hasError('required') ? 'enter_a_value' : '';
    }

    getCertificates(searchData?: any) {
      const params = new URLSearchParams();
      this.getCertSubscribtion = this.certificateService.getIssuersCertificatesLot(params.toString()).subscribe(
        data => {
          this.certificatelists = data;
        },
        err => {
          this.certificatelists = [];
        }
      );
    }

    callDatasource(search = '', reasonTyp = '', reason = '', searchCall = false) {
      this.exampleDatabase = new ExampleHttpDao(this.http);
      if (searchCall === true) {
        this.paginator.pageIndex = 0;
        merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.exampleDatabase.getRepoIssues(this.paginator.pageIndex, search, reasonTyp, reason);
          }),
          map(data => {
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.resultsLength = data.count;
            return data.results;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return observableOf([]);
          })
        ).subscribe(data => this.dataSource.data = data);
      } else {
        merge(this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.exampleDatabase.getRepoIssues(this.paginator.pageIndex, this.searchTxt, this.reasonTypeSelect, this.otherReasonVal);
          }),
          map(data => {
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.resultsLength = data.count;
            return data.results;
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return observableOf([]);
          })
        ).subscribe(data => this.dataSource.data = data);
      }
    }

    searchFormSubmit(formData) {
      this.searchTxt = formData.search ? formData.search : '';
      this.reasonTypeSelect = formData.reason_type ? formData.reason_type : '';
      this.otherReasonVal = formData.reason ? formData.reason : '';
      this.callDatasource(
        this.searchTxt,
        this.reasonTypeSelect,
        this.otherReasonVal, true);
    }

    searchFormReset() {
      this.paginator.pageIndex = 0;
      this.getreasonTypeVal = '';
      this.otherFieldDisplay = false;

      this.searchTxt = '';
      this.reasonTypeSelect = '';
      this.otherReasonVal = '';
      this.callDatasource();
    }

    getReasonType(reasonType) {
      this.getreasonTypeVal = reasonType;
      if (this.getreasonTypeVal === 5) {
        this.otherFieldDisplay = true;
      } else {
        this.otherFieldDisplay = false;
      }
    }

    redirectToExsit(email) {
      localStorage.setItem('exsitmailaddress', email);
      localStorage.setItem('requestredirect', 'yes');
      this.router.navigate(['existingstudent']);
    }

    issueCertUser(studId, requestId) {
      this.studentId = studId;
      this.requestID = requestId;
    }

    ngOnDestroy() {
      if (this.getCertSubscribtion) {
        this.getCertSubscribtion.unsubscribe();
      }
    }
  }
  export interface LogApi {
    results: LogIssue[];
    count: number;
  }

  export interface LogIssue {
    first_name: string;
    last_name: string;
    avatar: string;
    created: string;
    email: string;
    has_info: boolean;
    certificate_id: string;
    certificate_name: string;
    certificate_pic: string;
    id: string;
  }
  /** An example database that the data source uses to retrieve data for the table. */
  export class ExampleHttpDao {
    constructor(private http: HttpClient) {}
    getRepoIssues(page: number, search = '', reasonType = '', reason = ''): Observable<LogApi> {
      const httpOption = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
        })
      };
      const pageno = page + 1;
      const href = env.baseUrl;
      const requestUrl =
          `${href}api/users/request/list/?page=${pageno}`;
      return this.http.get<LogApi>(requestUrl, httpOption);
    }
  }
/*
 * File : logs.component.ts
 * Use: error log page, data fetch and search option
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { merge } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { CertificateService } from '../services/certificate.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  searchTxt = '';
  displayedColumns = ['name', 'item_short_detail', 'module', 'role', 'reason', 'deleted_at'];
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

  allLogsData: any;
  searchControl = new FormControl();
  reasonControl = new FormControl();
  optionSearch: any = [];
  filterSearch: any = [];
  optionReason: any = [];
  filterReason: any = [];

  searchInput: any;
  reasonInput: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchVal') searchVal: ElementRef;
  @ViewChild('reasonOther') reasonOther: ElementRef;
  getAllAchieveSubscribtion: any;

  constructor(
    private http: HttpClient,
    public formbuilder: FormBuilder,
    private certiService: CertificateService,
  ) {
    this.searchForm = this.formbuilder.group({
      'search': [''],
      'reason_type': [''],
      'reason': ['']
    });

    this.filterSearch = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._searchfilter(data) : this.optionSearch.slice())
      );
      this.filterReason = this.reasonControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._reasonfilter(data) : this.optionReason.slice())
      );
  }

  private _searchfilter(dataValue) {
    return this.optionSearch.filter(option => option.search.toLowerCase().indexOf(dataValue) === 0);
  }

  private _reasonfilter(dataValue) {
    return this.optionReason.filter(option => option.reason.toLowerCase().indexOf(dataValue) === 0);
  }

  getinputsearch(inputVal) {
    this.searchInput = inputVal;
  }

  getinputreason(inputVal) {
    this.reasonInput = inputVal;
  }

  ngOnInit() {
    this.getAllAchieve();
    this.callDatasource();
  }

  getAllAchieve() {
    this.getAllAchieveSubscribtion = this.certiService.getLogsAll().subscribe(
      data => {
        this.allLogsData = data;
        this.optionSearch = this.allLogsData.search;
        this.optionReason = this.allLogsData.reason;
      });
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
    this.searchTxt = this.searchInput;
    this.reasonTypeSelect = formData.reason_type ? formData.reason_type : '';
    this.otherReasonVal = this.reasonInput;
    this.callDatasource(
      this.searchTxt,
      this.reasonTypeSelect,
      this.otherReasonVal, true);
  }

  searchFormReset() {
    this.searchInput = '';
    this.reasonInput = '';
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

  ngOnDestroy() {
    if (this.getAllAchieveSubscribtion) {
      this.getAllAchieveSubscribtion.unsubscribe();
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
  module: string;
  deleted_at: string;
  register_type: string;
  role: string;
  reason_type: string;
  reason: string;
  item_short_detail: string;
}
/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDao {
  constructor(private http: HttpClient) { }
  getRepoIssues(page: number, search = '', reasonType = '', reason = ''): Observable<LogApi> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const pageno = page + 1;
    const href = env.baseUrl;
    const requestUrl =
      `${href}/api/certificates/deleted-logs-list/?page=${pageno}&search=${search}&reason_type=${reasonType}&reason=${reason}`;
    return this.http.get<LogApi>(requestUrl, httpOption);
  }
}
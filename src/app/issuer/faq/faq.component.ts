/*
 * File : faq.component.ts
 * Use: faq page => faq content data fetch and search option
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CertificateService } from '../services/certificate.service';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { merge } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  searchForm: FormGroup;
  panelOpenState = false;
  faqDataList: any;
  searchTxt = '';
  resResult: any;

  displayedColumns = ['sample'];
  exampleDatabase: GetFaqDatas | null;
  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;
  getreasonTypeVal: any;
  otherFieldDisplay = false;
  reasonTypeSelect: any;
  otherReasonVal: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchVal') searchVal: ElementRef;

  constructor(
    private certAPI: CertificateService,
    private http: HttpClient,
    public formbuilder: FormBuilder,
    public domSanitizer: DomSanitizer,
  ) {
    this.searchForm = this.formbuilder.group({
      'search': ['']
    });
  }

  ngOnInit() {
    this.callDatasource();
  }

  callDatasource(search = '', searchCall = false) {
    this.exampleDatabase = new GetFaqDatas(this.http);
    if (searchCall === true) {
      this.paginator.pageIndex = 0;
      merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.exampleDatabase.getRepoIssues(this.paginator.pageIndex, search);
          }),
          map(data => {
            this.resResult = data;
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.resultsLength = this.resResult.count;
            return this.resResult.results;
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
            return this.exampleDatabase.getRepoIssues(this.paginator.pageIndex, this.searchTxt);
          }),
          map(data => {
            this.resResult = data;
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.resultsLength = this.resResult.count;
            return this.resResult.results;
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
    this.callDatasource(this.searchTxt, true);
  }

  searchFormReset() {
    this.paginator.pageIndex = 0;
    this.getreasonTypeVal = '';
    this.otherFieldDisplay = false;

    this.searchTxt = '';
    this.callDatasource();
  }
}

export class GetFaqDatas {
  constructor(private http: HttpClient) { }
  getRepoIssues(page: number, search = '') {
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
      `${href}/api/users/faq/list/?page=${pageno}&search=${search}`;
    return this.http.get(requestUrl, httpOption);
  }
}

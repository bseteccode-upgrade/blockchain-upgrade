/*
 * File : studentsearch-list.component.ts
 * Use: Separate page student data list based on search
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { merge } from 'rxjs';
import { of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { ApiService } from '../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-studentsearch-list',
  templateUrl: './studentsearch-list.component.html',
  styleUrls: ['./studentsearch-list.component.css']
})
export class StudentsearchListComponent implements OnInit {

  displayedColumns = ['avatar', 'name', 'actions'];
  gender: any = {
    'M': 'Male',
    'F': 'Female'
  };
  exampleDatabase: ExampleHttpDao | null;
  dataSource = new MatTableDataSource();
  pui = '';
  resultsLength = 0;
  isLoadingResults = true;
  getreasonTypeVal: any;
  otherFieldDisplay = false;
  reasonTypeSelect: any;
  otherReasonVal: any;
  routerWithID = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchVal') searchVal: ElementRef;

  constructor(
    private http: HttpClient,
    public formbuilder: FormBuilder,
    public apiService: ApiService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('selectedLanguage') != null) {
      this.apiService.setSeparateLanguage(JSON.parse(localStorage.getItem('selectedLanguage')));
    }
    this.pui = localStorage.getItem('pui') ? localStorage.getItem('pui') : '';
    if (this.pui !== '') {
      this.routerWithID = '?embed=' + this.pui;
    } else {
      this.routerWithID = '';
    }
    // if (localStorage.getItem('studname') !== '' && localStorage.getItem('studname') !== null) {
      this.callDatasource(localStorage.getItem('studname'));
      // localStorage.removeItem('studname');
    // } else {
    //   if (this.routerWithID !== '') {
    //     this.router.navigate(['embed/studentsearch'], { queryParams: { embed: this.pui } });
    //   } else {
    //     this.router.navigate(['embed/studentsearch']);
    //   }
    // }
  }

  redirectToStudSearch() {
    localStorage.removeItem('studname');
    localStorage.removeItem('pui');
    if (this.routerWithID !== '') {
      this.router.navigate(['embed/studentsearch'], { queryParams: { embed: this.pui } });
    } else {
      this.router.navigate(['embed/studentsearch']);
    }
  }

  callDatasource(search = '', searchCall = true) {
    this.exampleDatabase = new ExampleHttpDao(this.http);
    if (searchCall === true) {
      this.paginator.pageIndex = 0;
      merge(this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this.exampleDatabase.getRepoIssues(this.paginator.pageIndex, search, this.pui);
          }),
          map(data => {
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
            return this.exampleDatabase.getRepoIssues(this.paginator.pageIndex, search, this.pui);
          }),
          map(data => {
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

  redirectToAchSearch(studID) {
    localStorage.setItem('achstudid', studID);
    this.router.navigate(['embed/achievementsearch']);
  }
}
export interface LogApi {
  results: LogIssue[];
  count: number;
}

export interface LogIssue {
  student_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  dob: string;
  email: string;
  gender: string;
  phone: string;
}

export class ExampleHttpDao {
  constructor(private http: HttpClient) { }
  getRepoIssues(page: number, search = '', pui = ''): Observable<LogApi> {
    const pageno = page + 1;
    const href = env.baseUrl;
    let requestUrl;
    if (pui == '') {
      requestUrl =
      `${href}/api/users/public-student-list/?${search}&page=${pageno}`;
    } else {
      requestUrl =
      `${href}/api/users/public-student-list/?${search}&page=${pageno}&pui=${pui}`;
    }
    return this.http.get<LogApi>(requestUrl);
  }
}

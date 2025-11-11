import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesComponent implements OnInit, DoCheck {
  profileExist = false;
  displayedColumns = ['Text', 'Translation'];
  langList: any = [];
  langObj: any = {};
  progress = false;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Element>(this.langList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngDoCheck() {
    if (!this.profileExist) {
      if (this.apiService.user && this.apiService.user.profile_id) {
        this.profileExist = true;
        this.getLangList();
      }
    }
  }

  getLangList() {
    this.progress = true;
    this.http.get(env.url + `languages/create/${this.apiService.user.translator_code}/`).subscribe(res => {
      this.langObj = res;
      this.http.get(env.url + 'languages/english/key/').subscribe(data => {
        this.progress = false;
        const obj = data;
        this.langList = Object.keys(obj).map(key => ({key: key, value: obj[key], otherLang: this.langObj[key]}));
        this.dataSource = new MatTableDataSource<any>(this.langList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  submit() {
    this.http.put(env.url + `languages/create/${this.apiService.user.translator_code}/`, this.langObj).subscribe(res => {
      this.getLangList();
    });
  }

}

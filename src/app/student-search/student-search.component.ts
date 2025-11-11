/*
 * File : student-search.component.ts
 * Use: Student search in separate URL, student list and filter option
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-student-search',
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.css']
})
export class StudentSearchComponent implements OnInit {

  searchForm: FormGroup;
  resSearch: any = [];
  errorMsg = '';
  norecordFound = false;
  pui = '';
  languages: any = [];
  selectedLang = 'EN';
  loading = false;
  constructor(
    private http: HttpClient,
    public formbuilder: FormBuilder,
    public apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.formbuilder.group({
      'first_name': [null],
      'last_name': [null],
      'student_id': [null],
      'email': [null],
      'phone': [null],
      'group': [null],
      'certificate_name': [null],
      'from_date': [null],
      'to_date': [null],
      'training_center': [null]
    });
  }

  ngOnInit() {
    this.getLanguages();
    this.pui = this.route.snapshot.queryParams['embed'] ? this.route.snapshot.queryParams['embed'] : '';
  }

  getLanguages() {
    this.apiService.getLanguage().subscribe(data => {
      this.languages = data;
      console.log(this.languages);
      if (localStorage.getItem('selectedLanguage') != null) {
        const langVal: any = JSON.parse(localStorage.getItem('selectedLanguage'));
        this.selectedLang = langVal.language_code;
        this.apiService.setSeparateLanguage(langVal);
      }
    });
  }

  selectLang(lang) {
    this.selectedLang = lang.language_code;
    localStorage.setItem('selectedLanguage', JSON.stringify(lang));
    this.apiService.setSeparateLanguage(lang);
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  searchFormSubmit(searchData) {
    this.errorMsg = '';
    this.norecordFound = false;
    this.loading = true;
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key]) {
        params.set(key, searchData[key]);
      }
    }
    if (this.pui && this.pui != '') {
      this.apiService.findUserDatas(params.toString(), this.pui).subscribe(resData => {
        this.resSearch = resData;
        this.loading = false;
        if (this.resSearch.count > 0) {
          localStorage.setItem('studname', params.toString());
          localStorage.setItem('pui', this.pui);
          this.router.navigate(['embed/studentlist']);
        } else {
          this.norecordFound = true;
        }
      });
    } else {
      this.apiService.findUserDataswithoutpui(params.toString()).subscribe(resData => {
        this.resSearch = resData;
        this.loading = false;
        if (this.resSearch.count > 0) {
          localStorage.setItem('studname', params.toString());
          localStorage.setItem('pui', this.pui);
          this.router.navigate(['embed/studentlist']);
        } else {
          this.norecordFound = true;
        }
      });
    }
  }

  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  refreshFromDate() {
    this.searchForm.controls['from_date'].setValue(null);
    this.searchForm.markAsTouched();
    return false;
  }

  refreshToDate() {
    this.searchForm.controls['to_date'].setValue(null);
    this.searchForm.markAsTouched();
    return false;
  }

  getErrorMessage(field) {
    return this.searchForm.controls[field].hasError('required')
      || this.searchForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }
}

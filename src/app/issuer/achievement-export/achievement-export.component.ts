/*
 * File : achievement-export.component.ts
 * Use: Export the achievement details as excel file from achievement datas
 * Copyright : vottun 2019
 */
import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CertificateService } from '../services/certificate.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/platform-browser';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-achievement-export',
  templateUrl: './achievement-export.component.html',
  styleUrls: ['./achievement-export.component.css']
})

export class AchievementExportComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'first_name',
    'last_name',
    'email',
    'certificate_code',
    'issue_date',
    'end_validity'
  ];
  public achievement_type_options = ['', 'Blockchain Certificate', 'Blockchain Course', 'Digital Course'];
  public moment = moment;
  baseUrl = env.baseUrl;
  panelOpenState = false;
  certificateList: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<Element>(this.certificateList);
  certiSelected = false;
  public selectedCertificate: any = {};
  public selectedStudents: any = {};
  searchForm: FormGroup;
  student_id: string;
  process: boolean;
  modelOpen = false;
  searchData: any = '';
  myTemplate: any = '';
  evidence: any = '';
  advanceSearch = false;
  testimonial: any;
  purchasedVal = 0;
  walletData: any;
  allowSearch: boolean;
  profile: any = {};
  awaitingArr: any = [];
  repeatedRow;
  resDelete: any;
  disableYes = true;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  certID: any;
  @ViewChild('resetFormID') resetFormCheck;
  privilegeSearch: any = {
    allow_search : false
  };
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  menuAccessSubscription: any;
  getIssuedCertificateSubscription: any;
  constructor(
    private certiService: CertificateService,
    public formbuilder: FormBuilder,
    public apiService: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    private http: HttpClient,
    public domSanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: HTMLDocument
  ) {
    this.route.params.subscribe(val => this.functionCallInitial());
    this.searchForm = this.formbuilder.group({
      'first_name': [null],
      'last_name': [null],
      'code': [null],
      'certificate_number': [null],
      'from_date': [null],
      'to_date': [null],
      'student_id': [null],
      'graduation_class': [null],
      'block_chain': [null],
      'email': [null],
      'title': [null],
      'search': [null],
      'group_name': [null],
      'achievement_type': [null],
      'show_deleted': false
    });
  }

  functionCallInitial() {
    this.menuAccessSubscription = this.apiService.menuPageaccess().subscribe(menuPermission => {
      this.privilegeSearch = menuPermission;
      if (this.userDetails) {
        if (this.privilegeSearch.allow_search === 'undefined')
          this.allowSearch = true;
        else
          this.allowSearch = this.privilegeSearch.allow_search;
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      if (typeof this.apiService.user) {
        if (typeof this.apiService.user.pages.allow_search === 'undefined')
          this.allowSearch = true;
        else
          this.allowSearch = this.apiService.user.pages.allow_search;
      }
    }, 500);

    this.route.params.subscribe(
      (params: Params) => {
        if (params['email']) {
          this.searchForm.controls['email'].setValue(params['email']);
          this.searchForm.controls['first_name'].setValue(params['firstname']);
          this.searchForm.controls['last_name'].setValue(params['lastname']);
          this.getIssuersCertificateListsExport(this.searchForm.value);
          this.searchForm.controls['search'].setValue(params['firstname'] + ' ' + params['lastname']);
        } else {
          this.getIssuersCertificateListsExport();
        }
        if (params['name']) {
          this.searchData = decodeURI(params['name']);
        }
      }
    );
  }

  /**
   * @function downloadCSV
   * @description download the csv file format using achievement data's
   */
  downloadCSV() {
    if (this.certificateList !== []) {
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Achievements-Export',
        useBom: true,
        filename: 'achievements-export_' + Date.now(),
        useKeysAsHeaders: true
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(this.certificateList);
    }
  }

  /**
   * @function changeDateEvent
   * @description change date format in the excel sheet export
   */
  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  /**
   * @function getIssuersCertificateListsExport
   * @description get certificate list based search data's
   * @param searchData search form data
   */
  getIssuersCertificateListsExport(searchData?: any, reset = false) {
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key]) {
        if (key !== 'search' && searchData[key]) {
          searchData['search'] = null;
        }
        params.set(key, searchData[key]);
      }
      if (searchData['block_chain'] === false) {
        params.set('block_chain', 'false');
      }
    }
    if (reset) {
      this.paginator.pageIndex = 0;
    }
    this.process = true;
    this.getIssuedCertificateSubscription = this.certiService.getIssuersCertificateListsExport(params.toString()).subscribe(
      data => {
        this.process = false;
        this.certificateList = data;
        this.dataSource = new MatTableDataSource<Element>(this.certificateList);
        this.dataSource.paginator = this.paginator;
      },
      err => {
        this.process = false;
      }
    );
  }

  /**
   * @description form date field refresh option
   */
  refreshFromDate() {
    this.searchForm.controls['from_date'].setValue(null);
    return false;
  }

  refreshToDate() {
    this.searchForm.controls['to_date'].setValue(null);
    return false;
  }

  ngOnDestroy() {
    if (this.menuAccessSubscription) {
      this.menuAccessSubscription.unsubscribe();
    }
    if (this.getIssuedCertificateSubscription) {
      this.getIssuedCertificateSubscription.unsubscribe();
    }
  }
}

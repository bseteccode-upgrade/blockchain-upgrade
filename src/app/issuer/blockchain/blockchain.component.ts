/*
 * File : blockchain.component.ts
 * Use: achievement data list and search based display to the publisher
 * Copyright : vottun 2019
 */
import { Component, OnInit, Inject, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { CertificateService } from '../services/certificate.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/platform-browser';
import { CertDetailviewComponent } from '../../edu-modal/cert-detailview/cert-detailview.component';
import { BadgeViewComponent } from '../../edu-modal/badge-view/badge-view.component';

import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';
import { SocketserviceService } from '../services/socketservice.service';
declare var jQuery;
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css'],
  providers: [SocketserviceService]
})
export class BlockchainComponent implements OnInit, OnDestroy {
  appName = env.project_name;
  siteName = env.project_site;
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;
  slimScrollState = new SlimScrollState();
  public moment = moment;
  baseUrl = env.baseUrl;
  panelOpenState = false;
  certificateList: any = [];
  certiSelected = false;
  public selectedCertificate: any = {};
  public selectedStudents: any = {};
  searchForm: FormGroup;
  student_id: string;
  process: boolean;
  modelOpen = false;
  searchData: any;
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
  reasonForm: FormGroup;
  achMultiSelectForm: FormGroup;
  resDelete: any;
  disableYes = true;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  certID: any;
  expiredResImg: any;
  @ViewChild('resetFormID') resetFormCheck;
  checkSubmit = false;
  displayStudent: any = [];
  gender: any = {
    'M': 'Male',
    'F': 'Female'
  };
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  certificateListRes: any = [];
  issueCertList: any = [];
  /* Scroll Pagination */
  issue_scrollUpDistance = 0;
  issue_throttle = 300;
  issue_no_page: number;
  issue_scrollDistance = 1;
  issue_inc_page = 1;
  issue_default_page = 1;
  // formSearchData: any = [];
  resentButtonDisplay = false;
  comeFromSearch = false;
  paramsString = '';
  processResend = false;
  privilegeSearch: any = {
    allow_search: false,
    issue_certificate: false
  };
  testMode: any = this.userDetails.profile_details.test_mode;
  allselect: any = true;
  checkall: boolean;

  coursesArray: any = [];
  selectedStudent: any = [];
  changeStudentArr: any;
  totalAchCount: any;

  allCertData: any;
  titleControl = new FormControl();
  codeControl = new FormControl();
  studentIdControl = new FormControl();
  firstNameControl = new FormControl();
  lastNameControl = new FormControl();
  emailControl = new FormControl();
  groupNameControl = new FormControl();
  optionTitle: any = [];
  filterTitle: any = [];
  optionCode: any = [];
  filterCode: any = [];
  optionStudentId: any = [];
  filterStudentIdOptions: any = [];
  optionFirstName: any = [];
  filterFirstName: any = [];
  optionLastName: any = [];
  filterLastName: any = [];
  optionEmail: any = [];
  filterEmail: any = [];
  optionGroupName: any = [];
  filterGroupName: any = [];

  studentIdInput: any;
  titleInput: any;
  codeInput: any;
  firstNameInput: any;
  lastNameInput: any;
  emailInput: any;
  groupNameInput: any;
  menuAccessSubscribtion: any;
  getAchieveAllSubscribtion: any;
  getIssuersCertSubscribtion: any;
  searchParamArr: any = new URLSearchParams();
  resExport: any = [];
  exportprocess = false;

  constructor(
    public sanitizer: DomSanitizer,
    public ngxSmartModalService: NgxSmartModalService,
    private certiService: CertificateService,
    public formbuilder: FormBuilder,
    public apiService: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public domSanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: HTMLDocument,
    public socketDataService: SocketserviceService,
    private elRef: ElementRef,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe(val => this.functionCallInitial());
    this.options = {
      barBackground: '#8e8e8e',
      position: 'right',
      barOpacity: '0.7',
      barMargin: '0',
      gridOpacity: '1',
      gridBorderRadius: '20',
      gridMargin: '0',
      gridBackground: '#262d37',
      barBorderRadius: '10',
      barWidth: '6',
      gridWidth: '0',
      alwaysVisible: true
    };
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
      'show_deleted': false
    });
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });

    this.achMultiSelectForm = this.formbuilder.group({
      'multi_select_achv': [false]
    });
    this.filterTitle = this.titleControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._titlefilter(data) : this.optionTitle.slice())
      );

    this.filterCode = this.codeControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._codefilter(data) : this.optionCode.slice())
      );

    this.filterStudentIdOptions = this.studentIdControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._studentIdfilter(data) : this.optionStudentId.slice())
      );

    this.filterFirstName = this.firstNameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._firstnamefilter(data) : this.optionFirstName.slice())
      );

    this.filterLastName = this.lastNameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._lastnamefilter(data) : this.optionLastName.slice())
      );

    this.filterEmail = this.emailControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._emailfilter(data) : this.optionEmail.slice())
      );

    this.filterGroupName = this.groupNameControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._groupnamefilter(data) : this.optionGroupName.slice())
      );
  }

  private _titlefilter(dataValue) {
    return this.optionTitle.filter(option => option.title.toLowerCase().indexOf(dataValue) === 0);
  }

  private _codefilter(dataValue) {
    return this.optionCode.filter(option => option.code.toLowerCase().indexOf(dataValue) === 0);
  }

  private _studentIdfilter(dataValue) {
    return this.optionStudentId.filter(option => option.student_id.toLowerCase().indexOf(dataValue) === 0);
  }

  private _firstnamefilter(dataValue) {
    return this.optionFirstName.filter(option => option.first_name.toLowerCase().indexOf(dataValue) === 0);
  }

  private _lastnamefilter(dataValue) {
    return this.optionLastName.filter(option => option.last_name.toLowerCase().indexOf(dataValue) === 0);
  }

  private _emailfilter(dataValue) {
    return this.optionEmail.filter(option => option.email.toLowerCase().indexOf(dataValue) === 0);
  }

  private _groupnamefilter(dataValue) {
    return this.optionGroupName.filter(option => option.group_name.toLowerCase().indexOf(dataValue) === 0);
  }

  getinputStudentId(inputVal) {
    this.studentIdInput = inputVal;
  }

  getinputTitle(inputVal) {
    this.titleInput = inputVal;
  }

  getinputCode(inputVal) {
    this.codeInput = inputVal;
  }

  getinputfirstname(inputVal) {
    this.firstNameInput = inputVal;
  }

  getinputlastname(inputVal) {
    this.lastNameInput = inputVal;
  }

  getinputemail(inputVal) {
    this.emailInput = inputVal;
  }

  getinputgroup(inputVal) {
    this.groupNameInput = inputVal;
  }

  // ngAfterViewInit() {
  //   this.functionCallInitial();
  // }

  functionCallInitial() {
    this.menuAccessSubscribtion = this.apiService.menuPageaccess().subscribe(menuPermission => {
      this.privilegeSearch = menuPermission;
      if (this.userDetails) {
        if (this.privilegeSearch.allow_search === 'undefined')
          this.allowSearch = true;
        else
          this.allowSearch = this.privilegeSearch.allow_search;
      }
    });
  }

  certAllData() {
    this.getAchieveAllSubscribtion = this.certiService.getAchieveAll().subscribe(
      data => {
        console.log(data);
        this.allCertData = data;
        this.optionTitle = this.allCertData.title;
        this.optionCode = this.allCertData.code;
        this.optionStudentId = this.allCertData.student_id;
        this.optionFirstName = this.allCertData.first_name;
        this.optionLastName = this.allCertData.last_name;
        this.optionEmail = this.allCertData.email;
        this.optionGroupName = this.allCertData.group_name;
      });
  }

  ngOnInit() {
    this.certAllData();
    this.checkall = false;
    this.allselect = false;
    this.getSocketData();
    this.emitsocketfun();
    setTimeout(() => {
      if (!this.userDetails.is_verified && this.userDetails.profile_details.has_subscription) {
        this.ngxSmartModalService.getModal('userVerifyPopup').open();
      }
    }, 500);
    if (this.route.snapshot.paramMap.get('email') && this.route.snapshot.paramMap.get('email') != null) {
      this.issue_default_page = 1;
      this.issue_inc_page = 1;
      this.searchForm.controls['search'].setValue(this.route.snapshot.paramMap.get('email'));
      this.comeFromSearch = false;
      this.getIssuersCertificateLists(this.searchForm.value, false, true);
    } else {
      this.getIssuersCertificateLists([]);
      this.comeFromSearch = false;
    }
    if (this.route.snapshot.paramMap.get('name') && this.route.snapshot.paramMap.get('name') != null) {
      this.searchData = decodeURI(this.route.snapshot.paramMap.get('name'));
    }
  }

  onChangeAch(value: string, isChecked: boolean, select = false) {
    this.allselect = false;
    this.checkall = false;
    if (isChecked) {
      this.coursesArray.push(value);
      // if (this.coursesArray.length === this.certificateList.length) {
      //   this.allselect = true;
      // } else {
      //   this.allselect = false;
      // }
      const realVal = this.certificateList.find(x => x.id === value);
      const realIndexSelect = this.certificateList.indexOf(realVal);
      if (!this.certificateList[realIndexSelect].is_deleted) {
        this.selectedStudent.push(this.certificateList[realIndexSelect]);
      }
      const selectstudVal = this.selectedStudent.find(x => x.id === value);
      const selectStudIndex = this.selectedStudent.indexOf(selectstudVal);
      this.selectedStudent[selectStudIndex].selected = true;
    } else {
      this.allselect = false;
      this.achMultiSelectForm.controls['multi_select_achv'].setValue(false);
      const courseVal = this.coursesArray.find(x => x === value);
      const realVal = this.certificateList.find(x => x.id === value);
      const selectstudVal = this.selectedStudent.find(x => x.id === value);
      const realIndex = this.certificateList.indexOf(realVal);
      const selectStudIndex = this.selectedStudent.indexOf(selectstudVal);
      this.certificateList[realIndex].selected = false;
      const index = this.coursesArray.indexOf(courseVal);
      this.coursesArray.splice(index, 1);
      this.selectedStudent.splice(selectStudIndex, 1);
      // if (this.coursesArray.length === this.certificateList.length) {
      //   this.allselect = true;
      // } else {
      //   this.allselect = false;
      // }
    }
  }

  onChangeSelectAll(checked) {
    this.coursesArray = [];
    if (checked) {
      this.certificateList.forEach(data => {
        if (!data.is_deleted) {
          this.coursesArray.push(data.id);
        }
      });
      this.checkall = true;
      this.certificateList = [];
      this.selectedStudent = [];
      this.changeStudentArr.map(item => {
        item['selected'] = true;
        return item;
      }).forEach(item => {
        this.certificateList.push(item);
        if (!item.is_deleted) {
          this.selectedStudent.push(item);
        }
      }
      );
    } else {
      this.resetSelectCheck();
    }
  }

  resetSelectCheck() {
    this.studentIdInput = '';
    this.firstNameInput = '';
    this.lastNameInput = '';
    this.codeInput = '';
    this.emailInput = '';
    this.titleInput = '';
    this.groupNameInput = '';

    this.achMultiSelectForm.controls['multi_select_achv'].setValue(false);
    this.checkall = false;
    this.coursesArray = [];
    this.certificateList = [];
    this.selectedStudent = [];
    // this.changeStudentArr = [];

    this.changeStudentArr.map(item => {
      item['selected'] = false;
      return item;
    }).forEach(item => {
      this.certificateList.push(item);
    });
    console.log(this.certificateList);
  }

  advancedSearchFun() {
    this.searchForm.controls['search'].setValue('');
    this.refreshDataAchievement([]);
  }

  /**
   * @function getSocketData
   * @description Socket service used here for certificate image display dynamically
   */
  getSocketData(): void {
    this.socketDataService.onNewMessage().subscribe(msg => {
      const resSocket = msg;
      if (resSocket.message && resSocket.message != null && resSocket.message !== '') {
        const convJson = JSON.parse(resSocket.message);
        if (convJson.id && convJson.id != null && convJson.id !== '') {
          if (document.getElementById(convJson.id) != null) {
            this.document.getElementById(convJson.id).setAttribute('src',
              convJson.status ? convJson.uploads_thum : 'assets/images/awaiting.gif');
            const index = this.certificateList.findIndex(e => e.id === convJson.id);
            if (index != -1) {
              this.certificateList[index].transaction_address = convJson.transaction_address;
              this.certificateList[index].uploads = convJson.uploads_thum;
            }
            // const html = '<a (click)="getIssuedBadge(' + convJson.id + ')"><i class="fa fa-eye"></i>digital_course</a>';
            // this.document.getElementById('overlay' + convJson.id).innerHTML = html;
          }
        }
      }
    });
  }

  /**
   * @function emitsocketfun
   * @description user id based ceritficate details list
   */
  emitsocketfun() {
    this.socketDataService.sendMessage(this.userDetails.profile_details.eth_add);
  }

  /**
   * @function onScrollDownIssue
   * @description achieved certificate display based on the search data
   * @param searchData formdata
   */
  onScrollDownIssue(searchData) {
    this.issue_inc_page += 1;
    this.issue_default_page = this.issue_inc_page;
    if (this.issue_inc_page <= this.issue_no_page) {
      this.getIssuersCertificateLists(searchData);
    }
  }

  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  searchDataAchievement(searchData?: any, advanced = false) {
    var formData = searchData;
    console.log(formData);
    this.changeStudentArr = [];
    this.selectedStudent = [];
    this.comeFromSearch = true;
    this.issue_default_page = 1;
    this.issue_inc_page = 1;
    this.certificateList = [];
    searchData['student_id'] = this.studentIdInput;
    searchData['first_name'] = this.firstNameInput;
    searchData['last_name'] = this.lastNameInput;
    searchData['code'] = this.codeInput;
    searchData['email'] = this.emailInput;
    searchData['title'] = this.titleInput;
    searchData['group_name'] = this.groupNameInput;

    console.log(formData);
    this.searchParamArr = searchData;
    this.getIssuersCertificateLists(searchData, advanced);
  }

  refreshDataAchievement(searchData?: any) {
    this.issue_default_page = 1;
    this.issue_inc_page = 1;
    this.certificateList = [];
    // this.formSearchData = [];
    this.resentButtonDisplay = false;
    this.comeFromSearch = false;
    this.searchForm.reset();
    this.selectedStudent = [];
    this.getIssuersCertificateLists(searchData);
    this.resetSelectCheck();
  }

  resendMailtoSearchUser(countOfAchievement) {
    console.log(this.coursesArray);
    this.processResend = true;
    const params = {
      'certificates': typeof countOfAchievement != 'undefined' ? this.coursesArray : this.certID,
      'is_all': this.checkall
    };
    this.certiService.resendMailCertificate(this.paramsString, params).subscribe(
      data => {
        this.processResend = false;
        this.ngxSmartModalService.getModal('resend').close();
        this.common.openSnackBar('mail_resend_sucessfully', 'Close');
      });
  }

  getIssuersCertificateLists(searchData?: any, advanced = false, urlsearch = false, isScroll = false) {
    const searchArrData = searchData;
    if (advanced) {
      searchArrData['search'] = null;
    }
    console.log(searchArrData);

    const params = new URLSearchParams();
    for (const key in searchArrData) {
      if (searchArrData[key]) {
        if (key !== 'search' && searchArrData[key] && this.advanceSearch) {
          searchArrData['search'] = null;
        }
        if (key === 'search') {
          this.searchForm.controls['search'].setValue(searchArrData[key]);
        }
        params.set(key, searchArrData[key]);
      }
      if (searchArrData['block_chain'] === false) {
        params.set('block_chain', 'false');
      }
    }
    searchArrData['page'] = this.issue_default_page;
    console.log(searchArrData);
    this.process = true;
    console.log(params);
    this.searchParamArr = searchArrData;
    console.log(this.searchParamArr);
    this.paramsString = params.toString();
    var oldStr = this.paramsString;
    var newStr = oldStr.substring(0, 5);
    if (!isScroll) {
      this.changeStudentArr = [];
    }
    console.log(this.paramsString);
    this.getIssuersCertSubscribtion = this.certiService.getIssuersCertificateLists(params.toString()).subscribe(
      data => {
        this.process = false;
        this.walletData = this.apiService;
        this.purchasedVal = this.walletData.wallet - ((this.walletData.diploma_count - 0) + (this.walletData.course_count - 0));
        this.certificateListRes = data;
        this.totalAchCount = this.certificateListRes.total_count;
        if (this.certificateListRes.count !== 0) {
          if (newStr != 'page=') {
            this.resentButtonDisplay = this.comeFromSearch || urlsearch ? true : false;
          } else {
            this.resentButtonDisplay = false;
          }
          this.issue_no_page = Math.ceil(this.certificateListRes.count / 10);
          // this.certificateListRes.results.map(item => {
          //   return item;
          // }).forEach(item => {
          //   this.certificateList.push(item);
          // });
          console.log(this.checkall);
          if (this.checkall) {
            console.log(this.certificateListRes.results);
            this.certificateListRes.results.map(item => {
              item['selected'] = true;
              return item;
            }).forEach(item => {
              this.certificateList.push(item);
              if (!item.is_deleted) {
                this.selectedStudent.push(item);
              }
              this.coursesArray = [];
              this.certificateList.forEach(row => {
                if (!row.is_deleted) {
                  this.coursesArray.push(row.id);
                }
              });
            });
            this.changeStudentArr = this.certificateList;
          } else {
            this.certificateListRes.results.map(item => {
              item['selected'] = false;
              return item;
            }).forEach(item => {
              // this.coursesArray = [];
              this.certificateList.push(item);
            });
            this.changeStudentArr = this.certificateList;
          }
          console.log(this.certificateList);
        } else {
          this.resentButtonDisplay = false;
          this.certificateList = [];
        }
        if (localStorage.getItem('errorStud') && localStorage.getItem('errorStud') !== '') {
          this.displayStudent = localStorage.getItem('errorStud').split(',');
          localStorage.removeItem('errorStud');
          this.ngxSmartModalService.getModal('myErrorStudModal').open();
        }
      },
      err => {
        this.totalAchCount = 0;
        this.process = false;
      }
    );
  }

  getIssuedCertiDetail(id) {
    this.certiSelected = false;
    this.certiService.getIssuedCertiDetail(id).subscribe(
      data => {
        this.selectedCertificate = data;
        this.selectedCertificate.id = id;
        this.selectedCertificate.baseUrl = env.baseUrl;
        this.selectedCertificate.originalIssueDate = this.selectedCertificate.issue_date;
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'Mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const monthNamesCapital = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const catlanmonthNames = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny',
          'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
        const d = new Date(this.selectedCertificate.issue_date);
        this.selectedCertificate.issue_date_mmyy = monthNamesCapital[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.catlanDate = d.getDate() + ' ' + catlanmonthNames[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + d.getFullYear();
        this.selectedCertificate.issue_date_dateformat = this.selectedCertificate.originalIssueDate;
        // if (this.selectedCertificate.end_validity) {
        //   this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
        //   const exd = new Date(this.selectedCertificate.end_validity);
        //   this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + exd.getFullYear();
        // }
        this.testimonial = this.selectedCertificate.testimonial;
        this.certiSelected = true;
        if (this.selectedCertificate.is_certificate) {
          const dialogRef = this.dialog.open(CertDetailviewComponent, {
            data: {
              certDatas: this.selectedCertificate
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.is_Deleted) {
              const indexVal = this.certificateList.find(x => x.id === result.certId);
              const index = this.certificateList.indexOf(indexVal);
              this.certificateList.splice(index, 1);
            }
          });
        } else {
          const dialogRef = this.dialog.open(BadgeViewComponent, {
            data: {
              certDatas: this.selectedCertificate
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result.is_Deleted) {
              const indexVal = this.certificateList.find(x => x.id === result.certId);
              const index = this.certificateList.indexOf(indexVal);
              this.certificateList.splice(index, 1);
            }
          });
        }
        // this.ngxSmartModalService.setModalData(this.selectedCertificate, 'myModal3');
        // this.ngxSmartModalService.getModal('myModal3').open();
        // this.modelOpen = true;
      },
      err => {
        // this.modelOpen = false;
        this.certiSelected = false;
        this.common.openSnackBar('no_detail_found', 'Close');
      }
    );
  }

  confirmExport() {
    if (this.coursesArray.length > 100 || (this.totalAchCount > 100 && this.coursesArray.length == 0)) {
      this.ngxSmartModalService.open('exportpdfwarning');
    } else {
      this.ngxSmartModalService.open('exportConfirmation');
    }
  }

  exportPdfFile() {
    this.exportprocess = true;
    console.log(this.searchParamArr);
    console.log(this.coursesArray.length);
    const params = {
      certificates: this.coursesArray,
      search_param: this.searchParamArr
    };
    this.certiService.exportMultiPdfFile(params).subscribe(
      data => {
        this.exportprocess = false;
        this.resExport = data;
        this.ngxSmartModalService.close('exportConfirmation');
        window.open(this.resExport.url, '_blank');
      }, err => {
        this.exportprocess = false;
      });
  }

  getIssuedBadge(id) {
    this.certiSelected = false;
    this.certiService.getIssuedCertiDetail(id).subscribe(
      data => {
        this.selectedCertificate = data;
        this.selectedCertificate.originalIssueDate = this.selectedCertificate.issue_date;
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'Mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const monthNamesCapital = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const catlanmonthNames = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny',
          'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
        const d = new Date(this.selectedCertificate.issue_date);
        this.selectedCertificate.issue_date_mmyy = monthNamesCapital[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + d.getFullYear();
        this.selectedCertificate.catlanDate = d.getDate() + ' ' + catlanmonthNames[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date_dateformat = this.selectedCertificate.originalIssueDate;
        if (this.selectedCertificate.end_validity) {
          this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
          const exd = new Date(this.selectedCertificate.end_validity);
          this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + exd.getFullYear();
        }
        this.selectedCertificate.id = id;
        this.selectedCertificate.baseUrl = env.baseUrl;
        this.testimonial = this.selectedCertificate.testimonial;
        this.certiSelected = true;
        this.ngxSmartModalService.setModalData(this.selectedCertificate, 'badgeModalNew');
        this.ngxSmartModalService.getModal('badgeModalNew').open();
        this.modelOpen = true;
      },
      err => {
        this.modelOpen = false;
        this.certiSelected = false;
        this.common.openSnackBar('no_detail_found', 'Close');
      }
    );
  }

  getIssuedCertiDetail2(id) {
    this.certiSelected = false;
    this.certiService.getIssuedCertiDetail(id).subscribe(
      data => {
        this.selectedCertificate = data;
        this.selectedCertificate.baseUrl = env.baseUrl;
        this.selectedCertificate.originalIssueDate = this.selectedCertificate.issue_date;
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'Mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const catlanmonthNames = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny',
          'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
        const monthNamesCapital = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const d = new Date(this.selectedCertificate.issue_date);
        this.selectedCertificate.issue_date_mmyy = monthNamesCapital[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.catlanDate = d.getDate() + ' ' + catlanmonthNames[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + d.getFullYear();
        this.selectedCertificate.issue_date_dateformat = this.selectedCertificate.originalIssueDate;
        if (this.selectedCertificate.end_validity) {
          this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
          const exd = new Date(this.selectedCertificate.end_validity);
          this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + exd.getFullYear();
        }
        this.ngxSmartModalService.setModalData(this.selectedCertificate.uploads, 'blockchainCertModal');
        this.ngxSmartModalService.getModal('blockchainCertModal').open();
      },
      err => {
        // console.log(err);
      }
    );
  }

  getStudentDetailView(studentId) {
    this.apiService.getStudentDetail(studentId).subscribe(
      data => {
        this.selectedStudents = data;
        this.ngxSmartModalService.setModalData(this.selectedStudents, 'myModal6');
        this.ngxSmartModalService.getModal('myModal6').open();
      },
      err => {
        // console.log(err);
      }
    );
  }
  viewStudentAchievements(email, first_name, last_name) {
    this.ngxSmartModalService.getModal('myModal6').close();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`issuecertificate`, email, first_name, last_name]));
  }

  showHtml(template) {
    this.http.get(`/assets/templates/certificate-${template}/certificate-${template}.html`, { responseType: 'text' }).subscribe(html => {
      this.myTemplate = html;
    });
  }

  viewEvidence(certi) {
    if (certi && certi.evidence !== 'None') {
      let evidArray = [];
      const evidencelist = certi.evidence.split(',');
      const labelList = (certi.evidence_lable) ? certi.evidence_lable.split(',') : '';
      const transactionList = (certi.transaction_address) ? certi.transaction_address : '';
      const blockchain_client = (certi.blockchain_client) ? certi.blockchain_client : '';
      evidArray = evidencelist.map((element, i) => {
        return {
          evid: element,
          label: labelList[i],
          transaction: transactionList,
          blockchainType: blockchain_client != '' ? blockchain_client.toLowerCase() : ''
        };
      });
      this.ngxSmartModalService.setModalData(evidArray, 'myModal2');
      this.ngxSmartModalService.getModal('myModal2').open();
    } else {
      this.common.openSnackBar('no_evidence_found', 'Close');
    }
  }

  post(certi_id) {
    this.process = true;
    this.certiService.postCertificate(certi_id).subscribe(
      data => {
        this.process = false;
        this.issue_default_page = 1;
        this.issue_inc_page = 1;
        this.certificateList = [];
        // this.formSearchData = [];
        this.getIssuersCertificateLists(this.searchData);
        this.common.openSnackBar(data['msg'], 'Close');
      },
      err => {
        this.process = false;
        this.common.openSnackBar('some_error_occurred', 'Close');
      }
    );
  }

  experiedCertId(experiedCertID, status) {
    const params = {
      'cert_id': experiedCertID
    };
    this.certiService.experiedIssuedCertificate(params).subscribe(
      data => {
        this.expiredResImg = data;
        if (this.expiredResImg.msg.trim() === 'Certificate has been updated') {
          const classname = this.expiredResImg.is_invalidated ? 'cls-invalidado' : this.expiredResImg.is_apple_wallet ? 'cls-expirado' : this.expiredResImg.is_expired ? 'cls-expired' : 'testsam';
          if (status) {
            this.document.getElementById(experiedCertID).className = '';
            this.document.getElementById(experiedCertID).classList.remove(classname);
            this.document.getElementById(experiedCertID).className = classname;
          } else {
            this.document.getElementById(experiedCertID).className = classname;
          }
          this.ngxSmartModalService.getModal('myModal3').close();
          this.common.openSnackBar(status === true ? 'cert_revoke_success' : 'cert_expired_success', 'Close');
        } else {
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      },
      err => {
      }
    );
  }

  reasonFormSubmit(formdata, countOfAchievement) {
    console.log(countOfAchievement);
    if (!this.reasonForm.invalid) {
      const params = {
        'cert_id': typeof countOfAchievement != 'undefined' ? this.coursesArray.toString() : this.certID,
        'reason_type': formdata.reason_type,
        'reason': formdata.reason,
        'select_all': this.checkall
      };
      this.checkSubmit = true;
      if (typeof countOfAchievement != 'undefined') {
        this.certiService.deleteMultipleIssuedCertificate(params, this.paramsString).subscribe(
          data => {
            this.resDelete = data;
            if (this.resDelete.msg === 'Certificates deleted from blockchain successfully.') {
              this.common.openSnackBar('achievement_deletion_successfully', 'Close');
              this.ngxSmartModalService.getModal('deletemyModal').close();
              this.ngxSmartModalService.getModal('myModal3').close();
              document.getElementById('bodyId').classList.remove('dialog-open');
              this.coursesArray.map(item => {
                const indexVal = this.certificateList.find(x => x.id === item);
                const index = this.certificateList.indexOf(indexVal);
                this.certificateList.splice(index, 1);
              });
              // if (this.checkall) {
              this.refreshDataAchievement([]);
              // }
              this.certiSelected = false;
              this.modelOpen = false;
              this.checkSubmit = false;
              this.achMultiSelectForm.controls['multi_select_achv'].setValue(false);
              this.checkall = false;
              this.coursesArray = [];
              this.selectedStudent = [];
            } else {
              this.checkSubmit = false;
              this.common.openSnackBar('some_error_occurred', 'Close');
            }
          },
          err => {
            this.checkSubmit = false;
            this.common.openSnackBar('some_error_occurred', 'Close');
            this.ngxSmartModalService.getModal('myModal').close();
          }
        );
      } else {
        this.certiService.deleteIssuedCertificate(params).subscribe(
          data => {
            this.resDelete = data;
            if (this.resDelete.msg === 'Certificate deleted from blockchain successfully.') {
              this.common.openSnackBar('achievement_deletion_successfully', 'Close');
              this.ngxSmartModalService.getModal('deletemyModal').close();
              this.ngxSmartModalService.getModal('myModal3').close();
              document.getElementById('bodyId').classList.remove('dialog-open');
              const indexVal = this.certificateList.find(x => x.id === this.certID);
              const index = this.certificateList.indexOf(indexVal);
              this.certificateList.splice(index, 1);
              this.certiSelected = false;
              this.modelOpen = false;
              this.checkSubmit = false;
            } else {
              this.checkSubmit = false;
              this.common.openSnackBar('some_error_occurred', 'Close');
            }
          },
          err => {
            this.checkSubmit = false;
            this.common.openSnackBar('some_error_occurred', 'Close');
            this.ngxSmartModalService.getModal('myModal').close();
          }
        );
      }
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
  /**
   * @description function using for redirect page and also using for popup alert for low balance
   */
  onAddAchievement() {
    if (this.apiService.remaining_wallet < 10 && !this.testMode) {
      this.ngxSmartModalService.getModal('planPopupInfo').open();
    } else {
      localStorage.removeItem('redirectWithID');
      this.router.navigate(['newassign']);
    }
  }

  /**
   * @description supporting function for scroll pagination
   * @param $event scroll event variable
   */
  scrollChanged($event: ISlimScrollState) {
    this.slimScrollState = $event;
  }

  ngOnDestroy() {
    if (this.menuAccessSubscribtion) {
      this.menuAccessSubscribtion.unsubscribe();
    }
    if (this.getAchieveAllSubscribtion) {
      this.getAchieveAllSubscribtion.unsubscribe();
    }
    if (this.getIssuersCertSubscribtion) {
      this.getIssuersCertSubscribtion.unsubscribe();
    }
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }
}

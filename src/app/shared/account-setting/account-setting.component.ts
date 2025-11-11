/*
 * File : account-setting.component.ts
 * Use: account setting page for multiple user
 * Copyright : vottun 2019
 */
import { Component, DoCheck, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { TooltipPosition } from '@angular/material';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { TeamService } from '../../service/team.service';

import * as moment from 'moment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';
import { PaymentService } from '../../service/payment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { CertificateService } from '../../issuer/services/certificate.service';
import { MatDialog } from '@angular/material';
import { EductionExperienceComponent } from '../../student/eduction-experience/eduction-experience.component';
import { PostConfirmationComponent } from '../../student/post-confirmation/post-confirmation.component';


@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css'],
})
export class AccountSettingComponent implements DoCheck, OnInit, OnDestroy {
  userForm: FormGroup;
  sendboxForm: FormGroup;
  smtpmailForm: FormGroup;
  orgDocForm: FormGroup;
  genForm: FormGroup;
  reportForm: FormGroup;
  achTestModeForm: FormGroup;
  genAccessForm: FormGroup;
  profileExist = false;
  profileForm: FormGroup;
  profilePic = new FormData();
  orgFileUploadForm: any = [];
  uploadedOrgFiles: any = [];
  emdForm: FormGroup;
  errorMsgArr: any = [];
  errorMsgArrSendBox: any = [];
  errorMsgArrReport: any = [];
  errorMsg = '';
  errorMsgUser = '';
  reportErrorMsg = '';
  user: any = {};
  process = false;
  processUserInfo = false;
  languages: any = [];
  selectedLang = 'EN';
  errormessgae: any;
  uploadfileLength: any;
  public options: Object = {
    placeholderText: '',
    height: '250'
  };
  statuslists: any = [
    { 'value': true, 'text': 'active' },
    { 'value': false, 'text': 'in_active' }
  ];
  conststeps: any = [
    { 'value': 1 },
    { 'value': 2 },
    { 'value': 3 },
    { 'value': 4 },
    { 'value': 5 },
    { 'value': 6 },
    { 'value': 7 },
    { 'value': 8 },
    { 'value': 9 },
    { 'value': 10 },
    { 'value': 11 },
    { 'value': 12 },
    { 'value': 13 },
    { 'value': 14 },
    { 'value': 15 },
    { 'value': 16 },
    { 'value': 17 },
    { 'value': 18 },
    { 'value': 19 },
    { 'value': 20 },
    { 'value': 21 },
    { 'value': 22 },
    { 'value': 23 },
    { 'value': 24 },
    { 'value': 25 },
    { 'value': 26 },
    { 'value': 27 },
    { 'value': 28 },
    { 'value': 29 },
    { 'value': 30 },
  ];
  steps: any = [
    { 'value': 1 },
    { 'value': 2 },
    { 'value': 3 },
    { 'value': 4 },
    { 'value': 5 },
    { 'value': 6 },
    { 'value': 7 },
    { 'value': 8 },
    { 'value': 9 },
    { 'value': 10 },
    { 'value': 11 },
    { 'value': 12 },
    { 'value': 13 },
    { 'value': 14 },
    { 'value': 15 },
    { 'value': 16 },
    { 'value': 17 },
    { 'value': 18 },
    { 'value': 19 },
    { 'value': 20 },
    { 'value': 21 },
    { 'value': 22 },
    { 'value': 23 },
    { 'value': 24 },
    { 'value': 25 },
    { 'value': 26 },
    { 'value': 27 },
    { 'value': 28 },
    { 'value': 29 },
    { 'value': 30 },
  ];
  profile: any = {
    'student_id': null,
    'dob': null,
    'phone': '',
    'gender': null,
    'address': '',
    'city': '',
    'state': '',
    'country': '',
    'zipcode': '',
    'issuer_description': '',
    'organization': '',
    'website': '',
    'registration_number': '',
    'tin_number': '',
    'avatar': '',
    'university_avatar': '',
    'university_city': '',
    'university_state': '',
    'university_country': '',
    'university_zipcode': '',
    'university_phone': '',
    'university_address': '',
    'vouttun_logo': true,
    'custom_template': '',
    'sandbox': false,
    'sandbox_email': '',
    'member_inbox': true,
    'embedcode': '',
    'allow_modify_activity': false,
    'allow_test_activity': false,
    'credentials_set': [true, true, true],
    'custom_set': [true, true, true],
    'supply_chain_set': [true, true, true],
    // 'is_student_search': false
    'achievement_test_mode': false,
    'test_mode': true,
    'gdpr': false,
    'university_avatar_comp': '',
    'organization_comp': '',
    'allow_trace_group_color': false,
    'allow_nested_workflow': false,
    'user_blockchain_value': null,
    'rep_searchform_content': '{{form}}',
    'search_bottun_color': '#29b',
    'report_multiple_language': '',
    'page_bg_color': '#fff',
    'page_title': '',
    'sep_report_logo': '',
    'sep_report_favicon': '',
    'is_sep_report_org_logo': false,
    'bio_description': '',
    'share_my_credential_to_the_repository': false
  };
  checkThreeVar = true;
  errorsendBoxMsg = '';
  viewEmailField = false;
  viewSmtpField = false;
  errorSmtpMsg = '';
  erroraccessMsg = '';
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  tabselection: any;
  orgDocLists: any = [];
  resOrgDocLists: any = [];
  selectedFilesOrgDoc: any = [];
  dummyselectedFilesOrgDoc: any = [];
  orgFileUploadFormOr: any = [];
  popuptransferfile: any;
  accessaction = ['read', 'write', 'delete'];
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  defaultlang = 'en';
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;

  displayedColumns = ['text', 'workflow_name', 'translation'];
  langList: any = [];
  langObj: any;
  progress = false;
  dataSource = new MatTableDataSource<Element>(this.langList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchField') searchField: ElementRef;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    uploadUrl: env.url + 'files/new/upload/',
    sanitize: false,
    toolbarPosition: 'top'
  };
  resWorkflow: any = [];
  workflowlists: any = [];
  resProduct: any = [];
  productlists: any = [];
  workflowDbId: any = '';
  selectedStep: any = '';
  searchFormLang: FormGroup;
  searchIn = 0;
  filterValues = {};
  findFilterData: any;
  searchTerms: any;
  page_size = 5;

  blockchainList: any = [];
  defaultBlockchainVal: any = {
    'key_number': ''
  };
  nullVal = null;
  eduDataList: any = [];
  monthArr: any = [
    { index: '01', month: 'January' },
    { index: '02', month: 'February' },
    { index: '03', month: 'March' },
    { index: '04', month: 'April' },
    { index: '05', month: 'May' },
    { index: '06', month: 'June' },
    { index: '07', month: 'July' },
    { index: '08', month: 'August' },
    { index: '09', month: 'September' },
    { index: '10', month: 'October' },
    { index: '11', month: 'November' },
    { index: '12', month: 'December' },
  ];
  getLanguagesSubscribtion: any;
  getOrgDocListSubscribtion: any;
  getWorkflowListSubscribtion: any;
  getProductListSubscribtion: any;
  getEducationListSubscribtion: any;
  getUserBlockSubscribtion: any;
  constructor(
    private formbuilder: FormBuilder,
    public apiService: ApiService,
    public common: CommonService,
    public team: TeamService,
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    public payService: PaymentService,
    private http: HttpClient,
    private certificateService: CertificateService,
    public dialog: MatDialog
  ) {
    this.getLanguages();
    this.createForm();
    this.getOrgDocList();
    this.getWorkflowList();
    this.getProductList();
    this.getEducationList();

    this.searchFormLang = this.formbuilder.group({
      'search': [null],
      'workflow': [null],
      'step': [null],
      'product_id': [null],
    });
  }

  ngOnInit() {
    if ((this.userDetails.userType === '5' || this.userDetails.userType === '9') && !this.userDetails.pages.account_settings) {
      this.common.openSnackBar('dont_have_privillege', 'Close');
      this.router.navigate(['/signin']);
    }
  }

  getEducationList() {
    this.getEducationListSubscribtion = this.certificateService.getAllEducationDetgails().subscribe(data => {
      this.eduDataList = data;
    });
  }

  monthString(monthnum) {
    // console.log(monthnum);
    if (monthnum != null && monthnum != '') {
      const findIndex = this.monthArr.find(x => x.index == monthnum);
      return findIndex.month;
    } else {
      return;
    }
  }

  getUserBlockChainList() {
    this.getUserBlockSubscribtion = this.certificateService.getBlockChainList().subscribe(data => {
      this.blockchainList = data;
      this.defaultBlockchainVal = this.blockchainList.find(x => x.is_default === 'true');
      if (typeof this.defaultBlockchainVal.key_number != 'undefined') {
        this.genForm.controls['user_blockchain_value'].setValue(this.defaultBlockchainVal.key_number ? this.defaultBlockchainVal.key_number : '');
      }
    });
  }

  addEduExp(action, id = '') {
    const dialogRef = this.dialog.open(EductionExperienceComponent, {
      data: {
        action_type: action,
        edu_id: id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'cancel') {
        this.getEducationList();
      }
    });
  }

  deleteEdu(id) {
    const dialogRef = this.dialog.open(PostConfirmationComponent, {
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == '1') {
        this.certificateService.deleteEduDetail(id).subscribe(
          data => {
            this.getEducationList();
            this.common.openSnackBar('education_details_deleted', 'Close');
          });
      }
    });
  }

  ngDoCheck() {
    this.tabselection = this.apiService.user.register_type === '2' || this.apiService.user.register_type === '8' ? !this.apiService.userVerified || !this.apiService.user.university_avatar ? 1 : 0 : 0;
    if (!this.profileExist) {
      if (this.apiService.user && this.apiService.user.profile_id) {
        this.profileExist = true;
        this.getProfile();
      }
    }
    setTimeout(() => {
      if (this.apiService.userType === '4' && !this.apiService.pages.account_settings) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
    }, 1000);
  }

  onAvoidComma(event) {
    const re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    if (re.test(event.key)) {
      event.preventDefault();
    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.language_code.toLocaleLowerCase().indexOf(term) > -1;
  }

  onChangeLanguage(lang_id) {
    this.defaultlang = lang_id;
    // this.searchField.nativeElement.value = '';
    this.langHttpcall();
    this.resetFilters(true);
    this.searchFormLang.reset();
  }

  getLangList() {
    let languages: any = [];
    languages = this.languages;
    const language_code = (localStorage.getItem('language_code')) ? localStorage.getItem('language_code').toLowerCase() : 'en';
    const selLang = languages.find(e => e.language_code.toLowerCase() === language_code);
    this.defaultlang = selLang.language_key;
    this.langHttpcall();
  }

  getWorkflowList() {
    this.getWorkflowListSubscribtion = this.team.getWFTeamList([], true).subscribe(data => {
      this.resWorkflow = data;
      if (this.resWorkflow && this.resWorkflow.results.length != 0) {
        this.workflowlists = this.resWorkflow.results;
      } else {
        this.workflowlists = [];
      }
    });
  }

  getProductList() {
    this.getProductListSubscribtion = this.team.getProductList().subscribe(data => {
      this.resProduct = data;
      if (this.resProduct && this.resProduct.length != 0) {
        this.productlists = this.resProduct;
      } else {
        this.productlists = [];
      }
    });
  }

  langHttpcall() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.get(env.url + `product/language-translation/${this.defaultlang}/`, httpOption).subscribe(res => {
      this.langObj = res;
      this.langList = Object.keys(res).map(key => (
        {
          key: key,
          workflow: res[key].workflow_id,
          workflow_name: res[key].workflow_name,
          product_id: res[key].product_id,
          step: res[key].step,
          label: res[key].label,
          value: res[key]
        })
      );
      this.dataSource = new MatTableDataSource<any>(this.langList);
      this.dataSource.filterPredicate = this.createFilter();
      this.dataSource.paginator = this.paginator;
    });
  }

  // pageChange(e) {
  //   if (this.page_size != e.page_size) {
  //     this.page_size = e.page_size;
  //     this.paginator.pageIndex = 0;
  //   }
  // }

  cleanData(o) {
    if (Object.prototype.toString.call(o) == "[object Array]") {
      for (let key = 0; key < o.length; key++) {
        this.cleanData(o[key]);
        if (Object.prototype.toString.call(o[key]) == "[object Object]") {
          if (Object.keys(o[key]).length === 0) {
            o.splice(key, 1);
            key--;
          }
        }

      }
    }
    else if (Object.prototype.toString.call(o) == "[object Object]") {
      for (let key in o) {
        let value = this.cleanData(o[key]);
        if (value === null || value === "null") {
          delete o[key];
        }
        if (Object.prototype.toString.call(o[key]) == "[object Object]") {
          if (Object.keys(o[key]).length === 0) {
            delete o[key];
          }
        }
        if (Object.prototype.toString.call(o[key]) == "[object Array]") {
          if (o[key].length === 0) {
            delete o[key];
          }
        }
      }
    }
    return o;
  }

  filterChange(filter, event) {
    if (filter === 'workflow') {
      this.searchFormLang.controls['step'].reset();
      this.filterValues['step'] = null;
      if (event.target.value != 'null' && event.target.value != null) {
        const findStep = this.workflowlists.find(x => x.workflow_db_id == event.target.value);
        this.steps = this.conststeps.slice(0, findStep.step_count);
      } else {
        this.steps = this.conststeps.slice(0, 30);
      }
    }
    this.paginator.pageIndex = 0;
    this.filterValues[filter] = event.target.value.trim().toLowerCase();
    this.filterValues = this.cleanData(this.filterValues);
    if (Object.keys(this.filterValues).length === 0) {
      this.resetFilters();
    } else {
      this.dataSource.filter = JSON.stringify(this.filterValues);
    }
  }

  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      this.findFilterData = data;
      this.searchTerms = JSON.parse(filter);
      let nameSearch = () => {
        let found = false;
        const keys = Object.keys(this.searchTerms);
        if (Object.keys(this.searchTerms).length == 1) {
          if (this.findFilterData[keys[0]] != null) {
            if (typeof this.findFilterData[keys[0]] == 'number') {
              if (this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1) {
                found = true;
              }
            } else {
              if (this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1) {
                found = true;
              }
            }
          } else {
            found = false;
          }
        } else if (Object.keys(this.searchTerms).length == 2) {
          if (keys[0] == 'step') {
            if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null) {
              if (keys[1] == 'product_id') {
                if (this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 || this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1) {
                  found = true;
                } else {
                  found = false;
                }
              } else {
                if (this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1) {
                  found = true;
                } else {
                  found = false;
                }
              }
            }
          } else if (keys[1] == 'step') {
            if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null) {
              if (keys[0] == 'product_id') {
                if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1)) {
                  found = true;
                } else {
                  found = false;
                }
              } else {
                if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1) {
                  found = true;
                } else {
                  found = false;
                }
              }
            }
          } else {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null) {
            if (keys[0] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else if (keys[1] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
            // }
          }
        } else if (Object.keys(this.searchTerms).length == 3) {
          if (keys[0] == 'step') {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null && this.findFilterData[keys[2]] != null) {
            if (keys[1] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else if (keys[2] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1) || (this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
            // }
          } else if (keys[1] == 'step') {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null && this.findFilterData[keys[2]] != null) {
            if (keys[0] == 'product_id') {
              if ((this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1) || (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else if (keys[2] == 'product_id') {
              if ((this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1) || (this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
            // }
          } else if (keys[2] == 'step') {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null && this.findFilterData[keys[2]] != null) {
            if (keys[0] == 'product_id') {
              if ((this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].toString().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1) || (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else if (keys[1] == 'product_id') {
              if ((this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].toString().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].toString().indexOf(this.searchTerms[keys[2]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
            // }
          } else {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null && this.findFilterData[keys[2]] != null) {
            if (keys[0] == 'product_id') {
              if ((this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1) || (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else if (keys[1] == 'product_id') {
              if ((this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else if (keys[2] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1) || (this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1)) {
                found = true;
              } else {
                found = false;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
          }
          // }
        } else if (Object.keys(this.searchTerms).length == 4) {
          if (keys[0] == 'step') {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null && this.findFilterData[keys[2]] != null && this.findFilterData[keys[3]] != null) {
            if (keys[1] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1)) {
                found = true;
              }
            } else if (keys[2] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1) || (this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1)) {
                found = true;
              }
            } else if (keys[3] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1) || (this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1)) {
                found = true;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].toString().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
            // } else {
            //   found = false;
            // }
          } else if (keys[1] == 'step') {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null && this.findFilterData[keys[2]] != null && this.findFilterData[keys[3]] != null) {
            if (keys[0] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1) || (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1)) {
                found = true;
              }
            } else if (keys[2] == 'product_id') {
              if ((this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1) || (this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1)) {
                found = true;
              }
            } else if (keys[3] == 'product_id') {
              if ((this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1) || (this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1)) {
                found = true;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].toString().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
            // } else {
            //   found = false;
            // }
          } else if (keys[2] == 'step') {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null && this.findFilterData[keys[2]] != null && this.findFilterData[keys[3]] != null) {
            if (keys[0] == 'product_id') {
              if ((this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].toString().indexOf(this.searchTerms[keys[2]]) != -1) || (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1)) {
                found = true;
              }
            } else if (keys[1] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].toString().indexOf(this.searchTerms[keys[2]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1)) {
                found = true;
              }
            } else if (keys[3] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].toString().indexOf(this.searchTerms[keys[2]]) != -1) || (this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1)) {
                found = true;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].toString().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].trim().toLowerCase().indexOf(this.searchTerms[keys[3]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
            // } else {
            //   found = false;
            // }
          } else if (keys[3] == 'step') {
            // if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[1]] != null && this.findFilterData[keys[2]] != null && this.findFilterData[keys[3]] != null) {
            if (keys[0] == 'product_id') {
              if ((this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].toString().indexOf(this.searchTerms[keys[3]]) != -1) || (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1)) {
                found = true;
              }
            } else if (keys[1] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].toString().indexOf(this.searchTerms[keys[3]]) != -1) || (this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1)) {
                found = true;
              }
            } else if (keys[2] == 'product_id') {
              if ((this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].toString().indexOf(this.searchTerms[keys[3]]) != -1) || (this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1)) {
                found = true;
              }
            } else {
              if (this.findFilterData[keys[0]] != null && this.findFilterData[keys[0]].trim().toLowerCase().indexOf(this.searchTerms[keys[0]]) != -1 && this.findFilterData[keys[1]] != null && this.findFilterData[keys[1]].trim().toLowerCase().indexOf(this.searchTerms[keys[1]]) != -1 && this.findFilterData[keys[2]] != null && this.findFilterData[keys[2]].trim().toLowerCase().indexOf(this.searchTerms[keys[2]]) != -1 && this.findFilterData[keys[3]] != null && this.findFilterData[keys[3]].toString().indexOf(this.searchTerms[keys[3]]) != -1) {
                found = true;
              } else {
                found = false;
              }
            }
            // } else {
            //   found = false;
            // }
          }
        }
        return found;
      };
      return nameSearch();
    };
    return filterFunction;
  }

  resetFilters(buttonReset = false) {
    if (buttonReset) {
      this.steps = this.conststeps.slice(0, 30);
    }
    this.filterValues = {};
    this.dataSource.filter = '';
  }

  submit() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.put(env.url + `product/language-translation/${this.defaultlang}/`, this.langObj, httpOption).subscribe(res => {
      this.common.openSnackBar('lang_updated', 'Close');
    });
  }

  getProfile() {
    this.apiService.getUserProfile().subscribe(data => {
      this.profile = data;
      console.log(this.profile);
      this.selectedLang = this.profile.org_default_language_id;
      if (!this.profile.university_avatar_comp || !this.profile.organization || !this.profile.website) {
        this.checkThreeVar = false;
      } else {
        this.checkThreeVar = true;
      }
      this.createForm();
    });
  }

  updateProfile() {
    this.apiService.getUserProfile().subscribe(data => {
      this.profile = data;
    });
  }

  genFormSubmit(formData) {
    console.log(formData);
    formData.rep_searchform_content = '{{form}}';
    formData.search_bottun_color = this.profile.search_bottun_color,
    formData.report_multiple_language = this.profile.report_multiple_language && this.profile.report_multiple_language != [] && this.profile.report_multiple_language != '' ? this.profile.report_multiple_language.toString() : '';
    formData.page_bg_color = this.profile.page_bg_color;
    formData.page_title = this.profile.page_title;
    formData.sep_report_logo = this.profile.sep_report_logo;
    formData.sep_report_favicon = this.profile.sep_report_favicon;
    formData.is_sep_report_org_logo = this.profile.is_sep_report_org_logo;
    console.log(formData);
    this.apiService.updateGeneralDetails(formData).subscribe(
      data => {
        this.updateProfile();
        this.apiService.getUser();
        this.common.openSnackBar('general_detail_updated', 'Close');
      });
  }

  reportFormSubmit(formData) {
    this.reportErrorMsg = '';
    let htmlcontent = formData.rep_searchform_content;

    formData.uni_language = this.profile.org_default_language_id;
    formData.allow_modify_activity = this.profile.allow_modify_activity;
    formData.allow_test_activity = this.profile.allow_test_activity;
    formData.student_delete = this.apiService.studentDisplay;
    formData.is_student_search = this.apiService.studentSearchDisplay;
    formData.revive = this.apiService.is_payment_renewal;
    formData.gdpr = this.apiService.is_gdpr;
    formData.allow_trace_group_color = this.profile.allow_trace_group_color;
    formData.user_blockchain_value = this.profile.user_blockchain_value;
    formData.allow_nested_workflow = this.profile.allow_nested_workflow;

    formData.report_multiple_language = formData.report_multiple_language && formData.report_multiple_language != [] ? formData.report_multiple_language.toString() : '';
    if (this.reportForm.valid) {
      if (htmlcontent.includes('{{form}}')) {
        this.apiService.updateGeneralDetails(formData).subscribe(
          data => {
            this.updateProfile();
            this.apiService.getUser();
            this.common.openSnackBar('report_detail_updated', 'Close');
          });
      } else {
        this.reportErrorMsg = 'error';
        this.errorMsgArrReport['rep_searchform_content'] = 'html_content_must_need';
      }
    } else {
      this.reportErrorMsg = 'error';
      if (!htmlcontent.includes('{{form}}')) {
        this.errorMsgArrReport['rep_searchform_content'] = 'html_content_must_need';
      }
    }
  }

  getErrorReportMessage(field) {
    if (field === 'search_bottun_color' || field === 'page_bg_color') {
      return this.reportForm.controls[field].hasError('required')
        || this.reportForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
        this.reportForm.controls[field].hasError('pattern') ? 'enter_valid_color_code' : '';
    } else if (field === 'sep_report_logo') {
      return this.reportForm.controls[field].hasError('required') ? 'field_should_not_be_empty' : '';
    }
  }

  createForm() {
    this.user = this.apiService.user;
    this.userForm = this.formbuilder.group({
      'student_id': [this.user.profile_details.student_id],
      'first_name': [this.user.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'last_name': [this.user.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'email': [this.user.email, [Validators.required, Validators.email, this.noWhitespaceValidator]],
      'register_type': [this.user.register_type],
      'profile_id': [this.user.profile_id],
      'dob': [this.user.profile_details.dob],
      'phone_no': [this.user.profile_details.phone_no, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
      'avatar': [this.user.profile_details.avatar],
      'gender': [this.user.profile_details.gender],
      'address': [this.user.profile_details.address],
      'city': [this.user.profile_details.city],
      'state': [this.user.profile_details.state],
      'country': [this.user.profile_details.country],
      'zipcode': [this.user.profile_details.zipcode, Validators.compose([Validators.pattern(/^-?([0-9]\d*)?$/)])],
      'bio_description': [this.user.profile_details.bio_description],
      'share_my_credential_to_the_repository': [this.user.profile_details.share_my_credential_to_the_repository]
      // 'is_student_search': [this.profile.is_student_search]
    });

    this.profileForm = this.formbuilder.group({
      'issuer_description': [this.profile.issuer_description],
      'organization': [this.profile.organization_comp, [Validators.required, this.noWhitespaceValidator]],
      'website': [this.profile.website, [Validators.required, this.noWhitespaceValidator, Validators.pattern('https?://.+')]],
      'registration_number': [this.profile.registration_number],
      'tin_number': [this.profile.tin_number],
      'user': [this.apiService.user.id],
      'university_phone': [this.profile.university_phone, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
      'university_address': [this.profile.university_address],
      'university_city': [this.profile.university_city],
      'university_state': [this.profile.university_state],
      'university_country': [this.profile.university_country],
      'university_zipcode': [this.profile.university_zipcode, Validators.compose([Validators.pattern(/^-?([0-9]\d*)?$/)])],
      'university_avatar': [this.profile.university_avatar_comp, Validators.compose([Validators.required])],
      'vouttun_logo': [this.profile.vouttun_logo],
      'custom_template': [this.profile.custom_template],
      'top_logo': [this.profile.top_logo]
    });
    this.genForm = this.formbuilder.group({
      'uni_language': [this.profile.org_default_language_id],
      'allow_modify_activity': [this.profile.allow_modify_activity],
      'allow_test_activity': [this.profile.allow_test_activity],
      'student_delete': [this.apiService.studentDisplay],
      'is_student_search': [this.apiService.studentSearchDisplay],
      'share_my_credential_to_the_repository' : [this.user.profile_details.share_my_credential_to_the_repository],
      'revive': [this.apiService.is_payment_renewal],
      'gdpr': [this.apiService.is_gdpr],
      'allow_trace_group_color': [this.profile.allow_trace_group_color],
      'allow_nested_workflow': [this.profile.allow_nested_workflow],
      'user_blockchain_value': [this.profile.user_blockchain_value],
      'rep_searchform_content': [this.profile.rep_searchform_content],
      'search_bottun_color': [this.profile.search_bottun_color],
      'report_multiple_language': [this.profile.report_multiple_language],
      'page_bg_color': [this.profile.page_bg_color],
      'page_title': [this.profile.page_title],
      'sep_report_logo': [this.profile.sep_report_logo],
      'sep_report_favicon': [this.profile.sep_report_favicon],
      'is_sep_report_org_logo': [this.profile.is_sep_report_org_logo],
      'pagenotfountcontent': [this.profile.pagenotfountcontent]
    });

    this.reportForm = this.formbuilder.group({
      'uni_language': [this.profile.org_default_language_id],
      'allow_modify_activity': [this.profile.allow_modify_activity],
      'allow_test_activity': [this.profile.allow_test_activity],
      'student_delete': [this.apiService.studentDisplay],
      'is_student_search': [this.apiService.studentSearchDisplay],
      'share_my_credential_to_the_repository' : [this.user.profile_details.share_my_credential_to_the_repository],
      'revive': [this.apiService.is_payment_renewal],
      'gdpr': [this.apiService.is_gdpr],
      'allow_trace_group_color': [this.profile.allow_trace_group_color],
      'allow_nested_workflow': [this.profile.allow_nested_workflow],
      'user_blockchain_value': [this.profile.user_blockchain_value],
      'rep_searchform_content': [this.profile.rep_searchform_content],
      'search_bottun_color': [this.profile.search_bottun_color, [Validators.pattern('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$')]],
      'report_multiple_language': [this.profile.report_multiple_language],
      'page_bg_color': [this.profile.page_bg_color, [Validators.pattern('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$')]],
      'page_title': [this.profile.page_title],
      'sep_report_logo': [this.profile.sep_report_logo],
      'sep_report_favicon': [this.profile.sep_report_favicon],
      'is_sep_report_org_logo': [this.profile.is_sep_report_org_logo],
      'pagenotfountcontent': [this.profile.pagenotfountcontent]
    });

    this.logoBgChangeEnable(this.profile.is_sep_report_org_logo);

    this.sendboxForm = this.formbuilder.group({
      'sandbox': [this.profile.sandbox],
      'sandbox_email': [this.profile.sandbox_email],
      'member_inbox': [this.profile.member_inbox],
    });

    this.achTestModeForm = this.formbuilder.group({
      'achievement_test_mode': [this.profile.achievement_test_mode],
      'test_mode': [this.profile.test_mode],
    });

    this.orgDocForm = this.formbuilder.group({
      'orgfiles': ['']
    });

    this.smtpmailForm = this.formbuilder.group({
      'had_email_setup': [this.profile.had_email_setup],
      'email_use_tls': [this.profile.email_use_tls],
      'email_host': [this.profile.email_host],
      'email_host_user': [this.profile.email_host_user],
      'email_host_password': [this.profile.email_host_password],
      'email_port': [this.profile.email_port]
    });

    this.emdForm = this.formbuilder.group({
      'embedcode': [this.profile.embedcode]
    });

    this.genAccessForm = this.formbuilder.group({
      'credentials_set': this.formbuilder.array(this.profile.credentials_set),
      'custom_set': this.formbuilder.array(this.profile.custom_set),
      'supply_chain_set': this.formbuilder.array(this.profile.supply_chain_set)
    });
    this.viewEmailField = this.profile.sandbox === true ? true : false;
    this.sandBoxFieldEnable(this.viewEmailField);

    this.viewSmtpField = this.profile.had_email_setup === true ? true : false;
    this.enableSmtpField(this.viewSmtpField);

    if (this.apiService.userType == '2' || this.apiService.userType == '8') {
      this.profileForm.controls['university_avatar'].setValidators(Validators.compose([Validators.required]));
      this.profileForm.controls['university_avatar'].updateValueAndValidity();
    } else {
      this.profileForm.controls['university_avatar'].clearValidators();
      this.profileForm.controls['university_avatar'].updateValueAndValidity();
    }

    this.getUserBlockChainList();
  }

  public noWhitespaceValidator(control: FormControl) {
    if (control.value != null) {
      const isWhitespace = control.value.trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    } else {
      return null;
    }
  }

  geterrorMsgUser(field) {
    if (field === 'phone_no') {
      return this.userForm.controls[field].hasError('pattern') ? 'enter_valid_phonenumber' : '';
    } else if (field === 'zipcode') {
      return this.userForm.controls[field].hasError('pattern') ? 'enter_only_number' : '';
    } else {
      return this.userForm.controls[field].hasError('required')
        || this.userForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
        this.userForm.controls[field].hasError('email') ? 'not_valid_email' : '';
    }
  }

  geterrorMsg(field) {
    if (field === 'university_phone') {
      return this.profileForm.controls[field].hasError('pattern') ? 'enter_valid_phonenumber' : '';
    } else if (field === 'university_zipcode') {
      return this.profileForm.controls[field].hasError('pattern') ? 'enter_only_number' : '';
    } else if (field === 'website') {
      return this.profileForm.controls[field].hasError('required') || this.profileForm.controls[field].hasError('whitespace') ? 'enter_a_value' : this.profileForm.controls[field].hasError('pattern') ? 'invalid_url' : '';
    } else if (field === 'university_avatar') {
      return this.profileForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    } else if (field === 'organization') {
      return this.profileForm.controls[field].hasError('required') || this.profileForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    }
  }

  changeDateEvent(e) {
    this.userForm.controls['dob'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  editProfile(formData) {
    this.errorMsg = '';
    if (this.profileForm.pristine && !this.profileForm.touched) {
      this.common.openSnackBar('no_changes_made', 'Close');
      return false;
    }
    if (this.profileForm.valid) {
      this.process = true;
      this.apiService.updateUserProfile(formData).subscribe(
        data => {
          this.getProfile();
          this.apiService.user.university_avatar = data['university_avatar'];
          localStorage.setItem('stud_org_logo', data['university_avatar']);
          this.errorMsg = '';
          this.apiService.getUser();
          if (this.apiService.userType === '3' || this.apiService.userType === '0' || this.apiService.userType === '5' || this.apiService.userType === '9') {
            this.common.openSnackBar('company_updated', 'Close');
          } else {
            this.common.openSnackBar('university_updated', 'Close');
          }
          this.process = false;
        },
        err => {
          this.process = false;
          if (err.error && err.error.detail) {
            this.errorMsg = err.error.detail;
          } else {
            const errArr = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
                this.errorMsgArr[key] = err.error[key][0];
              }
            }
            this.errorMsg = 'provide_valid_inputs';
          }
        }
      );
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  updateUser(formData) {
    this.errorMsgUser = '';
    if (this.userForm.pristine && !this.userForm.touched) {
      this.common.openSnackBar('no_changes_made', 'Close');
      return false;
    }
    if (this.userForm.valid) {
      this.processUserInfo = true;
      this.apiService.updateUser(formData).subscribe(
        data => {
          this.processUserInfo = false;
          this.errorMsgUser = '';
          this.apiService.getUser();
          this.common.openSnackBar('basic_info_updated_successfully', 'Close');
        },
        err => {
          this.processUserInfo = false;
          if (err.error && err.error.detail) {
            this.errorMsgUser = err.error.detail;
          } else {
            const errArr = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
                this.errorMsgArr[key] = err.error[key][0];
              }
            }
            this.errorMsgUser = (errArr.length !== 0) ? errArr[0][0] : err.error;
          }
        }
      );
    } else {
      this.errorMsgUser = 'provide_valid_inputs';
    }
  }

  submitAccessForm(formData) {
    this.erroraccessMsg = '';
    if (!this.genAccessForm.invalid) {
      this.apiService.updateAccessDetails(formData).subscribe(
        data => {
          this.common.openSnackBar('access_privilege_updated', 'Close');
        },
        err => {
          // console.log(err);
        }
      );
    } else {
      this.erroraccessMsg = 'error';
    }
  }

  getOrgDocList() {
    this.getOrgDocListSubscribtion = this.apiService.getOrgDocFile().subscribe(data => {
      this.resOrgDocLists = data;
      if (this.resOrgDocLists) {
        this.orgDocLists = this.resOrgDocLists.userfiles;
      }
    });
  }

  deleteOrgDoc(orgDocID, index) {
    this.apiService.deleteOrgDocFile(orgDocID).subscribe(data => {
      this.orgDocLists.splice(index, 1);
    });
  }

  uploadOrgDoc(e) {
    if (this.selectedFilesOrgDoc.length > 0) {
      this.popuptransferfile = e;
      this.ngxSmartModalService.getModal('alertfileupload').open();
      return false;
    }
    this.selectedFilesOrgDoc = [];
    this.orgFileUploadForm = [];
    this.dummyselectedFilesOrgDoc = [];
    this.errorMsgArr['orgfiles'] = '';
    const allowedExtensions = ['doc', 'docx', 'xls', 'xlsx', 'csv', 'pdf', 'jpg', 'jpeg', 'png'];
    this.errormessgae = '';
    var err = [];
    var fileLength;
    // var formData: FormData = new FormData();
    let formData = Array.prototype.reduce.call(
      e.target.files,
      function (formData, file, i) {
        const fileName = file.name;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
          if (file.size <= 10000000) {
            formData.append('file' + '[' + i + ']', file);
            formData.append('name' + '[' + i + ']', file.name);
            return formData;
          } else {
            err[i] = file.name + ' - file size is more than 10MB';
            return formData;
          }
        } else {
          err[i] = fileName + ' - invalid file format';
          return formData;
        }
      },
      new FormData()
    );
    var errArr = err.filter(function (item) { return item !== ''; });
    this.uploadfileLength = fileLength;
    if (errArr.toString() !== '') {
      this.common.openSnackBar(errArr.toString(), 'Close');
    }
    if (formData) {
      this.orgFileUploadForm = formData;
      this.orgFileUploadForm.forEach((x, index) => {
        if (typeof x !== 'string') {
          this.selectedFilesOrgDoc.push(x.name);
          this.dummyselectedFilesOrgDoc.push(x.name);
        }
      });
    }
    e.target.value = '';
  }

  deleteOrgDocSelect(name) {
    const formdataindex = this.dummyselectedFilesOrgDoc.indexOf(name);
    const index = this.selectedFilesOrgDoc.indexOf(name);
    this.selectedFilesOrgDoc.splice(index, 1);
    this.orgFileUploadFormOr.splice(index, 1);
    this.orgFileUploadForm.delete('file' + '[' + formdataindex + ']');
    this.orgFileUploadForm.delete('name' + '[' + formdataindex + ']');
  }

  submitOrgDoc() {
    if (this.selectedFilesOrgDoc.length > 0) {
      this.apiService.uploadMultipleFile(this.orgFileUploadForm).subscribe(data => {
        this.resOrgDocLists = data;
        if (this.resOrgDocLists) {
          this.orgDocLists = this.resOrgDocLists.userfiles;
          this.selectedFilesOrgDoc = [];
          this.orgFileUploadForm = [];
          this.common.openSnackBar('file_upload_successful', 'Close');
        }
      });
    } else {
      this.common.openSnackBar('please_select_atleast_one_file', 'Close');
    }
  }

  deleteOrgImage() {
    this.profile.university_avatar_comp = '';
    this.profileForm.controls['university_avatar'].setValue(null);
    this.profileForm.markAsTouched();
  }
  deleteProfileImage() {
    this.user.profile_details.avatar = '';
    this.userForm.controls['avatar'].setValue(null);
    this.userForm.markAsTouched();
  }
  uploadFile(e) {
    this.errorMsg = '';
    this.errorMsgArr['avatar'] = '';
    this.profilePic = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.profilePic.append('file', file, file.name);
        this.profilePic.append('user', this.apiService.user.id);
        this.apiService.uploadFile(this.profilePic).subscribe(data => {
          this.user.profile_details.avatar = data['file_url'];
          this.userForm.controls['avatar'].setValue(data['file_url']);
          this.userForm.markAsTouched();
          this.profilePic = new FormData();
        });
      } else {
        this.user.avatar = '';
        this.errorMsgArr['avatar'] = 'file_size_more';
      }
    } else {
      this.user.avatar = '';
      this.errorMsgArr['avatar'] = 'invalid_file_format';
    }
    e.target.value = '';
  }

  uploadUniversityLogo(e, toplog = '') {
    this.errorMsg = '';
    this.errorMsgArr['university_avatar'] = '';
    this.errorMsgArr['top_logo'] = '';
    this.profilePic = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.profilePic.append('file', file, file.name);
        this.profilePic.append('user', this.apiService.user.id);
        this.apiService.uploadFile(this.profilePic).subscribe(data => {
          if (toplog === '') {
            this.profile.university_avatar_comp = data['file_url'];
            this.profileForm.controls['university_avatar'].setValue(data['file_url']);
          } else {
            this.profile.top_logo = data['file_url'];
            this.profileForm.controls['top_logo'].setValue(data['file_url']);
          }
          this.profileForm.markAsTouched();
          this.profilePic = new FormData();
        });
      } else {
        // this.errorMsg = 'error';
        if (toplog === '') {
          this.profileForm.controls['university_avatar'].setValue(null);
          this.profile.university_avatar_comp = '';
          this.errorMsgArr['university_avatar'] = 'file_size_more';
        } else {
          this.profileForm.controls['top_logo'].setValue(null);
          this.profile.top_logo = '';
          this.errorMsgArr['top_logo'] = 'file_size_more';
        }
      }
    } else {
      // this.errorMsg = 'error';
      if (toplog === '') {
        this.profileForm.controls['university_avatar'].setValue(null);
        this.profile.university_avatar_comp = '';
        this.errorMsgArr['university_avatar'] = 'invalid_file_format';
      } else {
        this.profileForm.controls['top_logo'].setValue(null);
        this.profile.top_logo = '';
        this.errorMsgArr['top_logo'] = 'invalid_file_format';
      }
    }
    e.target.value = '';
  }

  deleteReportImage(which = 'logo') {
    if (which === 'logo') {
      this.profile.sep_report_logo = '';
      this.reportForm.controls['sep_report_logo'].setValue(null);
      this.reportForm.markAsTouched();
      this.logoBgChangeEnable(this.reportForm.controls['is_sep_report_org_logo'].value);
    } else if (which === 'favicon') {
      this.profile.sep_report_favicon = '';
      this.reportForm.controls['sep_report_favicon'].setValue(null);
      this.reportForm.markAsTouched();
    }
  }

  logoBgChangeEnable(checked) {
    if (checked) {
      this.reportForm.controls['sep_report_logo'].setValidators([Validators.required]);
      this.reportForm.controls['sep_report_logo'].setValue(this.profile.sep_report_logo);
      this.reportForm.controls['sep_report_logo'].updateValueAndValidity();
    } else {
      this.reportForm.controls['sep_report_logo'].setValidators([]);
      this.reportForm.controls['sep_report_logo'].setValue(this.profile.sep_report_logo);
      this.reportForm.controls['sep_report_logo'].updateValueAndValidity();
    }
  }

  uploadReportImage(e, which = 'logo') {
    this.reportErrorMsg = '';
    this.errorMsgArrReport['sep_report_logo'] = '';
    this.errorMsgArrReport['sep_report_favicon'] = '';
    this.profilePic = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = which === 'logo' ? ['jpg', 'jpeg', 'png'] : ['ico'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.profilePic.append('file', file, file.name);
        this.profilePic.append('user', this.apiService.user.id);
        this.apiService.uploadFile(this.profilePic).subscribe(data => {
          if (which === 'logo') {
            this.profile.sep_report_logo = data['file_url'];
            this.reportForm.controls['sep_report_logo'].setValue(data['file_url']);
          } else if (which === 'favicon') {
            this.profile.sep_report_favicon = data['file_url'];
            this.reportForm.controls['sep_report_favicon'].setValue(data['file_url']);
          }
          this.reportForm.markAsTouched();
          this.profilePic = new FormData();
        });
      } else {
        this.reportErrorMsg = 'error';
        if (which === 'logo') {
          this.reportForm.controls['sep_report_logo'].setValue(null);
          this.profile.sep_report_logo = '';
          this.errorMsgArrReport['sep_report_logo'] = 'file_size_more';
        } else if (which === 'favicon') {
          this.reportForm.controls['sep_report_favicon'].setValue(null);
          this.profile.sep_report_favicon = '';
          this.errorMsgArrReport['sep_report_favicon'] = 'file_size_more';
        }
      }
    } else {
      this.reportErrorMsg = 'error';
      if (which === 'logo') {
        this.reportForm.controls['sep_report_logo'].setValue(null);
        this.profile.sep_report_logo = '';
        this.errorMsgArrReport['sep_report_logo'] = 'invalid_file_format';
      } else if (which === 'favicon') {
        this.reportForm.controls['sep_report_favicon'].setValue(null);
        this.profile.sep_report_favicon = '';
        this.errorMsgArrReport['sep_report_favicon'] = 'invalid_file_format';
      }
    }
    e.target.value = '';
  }

  getLanguages() {
    this.getLanguagesSubscribtion = this.apiService.getLanguage().subscribe(data => {
      this.languages = data;
      this.getLangList();
    });
  }

  updateLang(lang) {
    const obj = { uni_language: lang.id };
    this.selectedLang = lang.language_code;
    this.apiService.updateLang(obj).subscribe(data => {
      // console.log(data);
    });
  }

  refreshDobDate() {
    this.userForm.controls['dob'].setValue(null);
    this.userForm.markAsTouched();
    return false;
  }

  submitSendbox(formData) {
    this.errorsendBoxMsg = '';
    if (!this.sendboxForm.invalid) {
      this.apiService.updateSandBox(formData).subscribe(
        data => {
          this.getProfile();
          this.apiService.getUser();
          this.common.openSnackBar('sandbox_updated', 'Close');
        },
        err => {
          this.errorsendBoxMsg = 'error';
          if (err.error && err.error.detail) {
            this.errorMsgArrSendBox = err.error.detail;
          } else {
            const errArr = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
                this.errorMsgArrSendBox[key] = err.error[key][0];
              }
            }
          }
        }
      );
    } else {
      this.errorsendBoxMsg = 'error';
    }
  }

  submitAchTestMode(formData) {
    this.apiService.updateAchTestMode(formData).subscribe(
      data => {
        this.getProfile();
        this.apiService.getUser();
        this.common.openSnackBar('ach_test_mode_updated', 'Close');
      },
      err => {
        // console.log(err);
      }
    );
  }

  getErrorSandboxMessage(field) {
    return this.sendboxForm.controls[field].hasError('required')
      || this.sendboxForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.sendboxForm.controls[field].hasError('email') ? 'not_valid_email' : '';
  }

  sandBoxFieldEnable(checked, manually = false) {
    if (checked) {
      this.viewEmailField = true;
      this.sendboxForm.controls['sandbox_email'].setValidators([Validators.required, Validators.email, this.noWhitespaceValidator]);
      this.sendboxForm.controls['sandbox_email'].updateValueAndValidity();
    } else {
      if (this.userDetails.profile_details.workflow_testmode_status && manually === true) {
        this.ngxSmartModalService.getModal('sandBoxNotification').open();
        return false;
      } else {
        this.viewEmailField = false;
        this.sendboxForm.controls['sandbox_email'].setValidators([]);
        this.sendboxForm.controls['sandbox_email'].updateValueAndValidity();
      }
    }
  }

  submitSmtpMail(formData) {
    this.errorSmtpMsg = '';
    if (!this.smtpmailForm.invalid) {
      this.apiService.updateSmtpMail(formData).subscribe(
        data => {
          this.getProfile();
          this.apiService.getUser();
          this.common.openSnackBar('smtp_updated', 'Close');
        },
        err => {
          // console.log(err);
        }
      );
    } else {
      this.errorSmtpMsg = 'error';
    }
  }

  getErrorSmtpMessage(field) {
    return this.smtpmailForm.controls[field].hasError('required')
      || this.smtpmailForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.smtpmailForm.controls[field].hasError('email') ? 'not_valid_email' :
        this.smtpmailForm.controls[field].hasError('pattern') ? 'enter_only_number' : '';
  }

  enableSmtpField(checked) {
    if (checked) {
      this.viewSmtpField = true;
      this.smtpmailForm.controls['email_host'].setValidators([Validators.required]);
      this.smtpmailForm.controls['email_host_user'].setValidators([Validators.required]);
      this.smtpmailForm.controls['email_host_password'].setValidators([Validators.required]);
      this.smtpmailForm.controls['email_port'].setValidators([Validators.required, this.noWhitespaceValidator, Validators.pattern(/^-?([0-9]\d*)?$/)]);
      this.smtpmailForm.updateValueAndValidity();
    } else {
      this.viewSmtpField = false;
      this.smtpmailForm.controls['email_host'].setValidators([]);
      this.smtpmailForm.controls['email_host_user'].setValidators([]);
      this.smtpmailForm.controls['email_host_password'].setValidators([]);
      this.smtpmailForm.controls['email_port'].setValidators([]);
      this.smtpmailForm.updateValueAndValidity();
    }
  }

  onCopiedSuccess() {
    this.common.openSnackBar('embed_code_copied', 'Close');
  }

  onClickOk() {
    this.selectedFilesOrgDoc = [];
    this.ngxSmartModalService.getModal('alertfileupload').close();
    this.uploadOrgDoc(this.popuptransferfile);
  }

  onClosePopup() {
    this.ngxSmartModalService.getModal('alertfileupload').close();
  }

  sandBoxClickOk() {
    this.sendboxForm.controls['sandbox'].setValue(true);
    this.profile.sandbox = true;
    this.ngxSmartModalService.getModal('sandBoxNotification').close();
  }

  ngOnDestroy() {
    if (this.getLanguagesSubscribtion) {
      this.getLanguagesSubscribtion.unsubscribe();
    }
    if (this.getOrgDocListSubscribtion) {
      this.getOrgDocListSubscribtion.unsubscribe();
    }
    if (this.getWorkflowListSubscribtion) {
      this.getWorkflowListSubscribtion.unsubscribe();
    }
    if (this.getProductListSubscribtion) {
      this.getProductListSubscribtion.unsubscribe();
    }
    if (this.getEducationListSubscribtion) {
      this.getEducationListSubscribtion.unsubscribe();
    }
    if (this.getUserBlockSubscribtion) {
      this.getUserBlockSubscribtion.unsubscribe();
    }
  }

}


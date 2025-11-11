/*
 * File : new-assign.component.ts
 * Use: Issued the certificate the student
 * Copyright : vottun 2019
 */
import { Component, OnInit, ChangeDetectorRef, Inject, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
import { environment as env } from '../../../environments/environment';
import { StudentService } from '../services/student.service';
import { TooltipPosition } from '@angular/material';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/platform-browser';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PostConfirmationComponent } from '../post-confirmation/post-confirmation.component';
import { MatDialog } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';
@Component({
  selector: 'app-new-assign',
  templateUrl: './new-assign.component.html',
  styleUrls: ['./new-assign.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    // { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class NewAssignComponent implements OnInit, OnDestroy {
  groupnameinput: any = '';
  filteredOptions: any = [];
  groupOptions: any = [];
  myControl = new FormControl();
  getGroupListSubscription: any;
  search = '';

  certBadgeInput: any = '';
  certBadgeFilteredOptions: any = [];
  certBadgeOptions: any = [];
  certBadgeMycontrol = new FormControl();
  certBadgeSubscription: any;
  certBadgeSearch = '';
  certBadgeTitle = '';

  studentNameInput: any = '';
  studentNameFilteredOptions: any = [];
  studentNameOptions: any = [];
  studentNameMycontrol = new FormControl();
  studentNameSubscription: any;
  studentNameSearch = '';
  studentNameTitle = '';

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;
  searchGroupStud: FormGroup;
  searchStudForm: FormGroup;
  onSearchCertCourse; FormGroup;
  responseData: any = {
    'error_detail': '',
    'fail_count': ''
  };
  baseUrl = env.baseUrl;
  errorMsg: string;
  errorMsgArr = [];
  process = false;
  courseslists: any = [];
  filterCourse: any = [];
  certificatelists: any = [];
  filterCert: any = [];
  studentList: any = [];
  filterStudent: any = [];
  certificateModel: any = {
    is_certificate: true,
    title: '',
    degree: '',
    code: '',
    description: '',
    criteria: '',
    logo: '',
    is_active: true,
    business_unit: '',
    badges: '',
    courses: ''
  };
  coursesArray: any = [];
  coursestring: string;
  certificateLogo = new FormData();
  submitted = false;
  imageUploading = false;
  public options: Object = {
    placeholderText: '',
    height: '250'
  };
  disableFirstNext = true;
  disablestep2button = true;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  expireAction = [
    { 'id': '1', 'text': 'no_actions' },
    { 'id': '2', 'text': 'invalidate_cert' },
    { 'id': '3', 'text': 'delete_cert' },
    { 'id': '4', 'text': 'notify' }
  ];
  minendDate: any;
  countTimeLength: any;
  countTime = 3000; // 3sec
  processingtxt = 'posting_activity_to_the_digital';
  isSelectCert = true;
  relatedCert = false;
  resRelatedCert: any;
  relatedCertLists: any = [];
  relatedSelected = true;
  formcourse = '';
  /** Scroll course & Certificate */
  no_page: number;
  sum = 10;
  inc_page = 1;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  default_page = 1;
  start_no = 0;
  loading = false;
  /** Scroll course & Certificate */
  /** Scroll course & Certificate */
  course_no_page: number;
  course_sum = 10;
  course_inc_page = 1;
  course_throttle = 300;
  course_scrollDistance = 1;
  course_scrollUpDistance = 2;
  course_default_page = 1;
  course_start_no = 0;
  course_loading = false;
  /** Scroll course & Certificate */
  /** Scroll student */
  stud_no_page: number;
  stud_sum = 10;
  stud_inc_page = 1;
  stud_throttle = 300;
  stud_scrollDistance = 1;
  stud_scrollUpDistance = 0;
  stud_default_page = 1;
  stud_start_no = 0;
  stud_loading = false;
  /** Scroll student */
  initialFilterCourse: any = [];
  initialFilterCert: any = [];
  checkall: boolean;
  allselect: any = true;
  changeStudentArr: any;
  groupNamePara: any = 'group_name=';
  reachedEnd = false;
  displayError: any = [];
  displayStudent: any = [];
  selectedStudent: any = [];
  displaySelectedStud: any = [];
  displaySelectedStudString: any = '';
  dummyGroup: any = '';
  indivualSearch = '';
  searchStudIndiv: FormGroup;
  redirectWithId = localStorage.getItem('redirectWithID') && localStorage.getItem('redirectWithID') != null ? localStorage.getItem('redirectWithID') : '';
  adminEmailRes: any = [];
  errorMsgSearchCC = '';
  formArray: any = [];
  tabselection: any = 0;
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
  groupSearchValue = '';
  isLoadingStudSearch = false;
  blockchainList: any = [];
  defaultBlockchainVal: any = {
    'key_number': '',
    'test': false
  };
  confirmCationOpen = false;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  testMode: any = this.userDetails.profile_details.test_mode;
  walletDetails: any;
  certRate = 0;
  badgeRate = 0;
  cannedDatas: any = [];
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    public apiService: ApiService,
    private certificateService: CertificateService,
    private common: CommonService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private stdService: StudentService,
    private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private myElement: ElementRef,
    public ngxSmartModalService: NgxSmartModalService,
    private dialog: MatDialog,
    public certService: CertificateService,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
  ) {
    this.searchStudIndiv = this.formbuilder.group({
      'stud_search_input': [false]
    });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(group_name => group_name ? this._filter(group_name) : this.groupOptions.slice())
      );

    this.certBadgeFilteredOptions = this.certBadgeMycontrol.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(title => title ? this._certBadgeFilter(title) : this.certBadgeOptions.slice())
      );

    this.studentNameFilteredOptions = this.studentNameMycontrol.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(name => name ? this._studentNameFilter(name) : this.studentNameOptions.slice())
      );

    // this.locale = 'fr';
    // this.adapter.setLocale(this.locale);
  }

  displayFn(data: any) {
    return data != null && data.group_name ? data.group_name : data;
  }

  displayTitleFn(data: any) {
    return data != null && data.title ? data.title : data;
  }

  displayStudentNameFn(data: any) {
    return data != null && data.name ? data.name : data;
  }

  private _certBadgeFilter(title) {
    return this.certBadgeOptions.filter(option => option.title.toLowerCase().indexOf(title) === 0);
  }

  private _studentNameFilter(name) {
    return this.studentNameOptions.filter(option => option.name.toLowerCase().indexOf(name) === 0);
  }

  private _filter(group_name) {
    return this.groupOptions.filter(option => option.group_name.toLowerCase().indexOf(group_name) === 0);
  }
  /**
   * @description - intially call the functions and create the forms
   */
  ngOnInit() {
    this.checkall = false;
    this.allselect = false;
    this.getGroupData();
    this.getCertBadgeData();
    this.getStudentNameData();
    this.getCourses();
    this.getCertificates();
    this.getStudentList();
    this.getCannedMsgList();
    this.apiService.getWalletReturn().subscribe(res => {
      this.walletDetails = res;
      this.certRate = this.walletDetails.count.cer_amount;
      this.badgeRate = this.walletDetails.count.digi_amount;
      if (this.walletDetails.count.remaining_wallet < 10 && !this.testMode) {
        this.ngxSmartModalService.getModal('planPopupInfo').open();
      }
      if (this.apiService.userType === '4' && !this.apiService.pages.issue_certificate) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
      if (!this.apiService.userVerified && this.apiService.user.profile_details.has_subscription) {
        this.ngxSmartModalService.getModal('userVerifyPopup').open();
      }
      if (this.testMode || (this.walletDetails.count.remaining_wallet >= 1 && !this.testMode)) {
        this.getUserBlockChainList();
      }
    });
    this.firstFormGroup = this._formBuilder.group({
      course: [''],
      certificate: [''],
      relatedcert: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      students: ['']
    });
    this.threeFormGroup = this._formBuilder.group({
      'certificate': [null],
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
      'social_media_sharing': '1',
      'evidence': this.formbuilder.array([this.initNqCoordinators()]),
      'testcheck': false,
      'blockchain_key': [null, Validators.compose([Validators.required])],
      'achievement_mail_id': [null, Validators.compose([Validators.required])]
    });

    this.searchGroupStud = this.formbuilder.group({
      'group_name': ['']
    });

    this.searchStudForm = this.formbuilder.group({
      'student_name': ['']
    });

    this.onSearchCertCourse = this.formbuilder.group({
      'searchCertCourse': ['']
    });
  }

  getinputgroupname(inputVal) {
    this.groupnameinput = inputVal;
  }

  getGroupData() {
    this.getGroupListSubscription = this.stdService.getAutoGroupList().subscribe(data => {
      this.groupOptions = data;
    });
  }

  getCertBadgeData() {
    this.certBadgeSubscription = this.stdService.getCertBadgeList().subscribe(data => {
      this.certBadgeOptions = data;
    });
  }

  getStudentNameData() {
    // this.studentNameOptions = [
    //   { id: 1, name: 'ananth1' },
    //   { id: 2, name: 'ananth2' },
    //   { id: 3, name: 'ananth3' },
    //   { id: 4, name: 'ananth4' }
    // ];
    this.studentNameSubscription = this.stdService.getStudentNameList().subscribe(data => {
      console.log(data);
      this.studentNameOptions = data;
    });
  }

  getCannedMsgList() {
    this.certService.getCannedMessageAll().subscribe(res => {
      this.cannedDatas = res;
      console.log(this.cannedDatas);

      var setValue = this.cannedDatas;
      const dataRemoved = setValue.filter((el) => {
        return el.mail_type !== '5' && el.mail_type !== '6';
      });
      this.cannedDatas = [];
      if (dataRemoved && dataRemoved.length > 0) {
        this.cannedDatas = dataRemoved;
      } else {
        this.cannedDatas = [];
      }
    });
  }
  /**
   * @description - Stepper previous and next button diable and enable option
   */
  redirectToPreviousPage() {
    if (this.apiService.previousUrl !== '/') {
      if (this.redirectWithId !== '') {
        if (localStorage.getItem('redirectFrom') === 'list') {
          this.router.navigate([this.apiService.previousUrl]);
        } else if (localStorage.getItem('redirectWhich') === 'cert') {
          this.isSelectCert = true;
          if (localStorage.getItem('redirectwhichcert') === 'customcert' && localStorage.getItem('redirectwhichcert') != null) {
            this.router.navigate(['customcertificateedit', this.redirectWithId]);
          } else {
            this.router.navigate(['certificateadd', this.redirectWithId]);
          }
        } else {
          this.isSelectCert = false;
          this.router.navigate(['courseadd', this.redirectWithId]);
        }
      } else {
        if (localStorage.getItem('redirectFrom') === 'list') {
          this.router.navigate([this.apiService.previousUrl]);
        } else if (localStorage.getItem('redirectWhich') === 'cert' || localStorage.getItem('redirectWhich') === 'course') {
          this.router.navigate(['issuecertificate']);
        } else {
          this.router.navigate(['issuecertificate']);
        }
      }
    } else {
      this.router.navigate(['issuecertificate']);
    }
  }
  /**
   * @description find the student select option
   * @param value - selected student id 
   * @param isChecked - fine checked or not
   * @param select - for next step trigger functionality
   */
  onChangeStudent(value: string, isChecked: boolean, select = false) {
    this.allselect = false;
    if (isChecked) {
      this.coursesArray.push(value);
      if (this.coursesArray.length === this.filterStudent.length) {
        this.allselect = true;
      } else {
        this.allselect = false;
      }
      const realVal = this.filterStudent.find(x => x.id === value);
      const realIndexSelect = this.filterStudent.indexOf(realVal);
      this.selectedStudent.push(this.filterStudent[realIndexSelect]);
      const selectstudVal = this.selectedStudent.find(x => x.id === value);
      const selectStudIndex = this.selectedStudent.indexOf(selectstudVal);
      this.selectedStudent[selectStudIndex].selected = true;
    } else {
      this.allselect = false;
      this.searchStudIndiv.controls['stud_search_input'].setValue(false);
      const courseVal = this.coursesArray.find(x => x === value);
      const realVal = this.filterStudent.find(x => x.id === value);
      const selectstudVal = this.selectedStudent.find(x => x.id === value);
      const realIndex = this.filterStudent.indexOf(realVal);
      const selectStudIndex = this.selectedStudent.indexOf(selectstudVal);
      this.filterStudent[realIndex].selected = false;
      const index = this.coursesArray.indexOf(courseVal);
      this.coursesArray.splice(index, 1);
      this.selectedStudent.splice(selectStudIndex, 1);
      if (this.coursesArray.length === this.filterStudent.length) {
        this.allselect = true;
      } else {
        this.allselect = false;
      }
    }
    this.displayNotifyStud();
    this.countTimeLength = this.coursesArray.length;
    this.disablestep3ButtonFun(this.coursesArray);
    if (this.coursesArray.length === 0 && select) {
      const element: HTMLElement = document.getElementsByClassName('backtostep2')[0] as HTMLElement;
      element.click();
    }
  }

  getUserBlockChainList() {
    console.log('hiiii');
    this.certificateService.getBlockChainList().subscribe(data => {
      this.blockchainList = data;
      console.log(this.blockchainList);
      this.defaultBlockchainVal = this.blockchainList.find(x => x.is_default === 'true');
      console.log(this.defaultBlockchainVal);
      if (typeof this.defaultBlockchainVal != 'undefined' && this.defaultBlockchainVal.test) {
        this.confirmCationOpen = false;
      } else {
        this.confirmCationOpen = true;
      }
      console.log(this.defaultBlockchainVal);
      console.log(typeof this.defaultBlockchainVal != 'undefined' ? this.defaultBlockchainVal.key_number : null);
      this.threeFormGroup.controls['blockchain_key'].setValue(typeof this.defaultBlockchainVal != 'undefined' && typeof this.defaultBlockchainVal.key_number != 'undefined' ? this.defaultBlockchainVal.key_number : null);
      this.threeFormGroup.controls['blockchain_key'].updateValueAndValidity();
    });
  }

  getAdminMailAddressNotify() {
    this.apiService.getAdminMailNotify().subscribe(data => {
      this.adminEmailRes = data;
    });
  }
  /**
   * @description - select student arrays convert to the string
   */
  displayNotifyStud() {
    this.displaySelectedStud = [];
    this.displaySelectedStudString = '';
    this.selectedStudent.forEach(data => {
      this.displaySelectedStud.push(data.email);
    });
    if (this.apiService.user.email !== '') {
      this.displaySelectedStud.push([this.apiService.user.email ? this.apiService.user.email : '']);
    }
    this.displaySelectedStudString = this.displaySelectedStud.toString();
    this.threeFormGroup.controls['expiry_text'].setValue(this.displaySelectedStudString);
  }
  /**
   * @description - Stepper previous and next button diable and enable option
   * @param coursesArray - selected course data
   */
  disablestep3ButtonFun(coursesArray) {
    this.coursestring = coursesArray.toString();
    this.threeFormGroup.controls['students'].setValue(this.coursestring);
    if (this.coursestring !== '') {
      this.disablestep2button = false;
    } else {
      this.disablestep2button = true;
    }
  }

  courseSelection(val, relatedCert = false) {
    this.isSelectCert = false;
  }

  certiSelection(val) {
    this.isSelectCert = true;
  }
  /**
   * @description using this function for related certificate selection
   * @param id - certificate id set to the form field dynamically
   * @param type (course or certificate)
   */
  getcertificateId(id, type) {
    if (type === 'course') {
      this.relatedCert = true;
      this.disableFirstNext = false;
      this.firstFormGroup.controls['certificate'].reset();
      this.relatedCertificateList(id);
    } else {
      this.relatedCert = false;
      this.disableFirstNext = false;
      this.formcourse = '';
      this.firstFormGroup.controls['course'].reset();
      this.firstFormGroup.controls['relatedcert'].reset();
    }
    this.threeFormGroup.controls['certificate'].setValue(id);
  }
  /**
   * @description - Getting related certificate based on the course selection
   * @param courseId - course id
   */
  relatedCertificateList(courseId) {
    const params = {
      'crs_id': courseId
    };
    this.certificateService.getRelatedCertificateList(params).subscribe(res => {
      this.resRelatedCert = res;
      if (this.resRelatedCert.certificates.length > 0) {
        this.relatedCertLists = this.resRelatedCert.certificates;
        if (this.isSelectCert && this.redirectWithId) {
          this.relatedCert = true;
          this.ngxSmartModalService.getModal('relatedCertPopup').open();
        }
      } else {
        this.relatedCertLists = [];
      }
    });
  }
  /**
   * @description - Supporting function for related certificate selection
   * @param relatedCertId - Selected related certificate id
   */
  getrelatedcertId(relatedCertId) {
    this.formcourse = relatedCertId;
  }
  /**
   * @description - Evidence field URL validation
   */
  initNqCoordinators() {
    return this.formbuilder.group({
      'evid': ['', Validators.compose([Validators.pattern('https?://.+')])],
      'lable': ['']
    });
  }
  /**
   * @description - set the mindate to the end date field
   * @param date - start date field value
   */
  onStartDateChange(date) {
    this.minendDate = moment(date).add(1, 'day').format('YYYY-MM-DD');
  }
  /**
   * @description - function using for refresh date field
   * @param field - date field value
   */
  refreshIssueDate(field) {
    if (field === 1) {
      this.threeFormGroup.controls['issue_date'].setValue(null);
    } else if (field === 2) {
      this.threeFormGroup.controls['end_validity'].setValue(null);
      this.threeFormGroup.controls['expiry_actions'].setValue(null);
    } else if (field === 3) {
      this.threeFormGroup.controls['start_date'].setValue(null);
    } else if (field === 4) {
      this.threeFormGroup.controls['end_date'].setValue(null);
    }
    this.threeFormGroup.markAsTouched();
  }
  /**
   * @description - Dynamically add the evidence in the form array
   */
  addEvidence() {
    const control = <FormArray>this.threeFormGroup.controls['evidence'];
    control.push(this.initNqCoordinators());
  }
  /**
   * @description - Function using for evidence remove option
   * @param index - selected evidence index value
   */
  removeEvidence(index) {
    if (index !== 0) {
      const control = <FormArray>this.threeFormGroup.controls['evidence'];
      control.removeAt(index);
    } else {
      const control = <FormArray>this.threeFormGroup.controls['evidence'];
      control.reset();
      const controllabel = <FormArray>this.threeFormGroup.controls['evidence_lable'];
      controllabel.reset();
    }
  }
  /**
   * @description - Student list getting based scroll
   */
  onScrollDownStud() {
    this.stud_inc_page += 1;
    this.stud_start_no = this.stud_sum + 1;
    this.stud_sum += 6;
    this.stud_default_page = this.stud_inc_page;
    if (this.stud_inc_page <= this.stud_no_page) {
      this.reachedEnd = false;
      this.getStudentList();
    } else {
      this.reachedEnd = true;
    }
  }
  /**
   * @description - search student based on group name and reset the checkbox option
   * @param formdata - search form value
   */
  addGroupForm(formdata) {
    console.log(formdata);
    this.studentList = [];
    this.filterStudent = this.studentList;
    const params = new URLSearchParams();
    console.log(formdata);
    var searchData = [];
    if (typeof formdata.group_name === 'object') {
      searchData['group_name'] = formdata.group_name.group_name;
      this.groupSearchValue = formdata.group_name.group_name;
    } else {
      searchData['group_name'] = this.groupnameinput;
      this.groupSearchValue = this.groupnameinput;
    }
    searchData['search'] = this.indivualSearch != '' ? this.indivualSearch.toLowerCase() : '';
    for (const key in searchData) {
      if (formdata[key]) {
        params.set(key, formdata[key]);
      }
    }
    console.log(params);
    this.groupNamePara = params.toString();
    this.dummyGroup = params.toString();
    this.stud_default_page = 1;
    this.stud_inc_page = 1;
    this.changeStudentArr = [];
    this.onSearchStud('', 'search', 'group');
    this.resetSelectCheck();
  }
  /**
   * @description - reset the group search form field and functionality
   */
  resetGroupForm() {
    this.allselect = false;
    this.searchGroupStud.controls['group_name'].setValue('');
    this.searchStudForm.controls['student_name'].setValue('');
    this.studentList = [];
    this.filterStudent = this.studentList;
    this.groupNamePara = 'group_name=';
    this.dummyGroup = 'group_name=';
    this.groupSearchValue = '';
    this.indivualSearch = '';
    this.stud_default_page = 1;
    this.stud_inc_page = 1;
    this.changeStudentArr = [];
    this.getStudentList();
    this.resetSelectCheck();
  }
  /**
   * @description - get student list from api
   */
  getStudentList() {
    this.isLoadingStudSearch = true;
    this.stdService.getStudentScroll(this.groupNamePara, this.stud_default_page).subscribe(data => {
      this.studentList = data;
      this.isLoadingStudSearch = false;
      this.stud_no_page = Math.ceil(this.studentList.count / 6);
      if (this.checkall) {
        this.studentList.results.map(item => {
          item['selected'] = true;
          return item;
        }).forEach(item => {
          this.filterStudent.push(item);
          this.selectedStudent.push(item);
          this.coursesArray = [];
          this.filterStudent.forEach(row => {
            this.coursesArray.push(row.id);
          });
        });
        this.changeStudentArr = this.filterStudent;
      } else {
        this.studentList.results.map(item => {
          item['selected'] = false;
          return item;
        }).forEach(item =>
          this.filterStudent.push(item)
        );
        this.changeStudentArr = this.filterStudent;
      }
      this.displayNotifyStud();
    }, err => {
      this.studentList = [];
      this.filterStudent = this.studentList;
    });
  }

  backtostep2Select() {
    this.allselect = false;
    if (this.coursesArray.length === this.filterStudent.length) {
      this.allselect = true;
    } else {
      this.allselect = false;
    }
  }

  assignGroupName(val) {
    this.groupSearchValue = val;
  }

  /**
  * @name onSearchStud
  * @desc search the student based on the input value
  * @param {String} searchStudKeyword search variable
  * @param {boolean} check if check value is search means data's will display
  */
  onSearchStud(searchStudKeyword, check, from = '') {
    if (typeof searchStudKeyword.student_name === 'object') {
      this.indivualSearch = searchStudKeyword.student_name.name.trim();
    } else {
      if (from != 'group') {
        this.indivualSearch = searchStudKeyword.trim();
      }
    }
    if (check === 'search') {
      this.filterStudent = [];
      this.studentList = [];
      this.changeStudentArr = [];

      const params = new URLSearchParams();
      const data = {
        'search': this.indivualSearch != '' ? this.indivualSearch.toLowerCase() : '',
        'group_name': this.groupSearchValue
      };
      for (const key in data) {
        if (data[key]) {
          params.set(key, data[key]);
        }
      }
      this.filterStudent = this.studentList;
      this.groupNamePara = params.toString();
      this.stud_default_page = 1;
      this.stud_inc_page = 1;
      this.getStudentList();
      this.resetSelectCheck();
    }
  }
  // change the selected date format from date picker - start
  changeDateEvent(e) {
    this.threeFormGroup.controls['issue_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  changeendDateEvent(e) {
    this.threeFormGroup.controls['end_validity'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  changeStartDateEvent(e) {
    this.threeFormGroup.controls['start_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  changeEndDateEvent(e) {
    this.threeFormGroup.controls['end_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  /**
   *
   */
  findTestBlockchain(value) {
    const findIndex = this.blockchainList.find(x => x.key_number == value);
    if (findIndex.test) {
      this.confirmCationOpen = false;
    } else {
      this.confirmCationOpen = true;
    }
  }
  /**
   * @description If post blockchain, before submit show confirmation popup
   */
  confirmationPost(addData: any = [], blockChain) {
    if (this.confirmCationOpen) {
      this.formArray = [];
      if (blockChain) {
        this.processingtxt = 'posting_activity_to_the_blockchain';
      }
      this.errorMsg = '';
      this.errorMsgArr = [];
      if (this.threeFormGroup.valid) {
        const dialogRef = this.dialog.open(PostConfirmationComponent, {
          data: {
            amount: {
              'no_of_stud': this.selectedStudent.length,
              'cert': this.isSelectCert,
              'certAmount': this.certRate,
              'badgeAmount': this.badgeRate
            }
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 1) {
            this.submitAssignForm(addData, blockChain);
          }
        });
      } else {
        this.errorMsg = 'provide_valid_inputs';
      }
    } else {
      this.submitAssignForm(addData, blockChain);
    }
  }
  // change the selected date format from date picker - end
  /**
   * @description function using for formatting the form submission values
   * @param addData - form data
   * @param blockChain - find user submit form on blockchain or digital
   */
  submitAssignForm(addData: any = [], blockChain) {
    this.formArray = [];
    if (blockChain) {
      this.processingtxt = 'posting_activity_to_the_blockchain';
    }
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.threeFormGroup.valid) {
      if (this.countTimeLength !== 0 && this.countTimeLength !== '') {
        this.countTime = this.countTimeLength * this.countTime;
      }
      this.process = true;
      const evidString = addData.evidence ? addData.evidence.map(o => o.evid).toString() : '';
      const labelString = addData.evidence ? addData.evidence.map(o => o.lable).toString() : '';
      if (this.redirectWithId !== '') {
        addData['certificate'] = this.redirectWithId;
      }
      addData['evidence'] = evidString;
      addData['evidence_lable'] = labelString;
      addData['post_blockchain'] = blockChain;
      addData['issuer'] = this.apiService.user.id;
      addData['course'] = this.formcourse;
      addData['social_media_sharing'] = addData['social_media_sharing'] == '1' ? true : false;

      const strArray = this.coursesArray;
      const difArr = [];
      var processed = 0;
      for (var i = 0; i < strArray.length; i++) {
        var intRow = {};
        intRow['certificate'] = addData['certificate'] ? addData['certificate'] : null;
        intRow['course'] = addData['course'] ? addData['course'] : null;
        intRow['post_blockchain'] = addData['post_blockchain'];
        intRow['testimonial'] = addData['testimonial'] ? addData['testimonial'] : null;
        intRow['issue_date'] = addData['issue_date'];
        intRow['end_validity'] = addData['end_validity'] ? addData['end_validity'] : null;
        intRow['start_date'] = addData['start_date'] ? addData['start_date'] : null;
        intRow['end_date'] = addData['end_date'] ? addData['end_date'] : null;
        intRow['certificate_number'] = addData['certificate_number'] ? addData['certificate_number'] : null;
        intRow['issuer'] = addData['issuer'] ? addData['issuer'] : null;
        intRow['expiry_actions'] = addData['expiry_actions'] ? addData['expiry_actions'] : null;
        intRow['expiry_text'] = addData['expiry_text'] ? addData['expiry_text'] : null;
        intRow['status'] = addData['status'];
        intRow['social_media_sharing'] = addData['social_media_sharing'];
        intRow['evidence'] = addData['evidence'] ? addData['evidence'] : null;
        intRow['evidence_lable'] = addData['evidence_lable'] ? addData['evidence_lable'] : null;
        intRow['testcheck'] = addData['testcheck'];
        intRow['studentid'] = strArray[i];
        intRow['blockchain_key'] = addData['blockchain_key'];
        intRow['achievement_mail_id'] = addData['achievement_mail_id'];
        difArr.push(intRow);
        if (i === strArray.length - 1) {
          this.apiSubmitFormData(difArr);
        }
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }
  /**
   * @description function using for submit the formdata's to the api and response based display popup window result
   * @param formData - submitted form date
   */
  apiSubmitFormData(formData) {
    this.certificateService.addIssueDetails(formData).subscribe(
      res => {
        // setTimeout(() => {
        this.process = false;
        this.responseData = res;
        if (this.responseData.status === 'Not Completed') {
          this.ngxSmartModalService.getModal('errorMultiUpload').open();
        } else {
          this.ngxSmartModalService.getModal('successMultiUpload').open();
          this.apiService.getWallet();
          this.redirectWithId = '';
          localStorage.removeItem('redirectWithID');
          localStorage.removeItem('redirectFrom');
        }
        // }, this.countTime); // 240000 => 4 minutes , 50000 => 50sec
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else if (err.status === 400) {
          if (err.error.msg === 'Students Have certificate already') {
            localStorage.setItem('errorStud', err.error.students);
            this.router.navigate(['issuecertificate']);
          } else {
            localStorage.setItem('errorStud', '');
          }
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              if (key === 'non_field_errors') {
                this.errorMsg = 'your_balance_is_too_low';
              } else {
                this.errorMsgArr[key] = err.error[key][0];
              }
            }
          }
        } else {
          this.errorMsg = 'some_error_occurred';
        }
      }
    );
  }
  /**
   * dynamic field error message validation functionality
   */
  geterrorMsg(field) {
    if (field === 'blockchain_key') {
      return this.threeFormGroup.controls['blockchain_key'].hasError('required') ? 'please_select_blockchain' : '';
    } else if (field === 'achievement_mail_id') {
      return this.threeFormGroup.controls['achievement_mail_id'].hasError('required') ? 'please_select_mail_content' : '';
    } else {
      return this.threeFormGroup.controls['issue_date'].hasError('required') ? 'enter_a_value' : '';
    }
  }
  /**
   * @desc scroll based certificate list getting support function. When user scroll the scroll list, this function only trigger initailly
   */
  onScrollDownCert() {
    this.inc_page += 1;
    this.start_no = this.sum + 1;
    this.sum += 10;
    this.default_page = this.inc_page;
    if (this.inc_page <= this.no_page) {
      this.getCertificates();
    }
  }
  /**
   * @desc scroll based course list getting support function. When user scroll the scroll list, this function only trigger initailly
   */
  onScrollDownCourse() {
    this.course_inc_page += 1;
    this.course_start_no = this.course_sum + 1;
    this.course_sum += 10;
    this.course_default_page = this.course_inc_page;
    if (this.course_inc_page <= this.course_no_page) {
      this.getCourses();
    }
  }
  /**
   * @description function using for scroll based pagination and search value based course display
   * @param searchData - search value
   */
  getCourses(searchData?: any, find = '') {
    this.process = true;
    const params = new URLSearchParams();
    if (this.certBadgeTitle != '') {
      searchData['title'] = this.certBadgeTitle;
    }
    if (searchData) {
      if (find == 'search') {
        this.filterCourse = [];
      }
    }
    for (const key in searchData) {
      if (searchData[key]) {
        params.set(key, searchData[key]);
      }
    }
    this.certificateService.getIssuersCourses(params.toString(), this.course_default_page).subscribe(
      data => {
        this.process = false;
        this.courseslists = data;
        if (this.courseslists.count !== 0) {
          this.certificateService.redirectCourse.next(false);
        }
        this.course_no_page = Math.ceil(this.courseslists.count / 5);
        this.courseslists.results.map(item => {
          return item;
        }).forEach(item => this.filterCourse.push(item));
        this.initialFilterCourse = this.filterCourse;
        this.checkPublishForm();
      },
      err => {
        this.courseslists = [];
        this.process = false;
      }
    );
  }

  checkPublishForm() {
    if (localStorage.getItem('redirectWithID') !== '' && localStorage.getItem('redirectWithID') !== null) {
      this.disableFirstNext = false;
      this.redirectWithId = localStorage.getItem('redirectWithID');
      this.isSelectCert = localStorage.getItem('redirectWhich') == 'cert' ? true : false;
      console.log(this.isSelectCert);
      setTimeout(() => {
        this.tabselection = 1;
      }, 1000);
      if (localStorage.getItem('redirectWhich') != 'cert') {
        this.relatedCertificateList(this.redirectWithId);
      }
    } else {
      this.redirectWithId = '';
    }
  }
  /**
   * @description - stepper moving to the next stepper
   */
  onStep2Back() {
    if (this.redirectWithId !== '') {
      this.formcourse = '';
      this.disableFirstNext = true;
      this.redirectWithId = '';
      localStorage.removeItem('redirectWithID');
      localStorage.removeItem('redirectFrom');
    }
  }
  /**
   * @description - reset the course search option form field and functionality
   */
  resetSearchCourse() {
    this.errorMsgSearchCC = '';
    this.certBadgeTitle = '';
    this.courseslists = [];
    this.certificatelists = [];
    this.course_inc_page = 0;
    this.inc_page = 0;
    this.filterCourse = [];
    this.filterCert = [];
    this.onScrollDownCourse();
    this.onScrollDownCert();
    this.onSearchCertCourse.controls['searchCertCourse'].setValue('');
  }
  /**
   * @description function using two different jobs, 1. Getting course list 2. search based certifcate list display
   * @param searchData - search value
   */
  onSearchCourse(searchCourseKeyword) {
    const search: any = [];
    if (typeof searchCourseKeyword.searchCertCourse === 'object') {
      // search['title'] = searchCourseKeyword.searchCertCourse.title;
      this.certBadgeTitle = searchCourseKeyword.searchCertCourse.title;
    } else {
      // search['title'] = searchCourseKeyword.searchCertCourse;
      this.certBadgeTitle = searchCourseKeyword.searchCertCourse;
    }
    // search['page'] = 1;
    this.getCourses(search, 'search');
    this.getCertificates(search, 'search');
    // this.errorMsgSearchCC = '';
    // if (searchCourseKeyword.searchCertCourse !== '' && searchCourseKeyword.searchCertCourse !== null) {
    //   this.filterCourse = this.filterCourse.filter(function (course) {
    //     return course.title.toLowerCase().indexOf(searchCourseKeyword.searchCertCourse.toLowerCase()) > -1;
    //   });
    //   if (this.filterCourse.length === 0) {
    //     // this.getCourses();
    //     this.filterCourse = [];
    //   }
    // } else {
    //   this.errorMsgSearchCC = 'error';
    // }
    // if (searchCourseKeyword.searchCertCourse !== '' && searchCourseKeyword.searchCertCourse !== null) {
    //   this.filterCert = this.filterCert.filter(function (cert) {
    //     return cert.title.toLowerCase().indexOf(searchCourseKeyword.searchCertCourse.toLowerCase()) > -1;
    //   });
    //   if (this.filterCert.length === 0) {
    //     this.filterCert = [];
    //   }
    // } else {
    //   this.errorMsgSearchCC = 'error';
    // }
  }
  /**
   * @description function using two different jobs, 1. Getting certificate list 2. search based certifcate list display
   * @param searchData - search value
   */
  getCertificates(searchData: any = [], find = '') {
    const params = new URLSearchParams();
    console.log(searchData);
    if (this.certBadgeTitle != '') {
      searchData['title'] = this.certBadgeTitle;
    }
    if (searchData) {
      if (find == 'search') {
        this.filterCert = [];
      }
      for (const key in searchData) {
        if (searchData[key]) {
          params.set(key, searchData[key]);
        }
      }
    }
    this.certificateService.getIssuersCertificates(params.toString(), this.default_page).subscribe(
      data => {
        this.certificatelists = data;
        if (this.certificatelists.count !== 0) {
          this.certificateService.redirectCerts.next(false);
        }
        this.no_page = Math.ceil(this.certificatelists.count / 5);
        this.certificatelists.results.map(item => {
          return item;
        }).forEach(item => this.filterCert.push(item));
        this.initialFilterCert = this.filterCert;
      },
      err => {
        this.certificatelists = [];
        this.filterCert = this.certificatelists;
      }
    );
  }
  /**
   * @description Certificate search function
   * @param searchCertKeyword - search value
   */
  onSearchCert(searchCertKeyword) {
    if (searchCertKeyword !== '' && searchCertKeyword !== null) {
      this.filterCert = this.certificatelists.filter(function (cert) {
        return cert.title.toLowerCase().indexOf(searchCertKeyword.toLowerCase()) > -1;
      });
    } else {
      this.filterCert = this.certificatelists;
    }
  }
  /**
   * @description when we check "select all" checkbox this function will trigger
   * @param checked - variable value get from template
   */
  onChangeSelectAll(checked) {
    this.coursesArray = [];
    if (checked) {
      this.filterStudent.forEach(data => {
        this.coursesArray.push(data.id);
      });
      this.checkall = true;
      this.filterStudent = [];
      this.selectedStudent = [];
      this.changeStudentArr.map(item => {
        item['selected'] = true;
        return item;
      }).forEach(item => {
        this.filterStudent.push(item);
        this.selectedStudent.push(item);
      }
      );
      this.displayNotifyStud();
      this.disablestep3ButtonFun(this.coursesArray);
    } else {
      this.resetSelectCheck();
    }
  }
  /**
   * @desc when we uncheck the all student this function will call
   */
  resetSelectCheck() {
    this.searchStudIndiv.controls['stud_search_input'].setValue(false);
    this.checkall = false;
    this.coursesArray = [];
    this.filterStudent = [];
    this.selectedStudent = [];
    this.displaySelectedStud = [];
    this.displaySelectedStudString = '';
    this.changeStudentArr.map(item => {
      item['selected'] = false;
      return item;
    }).forEach(item => {
      this.filterStudent.push(item);
    });
    this.disablestep3ButtonFun(this.coursesArray);
  }

  /**
   * @desc when focus the testimonial field height will be change dynamically
   */
  focusFunction() {
    document.getElementsByClassName('angular-editor-textarea')[0].setAttribute('style', 'height:100px');
  }
  focusoutFunction() {
    document.getElementsByClassName('ql-container')[0].setAttribute('style', 'height:50px');
  }
  /**
   * @desc when move from current page we clear the localstorage
   */
  ngOnDestroy() {
    if (this.getGroupListSubscription) {
      this.getGroupListSubscription.unsubscribe();
    }
    if (this.getGroupListSubscription) {
      this.getGroupListSubscription.unsubscribe();
    }
    if (this.studentNameSubscription) {
      this.studentNameSubscription.unsubscribe();
    }
    localStorage.removeItem('redirectwhichcert');
    localStorage.removeItem('redirectWhich');
    localStorage.removeItem('redirectFrom');
  }
}

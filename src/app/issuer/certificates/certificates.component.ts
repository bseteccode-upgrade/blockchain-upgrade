/*
 * File : certificates.component.ts
 * Use: list the certificate data
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { environment as env } from '../../../environments/environment';
import { CertificateService } from '../services/certificate.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';
import { map, startWith } from 'rxjs/operators';
import { PreviewDetailsComponent } from '../preview-details/preview-details.component';
import { MatDialog } from '@angular/material';
import { PreviewCertComponent } from '../../edu-modal/preview-cert/preview-cert.component';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit, OnDestroy {
  certificates: any = [];
  certificateRes: any;
  baseUrl = env.baseUrl;
  searchData: any = [];
  searchForm: FormGroup;
  process: boolean;
  advanceSearch = false;
  searchCert: any = '';
  urlCerti: string;
  @ViewChild('resetFormID') resetFormCheck;
  reasonForm: FormGroup;
  disableYes = true;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  certID = '';
  resDelete: any;
  checkSubmit = false;

  /* Scroll Pagination */
  slimScrollState = new SlimScrollState();
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;

  course_scrollUpDistance = 0;
  course_throttle = 300;
  course_no_page: number;
  course_scrollDistance = 1;
  course_inc_page = 1;
  course_default_page = 1;

  userDetails = JSON.parse(localStorage.getItem('user_details'));
  testMode: any = this.userDetails.profile_details.test_mode;

  allCertData: any;
  titleControl = new FormControl();
  codeControl = new FormControl();
  degreeControl = new FormControl();
  optionTitle: any = [];
  filterTitle: any = [];
  optionCode: any = [];
  filterCode: any = [];
  optionDegree: any = [];
  filterDegree: any = [];
  titleInput: any;
  codeInput: any;
  degreeInput: any;
  certAllDataSubscribtion: any;
  getCertSubscribtion: any;

  constructor(
    private certiService: CertificateService,
    private apiService: ApiService,
    private common: CommonService,
    public ngxSmartModalService: NgxSmartModalService,
    public formbuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.searchForm = this.formbuilder.group({
      'title': [''],
      'degree': [''],
      'code': [''],
      'search': ['']
    });
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
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

    this.filterDegree = this.degreeControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(data => data ? this._degreefilter(data) : this.optionDegree.slice())
      );
  }

  private _titlefilter(dataValue) {
    return this.optionTitle.filter(option => option.title.toLowerCase().indexOf(dataValue) === 0);
  }

  private _codefilter(dataValue) {
    return this.optionCode.filter(option => option.code.toLowerCase().indexOf(dataValue) === 0);
  }

  private _degreefilter(dataValue) {
    return this.optionCode.filter(option => option.degree.toLowerCase().indexOf(dataValue) === 0);
  }

  getinputTitle(inputVal) {
    this.titleInput = inputVal;
  }

  getinputCode(inputVal) {
    this.codeInput = inputVal;
  }

  getinputDegree(inputVal) {
    this.degreeInput = inputVal;
  }

  detailView(cert) {
    console.log(cert);
    const dialogRef = this.dialog.open(PreviewCertComponent, {
      data: {
        details: cert
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        console.log('hi');
      }
    });
  }

  ngOnInit() {
    this.certAllData();
    setTimeout(() => {
      if (this.apiService.userType === '4' && !this.apiService.pages.certificate) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
    }, 1000);
    if (localStorage.getItem('searchCert')) {
      this.searchCert = localStorage.getItem('searchCert');
      localStorage.removeItem('searchCert');
      this.urlCerti = this.baseUrl + '/api/certificates/?crs_id=' + this.searchCert + '&';
    }
    this.getCertificate([], false);
  }

  certAllData() {
    this.certAllDataSubscribtion = this.certiService.getCertAll().subscribe(
      data => {
        console.log(data);
        this.allCertData = data;
        this.optionTitle = this.allCertData.title;
        this.optionCode = this.allCertData.code;
        this.optionDegree = this.allCertData.degree;
      });
  }

  scrollChanged($event: ISlimScrollState, searchData?: any) {
    this.slimScrollState = $event;
    if ($event.isScrollAtEnd) {
      this.course_inc_page += 1;
      this.course_default_page = this.course_inc_page;
      if (this.course_inc_page <= this.course_no_page) {
        this.getCertificate(searchData);
      }
    }
  }

  searchFormSubmit(searchData: any = []) {
    this.certificates = [];
    this.course_default_page = 1;
    this.course_inc_page = 1;
    this.getCertificate(searchData, true);
  }

  resetSearchForm() {
    this.titleInput = '';
    this.codeInput = '';
    this.degreeInput = '';
    this.searchForm.controls['title'].setValue('');
    this.searchForm.controls['code'].setValue('');
    this.searchForm.controls['search'].setValue('');
    this.searchForm.markAsTouched();
    this.certificates = [];
    this.course_default_page = 1;
    this.course_inc_page = 1;
    this.getCertificate([]);
  }

  getCertificate(searchData: any = [], searchForm = false) {
    if (this.course_default_page === 1) {
      this.process = true;
    }
    searchData['title'] = this.titleInput;
    searchData['code'] = this.codeInput;
    searchData['degree'] = this.degreeInput;
    const params = new URLSearchParams();
    searchData['page'] = this.course_default_page;
    if (searchData !== 'clear') {
      for (const key in searchData) {
        if (searchData[key]) {
          params.set(key, searchData[key]);
        }
      }
    }
    if (this.urlCerti && this.urlCerti != '' && this.urlCerti != null) {
      this.getCertSubscribtion = this.certiService.getIssuersCertificatesOnly(params.toString(), this.urlCerti).subscribe(
        data => {
          this.process = false;
          this.certificateRes = data;
          if (this.certificateRes.count > 0) {
            this.course_no_page = Math.ceil(this.certificateRes.count / 10);
            this.certificateRes.results.map(item => {
              return item;
            }).forEach(item => {
              this.certificates.push(item);
            });
          } else {
            this.course_no_page = 0;
            if (!searchForm && this.certificateRes.count === 0) {
              this.certiService.redirectCerts.next(true);
              this.router.navigate(['certificateadd']);
            } else {
              this.certiService.redirectCerts.next(false);
            }
          }
        }, err => {
          this.process = false;
        });
    } else {
      this.getCertSubscribtion = this.certiService.getIssuersCertificatesOnly(params.toString()).subscribe(
        data => {
          this.process = false;
          this.certificateRes = data;
          if (this.certificateRes.count > 0) {
            this.course_no_page = Math.ceil(this.certificateRes.count / 10);
            this.certificateRes.results.map(item => {
              return item;
            }).forEach(item => {
              this.certificates.push(item);
            });
          } else {
            this.course_no_page = 0;
            if (!searchForm && this.certificateRes.count === 0) {
              this.certiService.redirectCerts.next(true);
              this.router.navigate(['certificateadd']);
            } else {
              this.certiService.redirectCerts.next(false);
            }
          }
        }, err => {
          this.process = false;
        });
    }
  }

  onRedirectCourse(courseID) {
    localStorage.setItem('searchCourse', courseID);
    this.router.navigate(['usercourse']);
  }

  reasonFormSubmit(formdata) {
    if (!this.reasonForm.invalid) {
      const params = {
        'certificate_id': this.certID,
        'reason_type': formdata.reason_type,
        'reason': formdata.reason
      };
      this.checkSubmit = true;
      this.apiService.deleteCert(params).subscribe(
        data => {
          this.resDelete = data;
          if (this.resDelete.msg === 'Certificate deleted successfully.') {
            this.ngxSmartModalService.getModal('myModal').close();
            this.resetSearchForm();
            // const indexVal = this.certificates.find(x => x.id === this.certID);
            // const index = this.certificates.indexOf(indexVal);
            // this.certificates.splice(index, 1);
            // if (this.certificates.length === 0) {
            //   this.certiService.redirectCerts.next(true);
            //   this.router.navigate(['certificateadd']);
            // } else {
            //   this.certiService.redirectCerts.next(false);
            // }
            this.common.openSnackBar('cert_deleted_success', 'Close');
          } else {
            this.checkSubmit = false;
            this.common.openSnackBar('some_error_occurred', 'Close');
          }
        },
        err => {
          this.checkSubmit = false;
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      );
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
    this.reasonformReset();
  }

  reasonformReset() {
    this.hideOtherField = false;
    this.reasonErrorMsg = '';
    this.reasonForm.reset();
    this.resetFormCheck.resetForm();
  }

  /**
   * @description - redirect to achievement form step2 form with course id
   * @param certID - course ID
   */
  redirectToStep2(certID) {
    if (this.apiService.remaining_wallet < 10 && !this.testMode) {
      this.ngxSmartModalService.getModal('planPopupInfo').open();
    } else {
      localStorage.setItem('redirectWithID', certID);
      localStorage.setItem('redirectWhich', 'cert');
      localStorage.setItem('redirectFrom', 'list');
      this.router.navigate(['newassign']);
    }
  }

  ngOnDestroy() {
    if (this.certAllDataSubscribtion) {
      this.certAllDataSubscribtion.unsubscribe();
    }
    if (this.getCertSubscribtion) {
      this.getCertSubscribtion.unsubscribe();
    }
  }
}

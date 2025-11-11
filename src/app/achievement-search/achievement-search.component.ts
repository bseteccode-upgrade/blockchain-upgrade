/*
 * File : achievement-search.component.ts
 * Use: posted certificate search in separate url
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CertificateService } from '../issuer/services/certificate.service';
import { ApiService } from '../service/api.service';
import { CommonService } from '../service/common.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-achievement-search',
  templateUrl: './achievement-search.component.html',
  styleUrls: ['./achievement-search.component.css']
})
export class AchievementSearchComponent implements OnInit {
  reasonForm: FormGroup;
  baseUrl = env.baseUrl;
  appName = env.project_name;
  siteName = env.project_site;
  progressGif = env.progressGif;
  certificates: any = [];
  searchForm: FormGroup;
  process = false;
  emailID: any;
  certiSelected = false;
  selectedCertificate: any = {};
  modelOpen = false;
  linkedInCode: any;
  submitted = false;
  emailProcess = false;
  myTemplate = '';
  activeTab = '';
  width = '200';
  height = '200';
  testimonial: any;
  resUserCertList: any = { 'student_detial': '' };
  notcertificates: any = [];
  resDelete: any;
  disableYes = true;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  certID: any;
  isCert: any;
  resWallet: any = [];
  shareDataRes: any = [];
  studID: any;
  @ViewChild('resetFormID') resetFormCheck;
  gender = { 'M': 'Male', 'F': 'Female' };
  routerWithID = '';
  pui = '';
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

  constructor(
    public sanitizer: DomSanitizer,
    private certiService: CertificateService,
    public apiService: ApiService,
    private common: CommonService,
    public ngxSmartModalService: NgxSmartModalService,
    public formbuilder: FormBuilder,
    private http: HttpClient,
    public domSanitizer: DomSanitizer,
    private router: Router,
  ) {
    this.searchForm = this.formbuilder.group({
      'title': [null],
      'certificate_code': [null],
      'from_date': [null],
      'to_date': [null],
      'class': [null],
    });
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
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

    if (localStorage.getItem('achstudid')) {
      this.studID = localStorage.getItem('achstudid');
    } else {
      if (this.routerWithID !== '') {
        this.router.navigate(['embed/studentsearch'], { queryParams: { embed: this.pui } });
      } else {
        this.router.navigate(['embed/studentsearch']);
      }
    }
    this.getCertificate({ 'student_id': this.studID, 'pui': this.pui });
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }

  socialShare(social, url, content) {
    if (social == 'facebook') {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + url + '&quote=' + content, '_blank');
    } else if (social == 'twitter') {
      window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + content, '_blank');
    } else if (social == 'whatsapp') {
      window.open('https://web.whatsapp.com/send?text=' + content + ' %0A' + encodeURIComponent(url), '_blank');
    } else if (social == 'linkedin') {
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank');
    }
  }

  monthString(monthnum) {
    if (monthnum != null && monthnum != '') {
      const findIndex = this.monthArr.find(x => x.index == monthnum);
      return findIndex.month;
    } else {
      return;
    }
  }

  /**
   * @function redirectToStudList
   * @description redirect to the separate page student url
   */
  redirectToStudList() {
    localStorage.removeItem('achstudid');
    this.router.navigate(['embed/studentlist']);
  }

  /**
   * @function getCertificate
   * @description get certificate list based search form data
   * @param searchData form search data's
   */
  getCertificate(searchData?: any) {
    this.process = true;
    setTimeout(() => {
      this.process = false;
    }, 8000);
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key]) {
        params.set(key, searchData[key]);
      }
    }
    this.certiService.getAchievementsCertificateLists(params.toString()).subscribe(
      data => {
        setTimeout(() => {
          this.apiService.showTooltip = false;
        }, 18000);
        this.resUserCertList = data;
        this.certificates = this.resUserCertList.user_cert_list;
        this.notcertificates = this.resUserCertList.crs_list;
      },
      err => {
        this.process = false;
      }
    );
  }

  /**
   * @function getIssuedCertiDetail
   * @description get certificate list based on certificate id and convert's data
   * @param id certificate id
   */
  getIssuedCertiDetail(id) {
    this.certiSelected = false;
    this.certiService.getStudentCertWithout(id).subscribe(
      data => {
        this.selectedCertificate = data;
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
        this.selectedCertificate.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + d.getFullYear();
        this.selectedCertificate.catlanDate = d.getDate() + '' + catlanmonthNames[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date_dateformat = this.selectedCertificate.originalIssueDate;
        if (this.selectedCertificate.end_validity) {
          this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
          const exd = new Date(this.selectedCertificate.end_validity);
          this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + exd.getFullYear();
        }
        this.testimonial = this.selectedCertificate.testimonial;
        this.certiSelected = true;
        this.modelOpen = true;
        this.ngxSmartModalService.setModalData(this.selectedCertificate, 'BadgeModal');
        this.ngxSmartModalService.getModal('BadgeModal').open();
      },
      err => {
        this.modelOpen = false;
        this.certiSelected = false;
        this.common.openSnackBar('no_detail_found', 'Close');
      }
    );
  }

  /**
   * @function getIssuedBadgeDetail
   * @description get badge details list based on certificate is
   * @param id certificate id
   */
  getIssuedBadgeDetail(id) {
    this.certiSelected = false;
    this.certiService.getStudentCertWithout(id).subscribe(
      data => {
        this.selectedCertificate = data;
        this.selectedCertificate.baseUrl = env.baseUrl;
        this.selectedCertificate.originalIssueDate = this.selectedCertificate.issue_date;
        // Multi language date conversation
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'Mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const monthNamesCapital = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const catlanmonthNames = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny',
          'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
        const d = new Date(this.selectedCertificate.issue_date);
        this.selectedCertificate.issue_date_mmyy = monthNamesCapital[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + d.getFullYear();
        this.selectedCertificate.catlanDate = d.getDate() + ' ' + catlanmonthNames[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date_dateformat = this.selectedCertificate.originalIssueDate;
        if (this.selectedCertificate.end_validity) {
          this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
          const exd = new Date(this.selectedCertificate.end_validity);
          this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + exd.getFullYear();
        }
        this.certiSelected = true;
        this.modelOpen = true;
        this.ngxSmartModalService.setModalData(this.selectedCertificate, 'myModal4');
        this.ngxSmartModalService.getModal('myModal4').open();
      },
      err => {
        this.modelOpen = false;
        this.certiSelected = false;
        this.common.openSnackBar('no_detail_found', 'Close');
      }
    );
  }

  /**
   * @function getIssuedCertiDetail2
   * @description get certificate list based on certificate id and convert's data
   * @param id certificate id
   */
  getIssuedCertiDetail2(id) {
    this.certiService.getStudentCertWithout(id).subscribe(
      data => {
        this.myTemplate = '';
        this.selectedCertificate = data;
        this.selectedCertificate.originalIssueDate = this.selectedCertificate.issue_date;
        this.selectedCertificate.baseUrl = env.baseUrl;
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
        this.selectedCertificate.pdf_uploads = this.selectedCertificate.pdf_uploads ? this.selectedCertificate.pdf_uploads : '';
      },
      err => {
        // console.log(err);
      }
    );
  }

  /**
   * @function viewEvidence
   * @description view evidence array conversation
   * @param certi certificate details
   */
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

  /**
   * @function shareEmail
   * @description submit and share certificate to the mail content
   * @param id certificate id
   * @param email entered email address
   */
  shareEmail(id, email) {
    if (email.valid) {
      this.emailProcess = true;
      this.certiService.shareEmail(id, email.value).subscribe(
        data => {
          this.emailProcess = false;
          this.ngxSmartModalService.getModal('EmailModal').close();
          this.common.openSnackBar('email_send_successfully', 'Close');
        },
        err => {
          this.emailProcess = false;
          this.common.openSnackBar('could_not_send_email', 'Close');
        }
      );
    }
  }

  /**
   * @function downloadPdf
   * @description download pdf file
   * @param pdf pdf file url
   */
  downloadPdf(pdf) {
    this.http.get(pdf, { responseType: 'blob' }).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/pdf' });
        FileSaver.saveAs(blob, 'certificate-' + Date.now() + '.pdf');
      },
      err => {
        // console.log(err);
      }
    );
  }

  /**
   * @function downloadImage
   * @description download image file
   * @param badge image file url
   */
  downloadImage(badge) {
    this.http.get(badge, { responseType: 'blob' }).subscribe(
      res => {
        FileSaver.saveAs(res, 'badge-' + Date.now());
      },
      err => {
        // console.log(err);
      }
    );
  }

  /**
   * @function copyText
   * @description copy / paste functionality
   * @param field field name
   */
  copyText(field) {
    field.select();
    document.execCommand('copy');
  }
}

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonService } from './../../service/common.service';
import { CertificateService } from '../../issuer/services/certificate.service';
import { ApiService } from '../../service/api.service';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import * as FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-badge-view',
  templateUrl: './badge-view.component.html',
  styleUrls: ['./badge-view.component.css']
})
export class BadgeViewComponent implements OnInit {
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  baseUrl = env.baseUrl;
  appName = env.project_name;
  siteName = env.project_site;
  progressGif = env.progressGif;
  public moment = moment;
  selectedCertificate: any = {};
  certiId = '';
  badgeDetail: any = {};
  modelOpen = false;
  process = false;
  submitted = false;
  emailProcess = false;
  certiSelected = false;
  emailID: any;
  myTemplate = '';
  activeTab = '';
  width = '200';
  height = '200';
  certiDetail = false;
  testimonial: any;
  resWallet: any;
  no_results: any = false;
  languages: any = [];
  selectedLang = 'EN';
  expiredRes: any = [];
  reasonForm: FormGroup;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  resDelete: any;
  disableYes = true;
  @ViewChild('resetFormID') resetFormCheck;
  checkSubmit = false;
  shareDataRes: any = [];
  publiDataRes: any = [];

  constructor(
    public formbuilder: FormBuilder,
    public sanitizer: DomSanitizer,
    public ngxSmartModalService: NgxSmartModalService,
    private certiService: CertificateService,
    public apiService: ApiService,
    private route: ActivatedRoute,
    private common: CommonService,
    private http: HttpClient,
    public domSanitizer: DomSanitizer,
    private metaService: Meta,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BadgeViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: HTMLDocument,
  ) {
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
  }

  ngOnInit() {
    console.log(this.userDetails);
    this.getLanguages();
    this.no_results = false;
    setTimeout(() => {
      this.process = false;
    }, 4000);
    this.badgeDetail = this.data.certDatas;
    this.certiId = this.badgeDetail.id;
    this.badgeDetail.baseUrl = env.baseUrl;
    this.badgeDetail.originalIssueDate = this.badgeDetail.issue_date;
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'Mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const d = new Date(this.badgeDetail.issue_date);
    this.badgeDetail.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + d.getFullYear();
    this.badgeDetail.issue_date_dateformat = this.badgeDetail.originalIssueDate;
    // if (this.badgeDetail.end_validity) {
    //   this.badgeDetail.end_validity_dateformat = this.badgeDetail.end_validity;
    //   const exd = new Date(this.badgeDetail.end_validity);
    //   this.badgeDetail.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + exd.getFullYear();
    // }
    this.testimonial = this.badgeDetail.testimonial;
    this.certiSelected = true;
  }

  getLanguages() {
    this.apiService.getLanguage().subscribe(data => {
      this.languages = data;
      console.log(this.languages);
    });
  }

  selectLang(lang) {
    this.selectedLang = lang.language_code;
    this.apiService.setSeparateLanguage(lang);
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

  getIssuedBadge(id) {
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
        this.selectedCertificate.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + d.getFullYear();
        this.selectedCertificate.catlanDate = d.getDate() + ' ' + catlanmonthNames[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date_dateformat = this.selectedCertificate.originalIssueDate;
        // if (this.selectedCertificate.end_validity) {
        //   this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
        //   const exd = new Date(this.selectedCertificate.end_validity);
        //   this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + exd.getFullYear();
        // }
        this.testimonial = this.selectedCertificate.testimonial;
        this.certiSelected = true;
        this.ngxSmartModalService.setModalData(this.selectedCertificate, 'myModal4');
        this.ngxSmartModalService.getModal('myModal4').open();
        this.modelOpen = true;
      },
      err => {
        this.modelOpen = false;
        this.certiSelected = false;
        this.common.openSnackBar('no_detail_found', 'Close');
      });
  }

  getIssuedCertiDetail(id) {
    this.certiSelected = false;
    this.certiService.getStudentCertiDetail(id).subscribe(
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
        this.selectedCertificate.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + d.getFullYear();
        this.selectedCertificate.catlanDate = d.getDate() + ' ' + catlanmonthNames[d.getMonth()] + '' + d.getFullYear();
        this.selectedCertificate.issue_date_dateformat = this.selectedCertificate.originalIssueDate;
        // if (this.selectedCertificate.end_validity) {
        //   this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
        //   const exd = new Date(this.selectedCertificate.end_validity);
        //   this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + exd.getFullYear();
        // }
        this.testimonial = this.selectedCertificate.testimonial;
        this.certiSelected = true;
        this.modelOpen = true;
      },
      err => {
        this.modelOpen = false;
        this.certiSelected = false;
        this.common.openSnackBar('no_detail_found', 'Close');
      }
    );
  }

  showHtml(template) {
    this.http.get(`/assets/templates/certificate-${template}/certificate-${template}.html`, { responseType: 'text' }).subscribe(html => {
      this.myTemplate = html;
    });
  }

  /**
   * @function viewEvidence
   * @description Given eveidence details display to the popup window
   * @param certi certificate ID
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
   * @function copyText
   * @description copy / paste function
   * @param field - dynamically get the text field
   */
  copyText(field) {
    field.select();
    document.execCommand('copy');
  }

  /**
   * @function shareEmail
   * @description share the certificate based on given mail address
   * @param id - certificate ID
   * @param email - user email address
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

  scrollUp() {
    window.scroll(0, 0);
  }

  /**
   * @function downloadPdf
   * @description download the pdf file from api response data
   * @param pdf - URL
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
   * @description download the image file from api response data
   * @param badge - Image URL
   */
  downloadImage(badge) {
    this.http.get(badge, { responseType: 'blob' }).subscribe(
      res => {
        const blob = new Blob([res], { type: 'image/png' });
        FileSaver.saveAs(blob, 'badge-' + Date.now());
      },
      err => {
        // console.log(err);
      }
    );
  }

  /**
   * @function addMobileWallet
   * @description this function specially used for apple mobile wallet users
   * @param certId - Certificate id
   */
  addMobileWallet(certId) {
    const params = {
      cert_id: certId
    };
    this.certiService.walletMail(params).subscribe(
      data => {
        this.resWallet = data;
        if (this.resWallet.msg === 'Pass was created successfully') {
          this.common.openSnackBar('pass_created_success', 'Close');
        }
      }, err => {
        this.common.openSnackBar('could_not_send_email', 'Close');
      });
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }

  getreasonErrorMsg(field) {
    if (field === 'reason_type' || field === 'reason') {
      return this.reasonForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    }
  }

  setCertId(id) {
    this.checkSubmit = false;
    this.certiId = id;
    this.formValidationReset();
  }

  formValidationReset() {
    this.hideOtherField = false;
    this.reasonErrorMsg = '';
    this.reasonForm.reset();
    this.resetFormCheck.resetForm();
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

  experiedCertId(experiedCertID, status) {
    console.log(this.badgeDetail.is_expired);
    console.log(status);
    const params = {
      'cert_id': experiedCertID
    };
    this.certiService.experiedIssuedCertificate(params).subscribe(
      data => {
        this.expiredRes = data;
        console.log(this.expiredRes);
        if (this.expiredRes.msg.trim() === 'Certificate has been updated') {
          const classname = this.expiredRes.is_invalidated ? 'cls-invalidado' : this.expiredRes.is_apple_wallet ? 'cls-expirado' : this.expiredRes.is_expired ? 'cls-expired' : 'testsam';
          if (status) {
            this.badgeDetail.is_expired = false;
            this.document.getElementById(experiedCertID).className = '';
            this.document.getElementById(experiedCertID).classList.remove(classname);
            this.document.getElementById(experiedCertID).className = classname;
            this.document.getElementById('detail' + experiedCertID).className = '';
            this.document.getElementById('detail' + experiedCertID).classList.remove(classname);
            this.document.getElementById('detail' + experiedCertID).className = classname;
          } else {
            this.badgeDetail.is_expired = true;
            this.document.getElementById(experiedCertID).className = classname;
            this.document.getElementById('detail' + experiedCertID).className = classname;
          }
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
        'cert_id': this.certiId,
        'reason_type': formdata.reason_type,
        'reason': formdata.reason,
        'select_all': false
      };
      this.checkSubmit = true;
      this.certiService.deleteIssuedCertificate(params).subscribe(
        data => {
          this.resDelete = data;
          if (this.resDelete.msg === 'Certificate deleted from blockchain successfully.') {
            this.common.openSnackBar('achievement_deletion_successfully', 'Close');
            this.ngxSmartModalService.getModal('deletemyModal').close();
            this.ngxSmartModalService.getModal('myModal3').close();
            this.dialogRef.close({ result: true, is_Deleted: true, certId: this.certiId });
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
    } else {
      this.reasonErrorMsg = 'error';
    }
  }

  onCancel() {
    this.dialogRef.close({ result: true, is_Deleted: false });
  }

  togglearrow(e) {
    // e.preventDefault();
    if (jQuery(window).width() < 991) {
      if (jQuery('body').hasClass('toggleLeftSidebar')) {
        jQuery('body').removeClass('toggleLeftSidebar');
      } else {
        jQuery('body').addClass('toggleLeftSidebar');
      }
    } else {
      if (jQuery('body').hasClass('toggleLeftSidebar')) {
        jQuery('body').removeClass('toggleLeftSidebar');
      } else {
        jQuery('body').addClass('toggleLeftSidebar');
      }
    }
  }

  toggleClose(e) {
    // e.preventDefault();
    if (jQuery(window).width() < 991) {
      if (jQuery('body').hasClass('toggleLeftSidebar')) {
        jQuery('body').removeClass('toggleLeftSidebar');
      }
    }
  }

  toggleShare(certId, status) {
    if (status) {
      this.ngxSmartModalService.setModalData({ 'id': certId, 'status': status }, 'infoAboutShare');
      this.ngxSmartModalService.getModal('infoAboutShare').open();
    } else {
      this.commonShareSave(certId, status);
    }
  }

  callSharingSave(certId, status) {
    this.commonShareSave(certId, status);
  }

  commonShareSave(certId, status) {
    if (status) {
      jQuery('body').addClass('imageprocess');
    }
    const params = {
      achievement_id: certId,
      social_media_share: status
    };
    this.certiService.onSharEnDis(params).subscribe(
      data => {
        this.shareDataRes = data;
        if (this.shareDataRes.msg === 'Successfully updated') {
          jQuery('body').removeClass('imageprocess');
          if (status) {
            this.ngxSmartModalService.getModal('infoAboutShare').close();
          }
          this.common.openSnackBar('sharing_option_updated', 'Close');
        }
      }, err => {
        jQuery('body').removeClass('imageprocess');
      });
  }

  toggleCertificateSearch(certId, status) {
    const params = {
      is_public: status
    };
    this.certiService.onCertPublicEnDis(params, certId).subscribe(
      data => {
        this.publiDataRes = data;
        if (this.publiDataRes.mes == 'Successfully updated ') {
          this.common.openSnackBar('certi_status_updated', 'Close');
        }
      }, err => {
      });
  }

}

/*
 * File : certificates.component.ts
 * Use: Student certificate list display
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CertificateService } from '../../issuer/services/certificate.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
declare var jQuery;
import { CertDetailviewComponent } from '../../edu-modal/cert-detailview/cert-detailview.component';
import { BadgeViewComponent } from '../../edu-modal/badge-view/badge-view.component';
import { SharelinkedinPreviewComponent } from '../../edu-modal/sharelinkedin-preview/sharelinkedin-preview.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
  appName = env.project_name;
  siteName = env.project_site;
  progressGit = env.progressGif;
  reasonForm: FormGroup;
  baseUrl = env.baseUrl;
  certificates: any = [];
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
  resUserCertList: any;
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
  publiDataRes: any = [];
  @ViewChild('resetFormID') resetFormCheck;
  checkSubmit = false;
  constructor(
    public sanitizer: DomSanitizer,
    private certiService: CertificateService,
    public apiService: ApiService,
    private common: CommonService,
    public ngxSmartModalService: NgxSmartModalService,
    public formbuilder: FormBuilder,
    private http: HttpClient,
    public domSanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
  }

  ngOnInit() {
    this.getCertificate();
  }

  getCertificate(searchData?: any) {
    this.process = true;
    setTimeout(() => {
      this.process = false;
    }, 8000);
    this.certiService.getCertificates(searchData).subscribe(
      data => {
        setTimeout(() => {
          this.apiService.showTooltip = false;
        }, 18000);
        this.resUserCertList = data;
        this.certificates = this.resUserCertList.user_cert_list;
        if (this.certificates.length > 0 && this.apiService.user.profile_details.is_student_shared && localStorage.getItem('firstTimeShare') == 'false') {
          localStorage.setItem('firstTimeShare', 'true')
          const dialogRef = this.dialog.open(SharelinkedinPreviewComponent, {
            data: {
              details: this.certificates[0]
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            this.popupRes = result;
          });
        }
        this.notcertificates = this.resUserCertList.crs_list;
      },
      err => {
        this.process = false;
      }
    );
  }

  catchShare(type) {
    this.apiService.shareUpdate(type).subscribe(
      data => { });
  }

  socialShare(social, url, content) {
    if (social == 'facebook') {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + url + '&quote=' + content, '_blank');
    } else if (social == 'twitter') {
      window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + content, '_blank');
    } else if (social == 'whatsapp') {
      window.open('https://web.whatsapp.com/send?text=' + content + ' %0A' + encodeURIComponent(url), '_blank');
    } else if (social == 'linkedin') {
      localStorage.setItem('firstTimeShare', 'true')
      this.apiService.updateStudentShare().subscribe(
        res => {
        console.log(res)
      })
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank');
    }
  }

  getIssuedCertiDetail(id) {
    this.certiSelected = false;
    this.certiService.getStudentCertiDetail(id).subscribe(
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
        // if (this.selectedCertificate.end_validity) {
        //   this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
        //   const exd = new Date(this.selectedCertificate.end_validity);
        //   this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth()] + ' de ' + exd.getFullYear();
        // }
        this.testimonial = this.selectedCertificate.testimonial;
        this.certiSelected = true;
        // this.modelOpen = true;
        // this.ngxSmartModalService.setModalData(this.selectedCertificate, 'BadgeModal');
        // this.ngxSmartModalService.getModal('BadgeModal').open();
        if (this.selectedCertificate.is_certificate) {
          const dialogRef = this.dialog.open(CertDetailviewComponent, {
            data: {
              certDatas: this.selectedCertificate
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.is_Deleted) {
              const indexVal = this.certificates.find(x => x.id === result.certId);
            const index = this.certificates.indexOf(indexVal);
            this.certificates.splice(index, 1);

            const indexValCon = this.notcertificates.find(x => x.id === result.certId);
            const indexCon = this.notcertificates.indexOf(indexValCon);
            this.notcertificates.splice(index, 1);
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
              const indexVal = this.certificates.find(x => x.id === result.certId);
            const index = this.certificates.indexOf(indexVal);
            this.certificates.splice(index, 1);

            const indexValCon = this.notcertificates.find(x => x.id === result.certId);
            const indexCon = this.notcertificates.indexOf(indexValCon);
            this.notcertificates.splice(index, 1);
            }
          });
        }
      },
      err => {
        this.modelOpen = false;
        this.certiSelected = false;
        this.common.openSnackBar('no_detail_found', 'Close');
      }
    );
  }

  getIssuedBadgeDetail(id) {
    this.certiSelected = false;
    this.certiService.getStudentCertiDetail(id).subscribe(
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
        this.selectedCertificate.issue_date = d.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + d.getFullYear();
        this.selectedCertificate.catlanDate = d.getDate() + ' ' + catlanmonthNames[d.getMonth()] + ' ' + d.getFullYear();
        this.selectedCertificate.issue_date_dateformat = this.selectedCertificate.originalIssueDate;
        // if (this.selectedCertificate.end_validity) {
        //   this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
        //   const exd = new Date(this.selectedCertificate.end_validity);
        //   this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + exd.getFullYear();
        // }
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

  getIssuedCertiDetail2(id, share = '') {
    this.certiService.getStudentCertiDetail(id).subscribe(
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
        // if (this.selectedCertificate.end_validity) {
        //   this.selectedCertificate.end_validity_dateformat = this.selectedCertificate.end_validity;
        //   const exd = new Date(this.selectedCertificate.end_validity);
        //   this.selectedCertificate.end_validity = exd.getDate() + ' de ' + monthNames[d.getMonth() - 1] + ' de ' + exd.getFullYear();
        // }
        this.selectedCertificate.pdf_uploads = this.selectedCertificate.pdf_uploads ? this.selectedCertificate.pdf_uploads : '';
        if (share == 'social') {
          this.ngxSmartModalService.setModalData(this.selectedCertificate.social_share_url, 'ShareModal');
          this.ngxSmartModalService.getModal('ShareModal').open();
        }
      },
      err => {
        // console.log(err);
      }
    );
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

  shareEmail(id, email) {
    if (email.valid) {
      this.emailProcess = true;
      this.certiService.shareEmail(id, email.value).subscribe(
        data => {
          this.apiService.shareUpdate(2).subscribe(
            dataReturn => { });
          this.emailProcess = false;
          this.ngxSmartModalService.getModal('EmailModal').close();
          this.common.openSnackBar('email_send_successfully', 'Close');
          this.emailID = '';
          this.submitted = false;
        },
        err => {
          this.emailProcess = false;
          this.common.openSnackBar('could_not_send_email', 'Close');
        }
      );
    }
  }

  downloadPdf(pdf) {
    this.apiService.shareUpdate(1).subscribe(
      data => { });
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

  downloadBadge() {
    this.apiService.shareUpdate(1).subscribe(
      data => { });
  }

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

  copyText(field) {
    field.select();
    document.execCommand('copy');
  }

  reasonFormSubmit(formdata) {
    if (!this.reasonForm.invalid) {
      const params = {
        'cert_id': this.certID,
        'reason_type': formdata.reason_type,
        'reason': formdata.reason
      };
      this.checkSubmit = true;
      this.certiService.deleteIssuedCertificate(params).subscribe(
        data => {
          this.resDelete = data;
          if (this.resDelete.msg === 'Certificate deleted from blockchain successfully.') {
            this.certiSelected = false;
            this.modelOpen = false;

            const indexVal = this.certificates.find(x => x.id === this.certID);
            const index = this.certificates.indexOf(indexVal);
            this.certificates.splice(index, 1);

            const indexValCon = this.notcertificates.find(x => x.id === this.certID);
            const indexCon = this.notcertificates.indexOf(indexValCon);
            this.notcertificates.splice(index, 1);

            this.ngxSmartModalService.getModal('myModal3').close();
            this.ngxSmartModalService.getModal('BadgeModal').close();
            document.getElementById('bodyId').classList.remove('dialog-open');
            this.common.openSnackBar('certificate_deletion_successfully', 'Close');
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

  setCertId(id, findCert) {
    this.checkSubmit = false;
    this.certID = id;
    this.isCert = findCert;
    this.formValidationReset();
  }

  formValidationReset() {
    this.hideOtherField = false;
    this.reasonErrorMsg = '';
    this.reasonForm.reset();
    this.resetFormCheck.resetForm();
  }

  addMobileWallet(certId) {
    const params = {
      cert_id: certId
    };
    this.certiService.walletMail(params).subscribe(
      data => {
        this.resWallet = data;
        if (this.resWallet.msg === 'Pass was created successfully') {
          this.ngxSmartModalService.getModal('SuccessModal').open();
        }
      }, err => {
        this.common.openSnackBar('could_not_send_email', 'Close');
      });
  }

  /**
   * @function toggleShare
   * @description certificate share privilege
   * @param certId certificate id
   * @param status boolean variable
   */
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
        if (this.publiDataRes.msg === 'Successfully updated') {
          this.common.openSnackBar('certi_status_updated', 'Close');
        }
      }, err => {
      });
  }
}

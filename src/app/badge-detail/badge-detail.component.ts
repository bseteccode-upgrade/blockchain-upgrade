/*
 * File : badge-detail.component.ts
 * Use: display the acheievement certificate details
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonService } from '../service/common.service';
import { CertificateService } from '../issuer/services/certificate.service';
import { ApiService } from '../service/api.service';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import * as FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Meta, MetaDefinition } from '@angular/platform-browser';

import { FeedbackComponent } from '../feedback/feedback.component';
import { FeedbacknotifyComponent } from '../feedbacknotify/feedbacknotify.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-badge-detail',
  templateUrl: './badge-detail.component.html',
  styleUrls: ['./badge-detail.component.css']
})
export class BadgeDetailComponent implements OnInit {
  baseUrl = env.baseUrl;
  appName = env.project_name;
  siteName = env.project_site;
  progressGif = env.progressGif;
  public moment = moment;
  selectedCertificate: any = {};
  certiId = '';
  badgeDetail: any = {};
  modelOpen = false;
  process = true;
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
  constructor(
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
  ) { }

  ngOnInit() {
    jQuery('body').addClass('separatePage');
    this.getLanguages();
    this.route.queryParams.subscribe(res => {
      this.certiId = res.id;
      this.catchPageCall();
      if (this.certiId) {
        // Get certificate details based on certificate id
        this.certiService.getBadgeDetail(this.certiId).subscribe(
          data => {
            this.no_results = false;
            setTimeout(() => {
              this.process = false;
            }, 8000);
            this.badgeDetail = data;
            this.addMetaTag();
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
            this.modelOpen = true;
          },
          err => {
            this.process = false;
            this.modelOpen = false;
            this.certiSelected = false;
            this.no_results = true;
            setTimeout(() => {
              this.common.openSnackBar('no_detail_found', 'Close');
            }, 1000);
          }
        );
      } else {
        this.no_results = true;
        this.process = false;
        setTimeout(() => {
          this.common.openSnackBar('no_detail_found', 'Close');
        }, 1000);
      }
    });
  }

  addMetaTag() {
    this.metaService.updateTag({ name: 'title', content: this.appName });
    this.metaService.updateTag({ name: 'description', content: this.badgeDetail.title });
    this.metaService.updateTag({ name: 'url', content: this.baseUrl + '/badgedetail?id=' + this.certiId });
    this.metaService.updateTag({ name: 'image', content: this.badgeDetail.social_share_image});
    this.metaService.updateTag({ name: 'type', content: 'website' });
    this.metaService.updateTag({ name: 'robots', content: 'index,follow' });
    this.metaService.updateTag({ property: 'og:title', content: this.appName });
    this.metaService.updateTag({ property: 'og:description', content: this.badgeDetail.title });
    this.metaService.updateTag({ property: 'og:url', content: this.baseUrl + '/badgedetail?id=' + this.certiId });
    this.metaService.updateTag({ property: 'og:image', content: this.badgeDetail.social_share_image });
    this.metaService.updateTag({ property: 'og:image:type', content: this.badgeDetail.social_share_image });
    this.metaService.addTag({ property: 'og:type', content: 'website' });
  }

  catchPageCall() {
    this.apiService.pageCalled(this.certiId).subscribe(
      data => {});
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

  onFeedback() {
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      const feedbackRes = result;
      if (feedbackRes.result == 'yes') {
        const dialogNotify = this.dialog.open(FeedbacknotifyComponent, {
          data: {
          }
        });
      }
    });
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

}

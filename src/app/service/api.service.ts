import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { environment as env } from '../../environments/environment';
import { CommonService } from './common.service';
import { Subject } from 'rxjs';

@Injectable()
export class ApiService {
  user: any = {
    'id': null,
    'first_name': null,
    'last_name': null,
    'email': null,
    'profile': null,
    'register_type': null,
    'unique_key': null,
    'is_student_search': false,
    'search_student': false,
    'profile_details': {
      'avatar': null,
      'is_tutored': true,
      'created': '',
      'allow_api': false,
      'has_subscription': false,
      'product_step': 0,
      'is_private_user': false,
      'bio_description': '',
      'share_my_credential_to_the_repository': false
    },
    'cache': false
  };
  userType: any;
  public is_tutorial: any = true;
  public pages: any = '';
  showLogo = true;
  studentDisplay = true;
  studentSearchDisplay = true;
  shareToRepository = true;
  public wallet: any;
  public remaining_wallet: any;
  public certificateRate: any;
  public BadgeRate: any;
  course_count: any;
  diploma_count: any;
  pendingCertiCount: any;
  showTooltip = false;
  matrixData: any = {};
  baseUrl = env.baseUrl;
  public is_student = false;
  public all_stud_count = new Subject();
  public all_course_count = new Subject();
  public is_smtp_on = new Subject();
  public all_certificate_count = new Subject();
  public all_achivemtns = new Subject();
  public createdDate;
  public is_payment_renewal: any = true;
  public previousUrl: string;
  public currentUrl: string;
  public userVerified: any = false;
  public blockchain_client: any;
  public displaySideNav = new Subject();
  public testMode = new Subject();
  resLangData: any;
  public is_gdpr: any = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private common: CommonService,
    private translate: TranslateService
  ) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
    this.displaySideNav.next(true);
  }

  contactUs(params: any) {
    return this.http.post(env.url + 'users/contact/us/', params);
  }

  userRegistration(params: any) {
    return this.http.post(env.url + 'auth/registration/', params);
  }

  userReRegistration(params: any) {
    return this.http.post(env.url + 'users/re/register/', params);
  }

  verfyEmail(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(env.url + 'users/verify/email/', params, httpOption);
  }

  userLogin(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(env.url + 'auth/login/', params, httpOption);
  }

  adminverifyLogin(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(env.url + 'users/validate/admin/', params, httpOption);
  }

  isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  getRegistereduserDetails(email) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const api = 'users/exists/check/?email=' + email;
    return this.http.get(env.url + api, httpOption);
  }

  getUserProfile() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const api = (this.userType === '1') ? 'users/student/profile/' : 'users/publisher/profile/';
    return this.http.get(env.url + api + `${this.user.profile_id}/`, httpOption);
  }

  getReqResDetails(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/metrics/${params}`, httpOption);
  }

  getActivityCountDetails(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/activity/graph/${params}`, httpOption);
  }

  getAdminMailNotify() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/batch/default/`);
  }

  findUserDatas(params, pui) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/public-student-list/?${params}&pui=${pui}`);
  }

  findUserDataswithoutpui(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/public-student-list/?${params}`);
  }

  updateInitialTour() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/tutor/done/', httpOption);
  }

  getStudentDetail(studentId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/students/${studentId}/`, httpOption);
  }

  getWalletReturn() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/certificate/count/', httpOption);
  }

  getWallet() {
    this.wallet = '';
    this.pendingCertiCount = '';
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.get(env.url + 'users/certificate/count/', httpOption).subscribe(
      data => {
        this.wallet = data['count']['wallet'];
        this.diploma_count = data['count']['achievements_count'];
        this.course_count = data['count']['Acourse_count'];
        this.pendingCertiCount = data['count']['certificate_remaining'];
        this.matrixData = data['count'];
        this.remaining_wallet = data['count']['remaining_wallet'];
        this.certificateRate = data['count']['cer_amount'];
        this.BadgeRate = data['count']['digi_amount'];
        if (data['count']['all_stud_count'] >= 2) {
          this.all_stud_count.next(false);
        } else {
          this.all_stud_count.next(true);
        }
        if (data['count']['all_course_count'] > 0) {
          this.all_course_count.next(false);
        } else {
          this.all_course_count.next(true);
        }
        if (data['count']['all_certificate_count'] > 0) {
          this.all_certificate_count.next(false);
        } else {
          this.all_certificate_count.next(true);
        }
        if (data['count']['all_achivemtns'] > 0) {
          this.all_achivemtns.next(false);
          this.all_stud_count.next(false);
          this.all_course_count.next(false);
          this.all_certificate_count.next(false);
        } else {
          this.all_achivemtns.next(true);
        }
      },
      err => {
        // console.log(err);
      }
    );
  }

  updateUserProfile(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const api = (this.userType === '1') ? 'users/student/profile/' : 'users/publisher/profile/';
    return this.http.put(env.url + api + `${this.user.profile_id}/`, params, httpOption);
  }

  shareUpdate(type) {
      const httpOption = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
          'x-registertype': localStorage.getItem('user_reg_type')
        })
      };
      return this.http.post(env.url + 'users/activity/capture/', {capture_type: type} , httpOption);
  }

  pageCalled(certId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(env.url + 'users/embededpage/activity/capture/', {certificate_id: certId, capture_type: 3}, httpOption);
  }

  updateGeneralDetails(formData) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + 'users/organisation/language/update/', formData, httpOption);
  }

  updateSandBox(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + 'users/sandbox/', params, httpOption);
  }

  updateAchTestMode(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + 'users/testmode/achivement/', params, httpOption);
  }

  updateSmtpMail(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + 'users/email/setting/update/', params, httpOption);
  }

  updateUser(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        // 'x-registertype' : localStorage.getItem('user_reg_type')
      })
    };
    return this.http.put(env.url + `auth/user/`, params, httpOption);
  }

  feedbacksend(params) {
    const httpOption = {
      headers: new HttpHeaders({
      })
    };
    return this.http.post(env.url + `users/feedback/`, params, httpOption);
  }

  uploadFile(file) {
    const httpOptionFile = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'files/uploads/', file, httpOptionFile);
  }

  uploadMultipleFile(file) {
    const httpOptionFile = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'files/document/upload/', file, httpOptionFile);
  }

  getOrgDocFile() {
    const httpOptionFile = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'files/document/upload/', httpOptionFile);
  }

  updateAccessDetails(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + 'users/custom/permission/', params, httpOption);
  }

  deleteOrgDocFile(id) {
    const httpOptionFile = {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.delete(env.url + 'files/uploads/' + `${id}/`, httpOptionFile);
  }

  uploadFileProcess(file) {
    const httpOptionFile = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const req = new HttpRequest('POST', env.url + 'files/uploads/', file, httpOptionFile);
    return this.http.request(req);
  }

  logoutAdminuser() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(env.url + 'admin/logout/', '', httpOption).subscribe(
      data => {
        console.log(data);
      });
  }

  logoutAdminLogin() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(env.url + 'auth/logout/', '', httpOption).subscribe(
      data => {
        this.codeBasedSetLanguage('EN');
        // localStorage.removeItem('workflow_db_id');
        localStorage.removeItem('redirectProduct');
        localStorage.removeItem('option');
        localStorage.removeItem('in_batch_id_dynamic');
        localStorage.removeItem('out_batch_id_dynamic');
        localStorage.removeItem('activity_id_dynamic');
        localStorage.removeItem('user_details');
        localStorage.removeItem('type');
        localStorage.removeItem('paymentPlan');
        // localStorage.removeItem('user_reg_type');
        localStorage.removeItem('user_email');
        localStorage.removeItem('token');
        localStorage.removeItem('redirectwhichcert');
        localStorage.removeItem('redirectWhich');
        localStorage.removeItem('redirectFrom');
        localStorage.removeItem('searchworkflowid');
        localStorage.removeItem('searchoutbatchid');
        localStorage.removeItem('activitySearchData');
        localStorage.removeItem('selectOutBatchID');
        localStorage.removeItem('correctEditId');
        localStorage.removeItem('actDetailPageSize');
        // localStorage.clear();
      });
  }

  logout() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'auth/logout/', '', httpOption).subscribe(
      data => {
        this.codeBasedSetLanguage('EN');
        localStorage.removeItem('firstTimeShare');
        localStorage.removeItem('workflow_db_id');
        localStorage.removeItem('redirectProduct');
        localStorage.removeItem('option');
        localStorage.removeItem('in_batch_id_dynamic');
        localStorage.removeItem('out_batch_id_dynamic');
        localStorage.removeItem('activity_id_dynamic');
        localStorage.removeItem('user_details');
        localStorage.removeItem('type');
        localStorage.removeItem('paymentPlan');
        localStorage.removeItem('user_reg_type');
        localStorage.removeItem('user_email');
        localStorage.removeItem('token');
        localStorage.removeItem('redirectwhichcert');
        localStorage.removeItem('redirectWhich');
        localStorage.removeItem('redirectFrom');
        localStorage.removeItem('searchworkflowid');
        localStorage.removeItem('searchoutbatchid');
        localStorage.removeItem('activitySearchData');
        localStorage.removeItem('selectOutBatchID');
        localStorage.removeItem('correctEditId');
        localStorage.removeItem('actDetailPageSize');
        localStorage.clear();
        this.router.navigate(['signin']);
      },
      err => {
        this.codeBasedSetLanguage('EN');
        localStorage.removeItem('firstTimeShare');
        localStorage.removeItem('workflow_db_id');
        localStorage.removeItem('redirectwhichcert');
        localStorage.removeItem('redirectWhich');
        localStorage.removeItem('redirectFrom');
        localStorage.removeItem('redirectProduct');
        localStorage.removeItem('option');
        localStorage.removeItem('in_batch_id_dynamic');
        localStorage.removeItem('out_batch_id_dynamic');
        localStorage.removeItem('activity_id_dynamic');
        localStorage.removeItem('user_details');
        localStorage.removeItem('type');
        localStorage.removeItem('paymentPlan');
        localStorage.removeItem('user_reg_type');
        localStorage.removeItem('user_email');
        localStorage.removeItem('searchworkflowid');
        localStorage.removeItem('searchoutbatchid');
        localStorage.removeItem('token');
        localStorage.removeItem('activitySearchData');
        localStorage.removeItem('selectOutBatchID');
        localStorage.removeItem('correctEditId');
        localStorage.removeItem('actDetailPageSize');
        // localStorage.clear();
        if (localStorage.getItem('fromqrscanned') === '' && localStorage.getItem('fromqrscanned') === null && typeof localStorage.getItem('fromqrscanned') === 'undefined') {
          this.router.navigate(['signin']);
        }
      }
    );
  }

  logoutAdminMember() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(env.url + 'auth/logout/', '', httpOption);
  }

  getUserPub() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
      })
    };
    return this.http.get(env.url + 'auth/user/', httpOption);
  }

  public sidenavGetUser() {
    var refreshtoken = localStorage.getItem('token');
    var reloadActivity = localStorage.getItem('reloadActivity');
    var reloadoption = localStorage.getItem('reloadoption');
    var reloadtype = localStorage.getItem('reloadtype');
    var reloadworkflow = localStorage.getItem('reloadworkflow');
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('user_reg_type') ? localStorage.getItem('user_reg_type') : null
      })
    };
    return this.http.get(env.url + 'auth/user/', httpOption).subscribe(
      data => {
        this.user = data;
        localStorage.setItem('user_email', this.user.email);
        localStorage.setItem('user_details', JSON.stringify(this.user));
        this.showLogo = this.user.vouttun_logo;
        this.studentDisplay = this.user.student_delete;
        this.studentSearchDisplay = this.user.search_student;
        this.shareToRepository = this.user.profile_details.share_my_credential_to_repository;
        console.log(this.shareToRepository);
        this.is_payment_renewal = this.user.profile_details.revive;
        this.is_gdpr = this.user.profile_details.gdpr;
        this.is_tutorial = this.user.profile_details.is_tutored;
        this.createdDate = this.user.profile_details.created;
        this.is_student = this.user.is_student;
        this.pages = this.user.pages;
        this.userVerified = this.user.is_verified;
        this.blockchain_client = this.user.blockchain_client;
        this.user.register_type = localStorage.getItem('user_reg_type') ? localStorage.getItem('user_reg_type') : this.user.register_type;
        this.userType = localStorage.getItem('user_reg_type') ? localStorage.getItem('user_reg_type') : this.user.register_type;
        localStorage.setItem('userTypeOriginal', this.userType);
        if (localStorage.getItem('token') === null) {
          localStorage.setItem('token', refreshtoken);
        }
        if (this.user.profile_details.had_email_setup) {
          this.is_smtp_on.next(true);
        } else {
          this.is_smtp_on.next(false);
        }
        if (this.user.profile_details.test_mode) {
          this.testMode.next(true);
        } else {
          this.testMode.next(false);
        }
        if ((localStorage.getItem('option') === null || typeof localStorage.getItem('option') === 'undefined') && reloadoption !== null && typeof reloadoption !== 'undefined') {
          localStorage.setItem('option', reloadoption);
        }

        if ((localStorage.getItem('type') === null || typeof localStorage.getItem('type') === 'undefined') && reloadtype !== null && typeof reloadtype !== 'undefined') {
          localStorage.setItem('type', reloadtype);
        }

        if ((localStorage.getItem('workflow_db_id') === null || typeof localStorage.getItem('workflow_db_id') === 'undefined') && reloadworkflow !== null && typeof reloadworkflow !== 'undefined') {
          localStorage.setItem('workflow_db_id', reloadworkflow);
        }

        this.menuaccess();
        if (this.user.register_type !== '1') {
          this.getWallet();
        }
        if (this.user.language_key) {
          this.setLanguage({ language_key: this.user.language_key, language_code: this.user.language_code });
        }

        if (this.router.url.indexOf('/student/secure/') !== -1 || this.router.url.indexOf('/securelog/') !== -1 || this.router.url.indexOf('/activity') !== -1 || this.router.url === '/signin' || this.router.url === '/signup' || this.router.url === '/') {
          if (this.user.register_type === '1') {
            localStorage.setItem('stud_org_logo', this.user.university_avatar ? this.user.university_avatar : env.white_logo);
            this.router.navigate(['/certificates']);
          }
          if (this.user.register_type === '5') {
            if (this.user.pages.issue_certificate) {
              if (localStorage.getItem('type')) {
                if (this.user.pages.issue_certificate) {
                  if (reloadActivity == 'yes') {
                    localStorage.removeItem('reloadActivity');
                    localStorage.removeItem('reloadoption');
                    localStorage.removeItem('reloadtype');
                    localStorage.removeItem('refreshtoken');
                    localStorage.removeItem('reloadworkflow');
                    this.router.navigateByUrl('/productcertificate', { skipLocationChange: true }).then(() =>
                      this.router.navigate([`activity`]));
                  } else {
                    this.router.navigate(['/activity']);
                  }
                } else if (this.user.pages.account_settings) {
                  this.router.navigate(['/accountsetting']);
                } else if (this.user.pages.certificate) {
                  this.router.navigate(['/productcertificate']);
                } else if (this.user.pages.students) {
                  this.router.navigate(['/productlist']);
                } else if (this.user.pages.change_password) {
                  this.router.navigate(['/changepwd']);
                } else {
                  this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
                  this.router.navigate(['/signin']);
                }
              } else {
                if (this.user.pages.issue_certificate && this.user.profile_details.new_step_value !== 0) {
                  this.router.navigate(['/activity']);
                } else if (this.user.pages.account_settings) {
                  this.router.navigate(['/accountsetting']);
                } else if (this.user.pages.certificate) {
                  this.router.navigate(['/productcertificate']);
                } else if (this.user.pages.students) {
                  this.router.navigate(['/productlist']);
                } else if (this.user.pages.change_password) {
                  this.router.navigate(['/changepwd']);
                } else {
                  this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
                  this.router.navigate(['/signin']);
                }
              }
            } else if (this.user.pages.dashboard_prv) {
              this.router.navigate(['/product/dashboard']);
            } else if (this.user.pages.certificate) {
              this.router.navigate(['/productcertificate']);
            } else if (this.user.pages.students) {
              this.router.navigate(['/productlist']);
            } else if (this.user.pages.member_menu_pre) {
              this.router.navigate(['/members']);
            } else if (this.user.pages.workflow_menu_pre) {
              this.router.navigate(['/workflowlist']);
            } else if (this.user.pages.download_activities_pre) {
              this.router.navigate(['/downloadactivitydata']);
            } else if (this.user.pages.producttrace_pre) {
              this.router.navigate(['/activitytrace']);
            } else if (this.user.pages.producttrack_pre) {
              this.router.navigate(['/activitytrack']);
            } else if (this.user.pages.productloc_pre) {
              this.router.navigate(['/activityreport']);
            } else if (this.user.pages.account_settings) {
              this.router.navigate(['/accountsetting']);
            } else if (this.user.pages.canned_message_pre) {
              this.router.navigate(['/canned']);
            } else if (this.user.pages.change_password) {
              this.router.navigate(['/changepwd']);
            } else {
              this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
              this.router.navigate(['/signin']);
            }
          }
          if (this.user.register_type === '2') {
            localStorage.setItem('stud_org_logo', this.user.university_avatar ? this.user.university_avatar : env.white_logo);
            if (!this.user.university_avatar) {
              this.router.navigate(['/accountsetting']);
            } else {
              this.router.navigate(['/publisherdash']);
            }
          }
          if (this.user.register_type === '4') {
            localStorage.setItem('stud_org_logo', this.user.university_avatar ? this.user.university_avatar : env.white_logo);
            if (this.user.pages.dashboard) {
              // setTimeout(() => {
              this.router.navigate(['/publisherdash']);
              // }, 8000);
            } else if (this.user.pages.students) {
              // setTimeout(() => {
              this.router.navigate(['/students']);
              // }, 8000);
            } else if (this.user.pages.course) {
              this.router.navigate(['/usercourse']);
            } else if (this.user.pages.certificate) {
              this.router.navigate(['/usercertificate']);
            } else if (this.user.pages.issue_certificate || this.user.pages.allow_search) {
              this.router.navigate(['/issuecertificate']);
            } else if (this.user.pages.logs_prv) {
              this.router.navigate(['/logs']);
            } else if (this.user.pages.teammembers_prv) {
              this.router.navigate(['/teamlist']);
            } else if (this.user.pages.cannedmessage_prv) {
              this.router.navigate(['/canned']);
            } else if (this.user.pages.api_prv) {
              this.router.navigate(['/planapi']);
            } else if (this.user.pages.bouncedmail_prv) {
              this.router.navigate(['/mandril']);
            } else if (this.user.pages.account_settings) {
              this.router.navigate(['/accountsetting']);
            } else if (this.user.pages.change_password) {
              this.router.navigate(['/changepwd']);
            }
          }
          if (this.user.register_type === '6') {
            this.router.navigate(['/languages']);
          }
          if (this.user.register_type === '8') {
            this.router.navigate(['/matricgraph']);
          }
          if (this.user.register_type === '9') {
            if (this.user.pages.certificate) {
              this.router.navigate(['/productcertificate']);
            } else if (this.user.pages.account_settings) {
              this.router.navigate(['/accountsetting']);
            } else if (this.user.pages.change_password) {
              this.router.navigate(['/changepwd']);
            } else {
              this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
              this.router.navigate(['/signin']);
            }
          }
        } else {
          this.router.navigate([this.router.url]);
        }


      },
      err => {
        console.log('hii' + '-----------');
        console.log(err);
        this.logout();
        this.common.openSnackBar('Invalid Login, Please login again!', 'Close');
        this.router.navigate(['/signin']);
      }
    );
  }

  public getUser() {
    var refreshtoken = localStorage.getItem('token');
    var reloadActivity = localStorage.getItem('reloadActivity');
    var reloadoption = localStorage.getItem('reloadoption');
    var reloadtype = localStorage.getItem('reloadtype');
    var reloadworkflow = localStorage.getItem('reloadworkflow');
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('user_reg_type') ? localStorage.getItem('user_reg_type') : null
      })
    };
    console.log(localStorage.getItem('token'));
    console.log(localStorage.getItem('user_reg_type'));
    console.log(httpOption);
    return this.http.get(env.url + 'auth/user/', httpOption).subscribe(
      data => {
        this.user = data;
        localStorage.setItem('user_email', this.user.email);
        localStorage.setItem('user_details', JSON.stringify(this.user));
        this.showLogo = this.user.vouttun_logo;
        this.studentDisplay = this.user.student_delete;
        this.studentSearchDisplay = this.user.search_student;
        this.shareToRepository = this.user.profile_details.share_my_credential_to_repository;
        this.is_payment_renewal = this.user.profile_details.revive;
        this.is_gdpr = this.user.profile_details.gdpr;
        this.is_tutorial = this.user.profile_details.is_tutored;
        this.createdDate = this.user.profile_details.created;
        this.is_student = this.user.is_student;
        this.pages = this.user.pages;
        this.userVerified = this.user.is_verified;
        this.blockchain_client = this.user.blockchain_client;
        this.user.register_type = localStorage.getItem('user_reg_type') ? localStorage.getItem('user_reg_type') : this.user.register_type;
        this.userType = localStorage.getItem('user_reg_type') ? localStorage.getItem('user_reg_type') : this.user.register_type;
        localStorage.setItem('userTypeOriginal', this.userType);
        if (localStorage.getItem('token') === null) {
          localStorage.setItem('token', refreshtoken);
        }
        if (this.user.profile_details.had_email_setup) {
          this.is_smtp_on.next(true);
        } else {
          this.is_smtp_on.next(false);
        }
        if (this.user.profile_details.test_mode) {
          this.testMode.next(true);
        } else {
          this.testMode.next(false);
        }
        if ((localStorage.getItem('option') === null || typeof localStorage.getItem('option') === 'undefined') && reloadoption !== null && typeof reloadoption !== 'undefined') {
          localStorage.setItem('option', reloadoption);
        }

        if ((localStorage.getItem('type') === null || typeof localStorage.getItem('type') === 'undefined') && reloadtype !== null && typeof reloadtype !== 'undefined') {
          localStorage.setItem('type', reloadtype);
        }

        if ((localStorage.getItem('workflow_db_id') === null || typeof localStorage.getItem('workflow_db_id') === 'undefined') && reloadworkflow !== null && typeof reloadworkflow !== 'undefined') {
          localStorage.setItem('workflow_db_id', reloadworkflow);
        }

        this.menuaccess();
        if (this.user.register_type !== '1') {
          this.getWallet();
        }
        if (this.user.language_key) {
          this.setLanguage({ language_key: this.user.language_key, language_code: this.user.language_code });
        }
        if (this.router.url.indexOf('/student/secure/') !== -1 || this.router.url.indexOf('/autologin/') !== -1 || this.router.url.indexOf('/securelog/') !== -1 || this.router.url.indexOf('/activity') !== -1 || this.router.url === '/signin' || this.router.url === '/signup' || this.router.url === '/') {
          if (this.user.register_type === '1') {
            localStorage.setItem('stud_org_logo', this.user.university_avatar ? this.user.university_avatar : env.white_logo);
            localStorage.setItem('firstTimeShare', 'false')
            this.router.navigate(['/certificates']);
          }
          if (this.user.register_type === '3' || this.user.register_type === '0') {
            this.router.navigate(['/product/dashboard']);
          }
          if (this.user.register_type === '5') {
            if (this.user.pages.issue_certificate) {
              if (localStorage.getItem('type')) {
                if (this.user.pages.issue_certificate) {
                  if (reloadActivity == 'yes') {
                    localStorage.removeItem('reloadActivity');
                    localStorage.removeItem('reloadoption');
                    localStorage.removeItem('reloadtype');
                    localStorage.removeItem('refreshtoken');
                    localStorage.removeItem('reloadworkflow');
                    this.router.navigateByUrl('/productcertificate', { skipLocationChange: true }).then(() =>
                      this.router.navigate([`activity`]));
                  } else {
                    this.router.navigate(['/activity']);
                  }
                } else if (this.user.pages.account_settings) {
                  this.router.navigate(['/accountsetting']);
                } else if (this.user.pages.certificate) {
                  this.router.navigate(['/productcertificate']);
                } else if (this.user.pages.students) {
                  this.router.navigate(['/productlist']);
                } else if (this.user.pages.change_password) {
                  this.router.navigate(['/changepwd']);
                } else {
                  this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
                  this.router.navigate(['/signin']);
                }
              } else {
                if (this.user.pages.issue_certificate && this.user.profile_details.new_step_value !== 0) {
                  this.router.navigate(['/activity']);
                } else if (this.user.pages.account_settings) {
                  this.router.navigate(['/accountsetting']);
                } else if (this.user.pages.certificate) {
                  this.router.navigate(['/productcertificate']);
                } else if (this.user.pages.students) {
                  this.router.navigate(['/productlist']);
                } else if (this.user.pages.change_password) {
                  this.router.navigate(['/changepwd']);
                } else {
                  this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
                  this.router.navigate(['/signin']);
                }
              }
            } else if (this.user.pages.dashboard_prv) {
              this.router.navigate(['/product/dashboard']);
            } else if (this.user.pages.certificate) {
              this.router.navigate(['/productcertificate']);
            } else if (this.user.pages.students) {
              this.router.navigate(['/productlist']);
            } else if (this.user.pages.member_menu_pre) {
              this.router.navigate(['/members']);
            } else if (this.user.pages.workflow_menu_pre) {
              this.router.navigate(['/workflowlist']);
            } else if (this.user.pages.download_activities_pre) {
              this.router.navigate(['/downloadactivitydata']);
            } else if (this.user.pages.producttrace_pre) {
              this.router.navigate(['/activitytrace']);
            } else if (this.user.pages.producttrack_pre) {
              this.router.navigate(['/activitytrack']);
            } else if (this.user.pages.productloc_pre) {
              this.router.navigate(['/activityreport']);
            } else if (this.user.pages.account_settings) {
              this.router.navigate(['/accountsetting']);
            } else if (this.user.pages.canned_message_pre) {
              this.router.navigate(['/canned']);
            } else if (this.user.pages.change_password) {
              this.router.navigate(['/changepwd']);
            } else {
              this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
              this.router.navigate(['/signin']);
            }
          }
          if (this.user.register_type === '2') {
            localStorage.setItem('stud_org_logo', this.user.university_avatar ? this.user.university_avatar : env.white_logo);
            if (!this.user.university_avatar) {
              this.router.navigate(['/accountsetting']);
            } else {
              this.router.navigate(['/publisherdash']);
            }
          }
          if (this.user.register_type === '4') {
            localStorage.setItem('stud_org_logo', this.user.university_avatar ? this.user.university_avatar : env.white_logo);
            if (this.user.pages.dashboard) {
              // setTimeout(() => {
              this.router.navigate(['/publisherdash']);
              // }, 8000);
            } else if (this.user.pages.students) {
              // setTimeout(() => {
              this.router.navigate(['/students']);
              // }, 8000);
            } else if (this.user.pages.course) {
              this.router.navigate(['/usercourse']);
            } else if (this.user.pages.certificate) {
              this.router.navigate(['/usercertificate']);
            } else if (this.user.pages.issue_certificate || this.user.pages.allow_search) {
              this.router.navigate(['/issuecertificate']);
            } else if (this.user.pages.logs_prv) {
              this.router.navigate(['/logs']);
            } else if (this.user.pages.teammembers_prv) {
              this.router.navigate(['/teamlist']);
            } else if (this.user.pages.cannedmessage_prv) {
              this.router.navigate(['/canned']);
            } else if (this.user.pages.api_prv) {
              this.router.navigate(['/planapi']);
            } else if (this.user.pages.bouncedmail_prv) {
              this.router.navigate(['/mandril']);
            } else if (this.user.pages.account_settings) {
              this.router.navigate(['/accountsetting']);
            } else if (this.user.pages.change_password) {
              this.router.navigate(['/changepwd']);
            }
          }
          if (this.user.register_type === '6') {
            this.router.navigate(['/languages']);
          }
          if (this.user.register_type === '8') {
            this.router.navigate(['/matricgraph']);
          }
          if (this.user.register_type === '9') {
            if (this.user.pages.certificate) {
              this.router.navigate(['/productcertificate']);
            } else if (this.user.pages.account_settings) {
              this.router.navigate(['/accountsetting']);
            } else if (this.user.pages.change_password) {
              this.router.navigate(['/changepwd']);
            } else {
              this.common.openSnackBar('you_dont_have_anyprivillage', 'Close');
              this.router.navigate(['/signin']);
            }
          }
        } else {
          this.router.navigate([this.router.url]);
        }
      },
      err => {
        console.log('hiiiiii');
        console.log(err);
        this.logout();
        this.common.openSnackBar('Invalid Login, Please login again!', 'Close');
        this.router.navigate(['/signin']);
      }
    );
  }

  public menuaccess() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/menu/`, httpOption).subscribe(res => {
      this.pages = res;
    });
  }

  menuPageaccess() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/menu/`, httpOption);
  }

  resetLink(params) {
    return this.http.post(env.url + 'auth/password/reset/', params);
  }

  changePassword(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'auth/password/change/', params, httpOption);
  }

  contactFrom(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'users/credentials/contact-form/', params, httpOption);
  }

  getEhereumPrice() {
    return this.http.get('https://api.coinmarketcap.com/v1/ticker/ethereum/');
  }

  async listDiscount() {
    return await this.http.get(env.url + 'users/discount/').toPromise();
  }

  toggleLogo() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.get(env.url + 'users/logo/', httpOption).subscribe(data => {
      this.getUser();
    });
  }

  studentEnable() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.get(env.url + 'users/student_delete/', httpOption).subscribe(data => {
      this.getUser();
    });
  }

  studentSearchEnable(checked) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.put(env.url + 'users/seach/update/', { 'is_student_search': checked }, httpOption).subscribe(data => {
      this.getUser();
    });
  }

  searchProduct(barcode) {
    return this.http.get(env.url + `product/barcode/${barcode}/`);
  }

  getLanguage() {
    return this.http.get(env.url + 'languages/all/');
  }

  getLangList() {
    return this.http.get(env.url + 'languages/list/');
  }

  getOrgLogo(orgid) {
    return this.http.get(env.url + 'users/logo/' + orgid + '/');
  }

  selectLanguage(lang) {
    console.log('hi');
    console.log(lang);
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.post(env.url + 'languages/user/', { language_key: lang.id }, httpOption).subscribe(
      res => {
        this.setLanguage(lang);
      },
      err => {
        // console.log(err);
      }
    );
  }

  setLanguage(lang) {
    this.http.get(env.url + `languages/all/${lang.language_key}/`).subscribe(data => {
      localStorage.setItem('language_key', lang.language_key);
      localStorage.setItem('language_code', lang.language_code);
      this.translate.setDefaultLang(lang.code);
      this.translate.setTranslation(lang, data);
      this.translate.use(lang);
    });
  }

  setSeparateLanguage(lang) {
    this.http.get(env.url + `languages/all/${lang.language_key}/`).subscribe(data => {
      this.translate.setDefaultLang(lang.code);
      this.translate.setTranslation(lang, data);
      this.translate.use(lang);
    });
  }

  codeBasedSetLanguage(langCode) {
    this.http.get(env.url + `languages/all/code/${langCode}/`).subscribe(data => {
      this.resLangData = data;
      localStorage.setItem('language_key', this.resLangData.id);
      localStorage.setItem('language_code', langCode);
      this.translate.setDefaultLang(langCode);
      this.translate.setTranslation('lang', this.resLangData);
      this.translate.use('lang');
    });
  }

  updateLang(lang) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + 'users/organisation/language/update/', lang, httpOption);
  }

  updateStudentShare() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      })
    };
    console.log(httpOption)
    console.log(localStorage.getItem('token'))
    return this.http.put(env.url + 'users/studentshare/done/', '', httpOption);
  }

  deleteCert(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `certificates/certificate-delete/`, params, httpOption);
  }

  deleteCourse(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `certificates/course-delete/`, params, httpOption);
  }

  renewalOptionEnable() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.get(env.url + 'users/plan/revive/', httpOption).subscribe(data => {
      this.getUser();
    });
  }

  activityBatchDetail(batchid) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/certificate/list/${batchid}/`, httpOption);
  }

  activityBatchDetailWithoutToken(batchid, timezoneoffset, lang) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(env.url + `product/certificate/list/batch/?batch=${batchid}&timezoneoffset=${timezoneoffset}&lang=${lang}`, httpOption);
  }

  activityLocDetail(batchid, workflow) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/map/product/?batch=${batchid}&workflow=${workflow}`, httpOption);
  }

  activityLocDetailWithoutToken(batchid, workflow) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(env.url + `product/map/product/?batch=${batchid}&workflow=${workflow}`, httpOption);
  }

  getLatestActivity() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/latest/activity/`, httpOption);
  }

  initmeta() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get(env.url + `files/project-logo/`, httpOption);
  }
}
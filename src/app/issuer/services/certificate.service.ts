import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { ApiService } from '../../service/api.service';

@Injectable()
export class CertificateService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }
  public redirectCourse = new Subject();
  public redirectCerts = new Subject();

  getBusinessUnitList() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/business/unit/', httpOption);
  }

  getCannedMessageAll() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/canned-message/all/', httpOption);
  }

  getMarketingMsg() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/marketing/message/', httpOption);
  }

  getFaqData() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/faq/list/', httpOption);
  }

  editMarketingTool(id, formData) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `certificates/marketing/message/${id}/`, formData, httpOption)
  }

  getDegreeList(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/digree/list/', { 'business_unit': id }, httpOption);
  }

  getCourseList(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/course/list/', { cert_id: id }, httpOption)
  }

  getCertificates(searchData?: any) {
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key] !== null) {
        params.set(key, searchData[key]);
      }
    }
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/student-certificates/all/', httpOption);
  }

  getTopCertificates(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/top/', httpOption);
  }

  getBadgeLists() {
    const httpOption = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const req = new HttpRequest('GET', env.url + 'certificates/course/templates/list/', httpOption);
    return this.http.request(req);
  }

  createColorScheme(params) {
    const httpOptionFile = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const req = new HttpRequest('POST', env.url + 'users/colorchanges/create/', params, httpOptionFile);
    return this.http.request(req);
  }

  getCertLists() {
    const httpOption = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    let req;
    req = new HttpRequest('GET', env.url + 'certificates/templates/list/?email=' + localStorage.getItem('user_email'), httpOption);
    return this.http.request(req);
  }

  getCourses() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'courses/students/list/', httpOption);
  }

  getCoursesAdmin() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'courses/all/', httpOption);
  }

  addCourse(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'courses/all/', params, httpOption);
  }

  getCourseDetail(id) {
    return this.http.get(env.url + `courses/${id}/`);
  }

  getCertificateDetail(id) {
    return this.http.get(env.url + `certificates/students-certificates/${id}/`);
  }

  getIssuersCertificates(searchData?: any, page = 1, baseUrl = env.url + 'certificates/all/?') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl + searchData + '&page=' + page, httpOption);
  }

  getIssuersCertificatesLot(searchData?: any, page = 1, baseUrl = env.url + 'certificates/lot/') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl + searchData, httpOption);
  }

  getIssuersCertificatesOnly(searchData?: any, baseUrl = env.url + 'certificates/?') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl + searchData, httpOption);
  }

  getIssuersCourses(searchData?: any, page = 1, baseUrl = env.url + 'certificates/course/all/?') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl + searchData + '&page=' + page, httpOption);
  }

  getIssuersCoursesOnly(searchData?: any, baseUrl = env.url + 'certificates/course/?') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl + searchData, httpOption);
  }

  getBadgeAll(baseUrl = env.url + 'certificates/badge/auto/search/') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl, httpOption);
  }

  getCertAll(baseUrl = env.url + 'certificates/auto/search/') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl, httpOption);
  }

  getAchieveAll(baseUrl = env.url + 'certificates/achievement/auto/search/') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl, httpOption);
  }

  getLogsAll(baseUrl = env.url + 'certificates/logs/auto/search/') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl, httpOption);
  }

  getEmailLogsAll(baseUrl = env.url + 'certificates/email-logs/auto/search/') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl, httpOption);
  }

  getIssuersCoursesActive(searchData?: any, baseUrl = env.url + 'certificates/course/all/np/') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(baseUrl + searchData, httpOption);
  }
  getIssuersOwnCertificate() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/', httpOption);
  }

  getIssuersCertificateLists(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/issued-certificates/?' + searchData, httpOption);
  }

  resendMailCertificate(searchData?: any, params?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/resend/notify/?' + searchData, params, httpOption);
  }

  getAchievementsCertificateLists(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/public-certificate-list/?' + searchData);
  }

  getIssuerCertificateDetail(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/all/${id}/`, httpOption);
  }

  getAllSkills(searchSkill = '') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/get-skills/?skill=${searchSkill}`, httpOption);
  }

  getNewIssuerCertificateDetail(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/custom/${id}/`, httpOption);
  }

  getStudentCertiDetail(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/student-certificates/all/${id}/`, httpOption);
  }

  getStudentCertWithout(id) {
    return this.http.get(env.url + `certificates/public-certificate/${id}/`);
  }

  getIssuedCertiDetail(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/issued-certificates/${id}/`, httpOption);
  }

  getAchievementCert(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/public-certificate/${id}/`);
  }

  getBlockChainList() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/list/blockchain/`, httpOption);
  }

  addCertificates(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/all/', params, httpOption);
  }

  addNewCertificates(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/custom/', params, httpOption);
  }

  editCertificate(params, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `certificates/all/${id}/`, params, httpOption);
  }

  editNewCertificate(params, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `certificates/custom/${id}/`, params, httpOption);
  }

  deleteCertificates(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.delete(env.url + `certificates/all/${id}/`, httpOption);
  }
  /**
   * @description - Issued the certificate to the student api
   * @param params formdata
   */
  addIssueDetails(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'files/certificates/multi/', params, httpOption);
  }

  getRelatedCertificateList(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/related/certificate/list/', params, httpOption);
  }

  postCertificate(certi_id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/issuer-issue/blockchain/', { cert_id: certi_id }, httpOption);
  }

  getProduct(searchData?: any) {
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key] !== null) {
        params.set(key, searchData[key]);
      }
    }
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'product/all/?' + params.toString(), httpOption);
  }

  addProductData(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'product/all/', params, httpOption);
  }

  addProductCertData(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'product/issue/', params, httpOption);
  }

  getProductCertificate(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key] !== null) {
        params.set(key, searchData[key]);
      }
    }
    return this.http.get(env.url + 'product/certificate/list/?' + params.toString(), httpOption);
  }

  deleteIssuedCertificate(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `certificates/issuer-issue/delete/`, params, httpOption);
  }

  exportMultiPdfFile(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `certificates/bulk-pdf/`, params, httpOption);
  }

  deleteMultipleIssuedCertificate(params, queryString) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `certificates/issuer-issue/multiple-delete/?` + queryString, params, httpOption);
  }

  experiedIssuedCertificate(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `certificates/force/expire/`, params, httpOption);
  }

  shareEmail(id, email) {
    return this.http.post(env.url + `certificates/student-certificates/all/${id}/share/`, { email: email });
  }

  getBadgeDetail(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.get(env.url + `certificates/barcode-scan/${id}/`, httpOption);
  }

  bulkCertificateCreate(params) {
    const httpOptionFile = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'files/certificates/create/', params, httpOptionFile);
  }

  checkBeforeCertPost(params) {
    const httpOptionFile = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'files/certificates/validate/', params, httpOptionFile);
  }

  certificatesUploadFile(file) {
    const httpOptionFile = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const req = new HttpRequest('POST', env.url + 'files/certificates/', file, httpOptionFile);
    return this.http.request(req);
  }

  repeatCallIssueCert(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/issuer-issue/status/', params, httpOption);
  }

  getIssuersCertificateListsExport(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/issued-certificates-export/?' + searchData, httpOption);
  }

  walletMail(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `certificates/create/pass/`, params, httpOption);
  }

  onSharEnDis(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `certificates/social-media-share-option/`, params, httpOption);
  }

  onCertPublicEnDis(params, certId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `certificates/public/update/${certId}/`, params, httpOption);
  }

  requestIssuerUpdate(requestId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/request/update/`, requestId, httpOption);
  }


  addEducationDetails(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/student-education/all/', params, httpOption);
  }

  getAllEducationDetgails() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/student-education/all/', httpOption);
  }

  getEduDetail(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/student-education/${id}/`, httpOption);
  }

  updateEducDetails(params, certId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `certificates/student-education/${certId}/`, params, httpOption);
  }

  deleteEduDetail(certId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.delete(env.url + `certificates/student-education/${certId}/`, httpOption);
  }

}

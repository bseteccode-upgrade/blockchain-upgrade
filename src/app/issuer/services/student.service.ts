import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

@Injectable()
export class StudentService {
  constructor(
    private http: HttpClient
  ) { }

  getGroupList() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/groups/', httpOption);
  }

  getAutoGroupList() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/group/list/', httpOption);
  }

  getStudentNameList() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/student/list/', httpOption);
  }

  getCertBadgeList() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/certbadge/list/', httpOption);
  }

  getStudentList(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/students/?' + searchData, httpOption);
  }

  getStudentData() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/recipient/auto/search/', httpOption);
  }

  getMandrilData(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/email/report/?' + searchData, httpOption);
  }

  getMailLogData(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/email/logs/?' + searchData, httpOption);
  }

  getMailLogDetail(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/email/logs/${id}/`, httpOption);
  }

  getMandrailDetails(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/email/report/${id}/`, httpOption);
  }

  getStudentListOnly(searchData?: any, page = 1) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    searchData = searchData ? '&' + searchData : '';
    return this.http.get(env.url + 'users/students/all/?page=' + page + searchData, httpOption);
  }

  getStudentScroll(searchData?: any, page = 1) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    searchData = searchData ? '&' + searchData : '';
    return this.http.get(env.url + 'users/student/all/?page=' + page + searchData, httpOption);
  }

  getStudentMailAddress() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/multiple/email/', httpOption);
  }

  getStudent(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/students/${id}/`, httpOption);
  }

  getCannedMsgDetails(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/canned-message/${id}/`, httpOption);
  }

  getMailKeywords() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/education/keywords/`, httpOption);
  }

  addStudent(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/students/add/`, params, httpOption);
  }

  editStudent(params, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `users/students/${id}/`, params, httpOption);
  }

  getMailData(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/publiser/email/`, httpOption);
  }

  saveNewMailContent(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/canned-message/all/`, params, httpOption);
  }

  updateCannedMsgMailContent(params, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `users/canned-message/${id}/`, params, httpOption);
  }

  deleteCannedMsg(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.delete(env.url + `users/canned-message/${id}/`, httpOption);
  }

  updateMail(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `users/publiser/email/`, params, httpOption);
  }

  deleteStudent(id, params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/student/account/${id}/`, params, httpOption);
  }

  addNewMailAddress(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/multiple/email/`, params, httpOption);
  }

  resendMandril(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/email/resend/${id}/`, httpOption);
  }

  bulkUpload(file) {
    const httpOptionFile = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const req = new HttpRequest('POST', env.url + 'files/bulk/', file, httpOptionFile);
    return this.http.request(req);
  }

  bulkCreate(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'files/bulk/create/', params, httpOption);
  }

  async bulkCreateWait(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return await this.http.post(env.url + 'files/bulk/create/', params, httpOption).toPromise();
  }

  searchGetStudent(studMail) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/students/search/?search=${studMail}`, httpOption);
  }

  addExsitingStud(param) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/import/student/', param, httpOption);
  }

  findExsitingStud(studsearchtxt) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/check-exist-student/?${studsearchtxt}`, httpOption);
  }

  deleteStudentMailAddrss(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.delete(env.url + `users/multiple/email/${id}/`, httpOption);
  }

  makeMailAsPrimary(id, params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `users/multiple/email/${id}/`, params, httpOption);
  }

  reSendVerifyMail(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/multiple/email/verify/`, params, httpOption);
  }
}

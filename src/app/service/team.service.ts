import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { ApiService } from './api.service';
@Injectable()
export class TeamService {
  baseUrl: string;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
  }

  getTeamList(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const userType = (localStorage.getItem('userTypeOriginal') === '3') ? 'product' : 'users';
    return this.http.get(env.url + userType + `/sub/all/?${searchData}`, httpOption);
  }

  getWFTeamList(searchData?: any, all = false) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    if (all) {
      return this.http.get(env.url + `product/workflow/list/all/`, httpOption);
    } else {
      return this.http.get(env.url + `product/workflow/list/?${searchData}`, httpOption);
    }
  }

  getProductList() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/list/`, httpOption);
  }

  getWFUserListAssigned(wfid, step) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/assigned/members/list/?workflow_id=${wfid}&step=${step}`, httpOption);
  }

  getAllUserWf() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/list/members/`, httpOption);
  }

  getWFData() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/all/`, httpOption);
  }

  getwfmemlists(wfid) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/member/all/list/?workflow_id=${wfid}`, httpOption);
  }

  getMemberList(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/members/all/?${searchData}`, httpOption);
  }

  getOutbatchMemberList(wfId: any, step: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/posted-activity-batch/?workflow_id=${wfId}&step=${step}`, httpOption);
  }

  getReviewerList(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/reviewer/all/?${searchData}`, httpOption);
  }

  getTeamMember(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const userType = (localStorage.getItem('userTypeOriginal') === '3') ? 'product' : 'users';
    return this.http.get(env.url + userType + `/sub/all/${id}/`, httpOption);
  }

  getWFTeamMember(id, step) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    // const userType = (this.userDetails.register_type === '3') ? 'product' : 'users';
    return this.http.get(env.url + `product/workflow/current/?workflow_id=${id}&current_step=${step}`, httpOption);
  }

  getMember(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/member/object/${id}/`, httpOption);
  }

  addMember(formdata) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    // const baseUrl = 'product/member/create/';
    const baseUrl = 'users/sub/team/add/';
    return this.http.post(env.url + baseUrl, formdata, httpOption);
  }

  editMember(formdata, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `product/member/object/${id}/`, formdata, httpOption);
  }

  saveSelectedMem(data) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `product/workflow/activity/member/blocked-reassigned/`, data, httpOption);
  }

  resendMailtoCMPMem(data) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `product/workflow/resend/`, data, httpOption);
  }

  deleteMember(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.delete(env.url + `product/member/object/${id}/`, httpOption);
  }

  addTeamMember(formdata) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    // const baseUrl = (this.userDetails.register_type === '3') ? 'product/sub/create/' : 'users/sub/';
    const baseUrl = 'users/sub/team/add/';
    return this.http.post(env.url + baseUrl, formdata, httpOption);
  }

  addReviewer(formdata) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'product/reviewer/create/', formdata, httpOption);
  }

  editReviewer(formdata, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `product/reviewer/all/${id}/`, formdata, httpOption);
  }

  getReviewer(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/reviewer/all/${id}/`, httpOption);
  }

  editTeamMember(formdata, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const userType = (localStorage.getItem('userTypeOriginal') === '3') ? 'product' : 'users';
    return this.http.put(env.url + userType + `/sub/all/${id}/`, formdata, httpOption);
  }

  editWFMember(formdata) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `product/workflow/member/create/`, formdata, httpOption);
  }

  sendMailWf(data) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `product/first/send/mail/`, data, httpOption);
  }

  deleteTeamMember(id, params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/sub/delete/${id}/`, params, httpOption);
  }

  getFirstStepUserList(workflowId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/list/first-step-members/${workflowId}/`, httpOption);
  }

  deleteWorkFlow(data) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `product/sub/delete/`, data, httpOption);
  }

  deleteWF(data) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `product/workflow/delete/`, data, httpOption);
  }

  cloneWF(data) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/clone/?workflow_id=${data}`, httpOption);
  }

  testModeWF(data) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/change/testmode/?workflow_id=${data}`, httpOption);
  }

  activeWF(data) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/workflow/status/update/?workflow_id=${data}`, httpOption);
  }

 add_competitor(formdata) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    // const baseUrl = 'product/member/create/';
    const baseUrl = 'users/add/competitor/';
    return this.http.post(env.url + baseUrl, formdata, httpOption);
  }

  edit_competitor(formdata) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/update/competitor/`, formdata, httpOption);
  }  


  get_competitor() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `users/get/competitor/`, httpOption);
  }

  delete_competitor(formdata) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + `users/delete/competitor/`, formdata, httpOption);
  }


}

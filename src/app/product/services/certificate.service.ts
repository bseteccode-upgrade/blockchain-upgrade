import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class CertificateService {
  httpOption: any;
  public callFunctionUserListSteps = new Subject();
  public gotGeoCode = new Subject();
  constructor(private http: HttpClient) { }

  getCertificateList(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'product/certificate/list/?' + searchData, httpOption);
  }

  getWFAssingedList(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'product/workflow/assigned/list/?' + searchData, httpOption);
  }

  getLogCertList(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'product/log/list/?' + searchData, httpOption);
  }

  getMailInboxData(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/inbox/?' + searchData, httpOption);
  }

  clearcache(batchId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'product/tirme/clearcache/?batch=' + batchId, httpOption);
  }

  getCertificateListExport(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'product/certificate/list/export/?' + searchData, httpOption);
  }

  updateDeactiveProduct(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `product/activity/status/`, params, httpOption);
  }

  assignCertificate(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'product/issue/', params, httpOption);
  }

  assignEditCertificate(params, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `product/issue/${id}/`, params, httpOption);
  }

  defaultValueStore(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'product/store/default/', params, httpOption);
  }

  fetchDefaultValues(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'product/find/default/', params, httpOption);
  }

  uploadCSV(file) {
    const httpOptionFile = {
      reportProgress: true,
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    const req = new HttpRequest('POST', env.url + 'files/product/', file, httpOptionFile);
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
    return this.http.post(env.url + 'files/product/create/', params, httpOption);
  }

  postBlockchain(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'product/issue/blockchain/', { cert_id: id }, httpOption);
  }

  activityDetail(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/certificate/list/${id}/`, httpOption);
  }

  activityBatchDetail(batchid, offset: any = '') {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/certificate/list/batch/?batch=${batchid}&timezoneoffset=${offset}`, httpOption);
  }

  activityBatchGraphicalDetail(batchid) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/certificate/graph/?batch=${batchid}`, httpOption);
  }

  historyActivityDetails(certId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/edit/history/?current_id=${certId}`, httpOption);
  }

  historywithActivityDetails(certId) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `product/activity/data/?current_id=${certId}`, httpOption);
  }

  sendActivityEmail(id, email) {
    return this.http.post(env.url + `product/activity/send/${id}/`, { email: email });
  }

  // getSubProductList(batchid) {
  //   const httpOption = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': localStorage.getItem('token'),
  // 'x-registertype' : localStorage.getItem('userTypeOriginal')
  //     })
  //   };
  //   return this.http.get(env.url + `product/leaf/?batch_id=${batchid}`, httpOption);
  // }

  // getSubProductListWithoutToken(batchid) {
  //   const httpOption = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   };
  //   return this.http.get(env.url + `product/leaf/?batch_id=${batchid}`, httpOption);
  // }
}

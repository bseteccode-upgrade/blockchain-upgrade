import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

import { environment as env } from '../../../environments/environment';
@Injectable()
export class MoocService {
  httpOption: any;
  constructor(private http: HttpClient) { }

  getCertificate(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + `certificates/mooc/add/${id}/`, httpOption);
  }

  getCertificateList(searchData?: any) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'certificates/mooc/add/' + searchData, httpOption);
  }

  addCertificate(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'certificates/mooc/add/', params, httpOption);
  }

  editCertificate(params, id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `certificates/mooc/add/${id}/`, params, httpOption);
  }

  delete(id) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.delete(env.url + `certificates/mooc/add/${id}/`, httpOption);
  }
}

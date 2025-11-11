import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
@Injectable()
export class TirmeSCParametersService {
  httpOption: any;
  public matrixCount: any = {};
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  constructor(private http: HttpClient) { }

  updateSCParameters(id, apikey, params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apikey,
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.put(env.url + `v2/supply/smart-contract-parameter/${id}/`, params, httpOption);
  }

  getCalculations(apikey) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': apikey,
        'x-registertype': localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get( env.url + `v2/supply/smart-contract-parameter/`, httpOption);
  }
  
}

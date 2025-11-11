import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaymentService {
  paymentPlan: any;
  constructor(private http: HttpClient) { }
  getToken(): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/client/token/', httpOption);
  }

  getPlansSingle() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    this.http.get(env.url + 'users/plan/list/', httpOption).toPromise().then(data => {
      this.paymentPlan = data;
      localStorage.setItem('paymentPlan', JSON.stringify(this.paymentPlan));
    });
  }

  addCard(nonce) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'users/add/card/', { payment_nonce: nonce }, httpOption);
  }

  makePayment(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'users/stripe/make/payment/', params, httpOption);
  }

  confirmPaymentAPI(params) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.post(env.url + 'users/stripe/confirm/payment/', params, httpOption);
  }

  getPlans() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/plan/list/', httpOption);
  }

  getDefaultBadgeCount() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/batch/default/', httpOption);
  }

  getPlansContent() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
        'x-registertype' : localStorage.getItem('userTypeOriginal')
      })
    };
    return this.http.get(env.url + 'users/planpage/content/', httpOption);
  }
}

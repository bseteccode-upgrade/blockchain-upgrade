import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ApiService } from '../service/api.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  canActivate() {
    if (localStorage.getItem('token') || localStorage.getItem('fromqrscanned')) {
      return true;
    } else {
      // not logged in so redirect to login page
      if (localStorage.getItem('fromqrscanned') === '' && localStorage.getItem('fromqrscanned') === null && typeof localStorage.getItem('fromqrscanned') === 'undefined') {
        this.router.navigate(['signin']);
      }
      return false;
    }
  }
}

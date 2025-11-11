/*
 * File : side-nav.component.ts
 * Use: Side menu display based on user privilege
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ProductService } from '../../product/services/product.service';
import { CertificateService } from '../../issuer/services/certificate.service';
import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;
  slimScrollState = new SlimScrollState();
  count: any = {};
  redirectCourse: any = false;
  resCourses: any;
  redirectCert: any = false;
  resCerts: any;
  displayStudLabel: any = false;
  displayCourseLabel: any = false;
  displayCertLabel: any = false;
  displayAchLabel: any = false;
  newUser: any = false;
  status: any = false;
  displayBouncedEmail: any = false;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  testMode: any = true;
  constructor(
    public apiService: ApiService,
    private router: Router,
    public productService: ProductService,
    public certiService: CertificateService
  ) {
    this.options = {
      barBackground: '#8e8e8e',
      position: 'right',
      barOpacity: '0.7',
      barMargin: '0',
      gridOpacity: '1',
      gridBorderRadius: '20',
      gridMargin: '0',
      gridBackground: '#262d37',
      barBorderRadius: '10',
      barWidth: '6',
      gridWidth: '0',
      alwaysVisible: true
    };
    this.productService.productMatrix();
  }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user_details'));
    console.log(this.userDetails.profile_details['show_tirme_sc_parameters']);
    setTimeout(() => {
      this.apiService.sidenavGetUser();
      const specific_date = new Date(this.apiService.createdDate);
      const fixed_date = new Date('2019-02-11');
      if (specific_date.getTime() >= fixed_date.getTime()) {
        this.newUser = true;
      }
    }, 1000);
    this.certiService.redirectCourse.subscribe(updated => {
      this.redirectCourse = updated;
    });
    this.certiService.redirectCerts.subscribe(updated => {
      this.redirectCert = updated;
    });
    this.apiService.all_stud_count.subscribe(updated => {
      if (this.apiService.userType === '2' && this.apiService.is_tutorial) {
        this.displayStudLabel = false;
      } else {
        this.displayStudLabel = this.newUser ? updated : false;
      }
    });
    this.apiService.all_course_count.subscribe(updated => {
      this.displayCourseLabel = this.newUser ? updated : false;
    });
    this.apiService.all_certificate_count.subscribe(updated => {
      this.displayCertLabel = this.newUser ? updated : false;
    });
    this.apiService.all_achivemtns.subscribe(updated => {
      this.displayAchLabel = this.newUser ? updated : false;
    });
    this.apiService.is_smtp_on.subscribe(updated => {
      this.displayBouncedEmail = updated;
    });
    this.apiService.testMode.subscribe(updated => {
      this.testMode = updated;
    });
    this.certiService.getIssuersCoursesOnly().subscribe(
      data => {
        this.resCourses = data;
        if (this.resCourses.length === 0) {
          this.redirectCourse = true;
        } else {
          this.redirectCourse = false;
        }
      }, err => { });
    /**Find Course list empty or not */
    this.certiService.getIssuersCertificatesOnly().subscribe(
      data => {
        this.resCerts = data;
        if (this.resCerts.length === 0) {
          this.redirectCert = true;
        } else {
          this.redirectCert = false;
        }
      }, err => { });
  }

  logout() {
    this.apiService.logout();
  }

  checkIfExist(val) {
    return this.userDetails.profile_details.api_permissions.includes(val);
  }

  scrollChanged($event: ISlimScrollState) {
    this.slimScrollState = $event;
  }
}

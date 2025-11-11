/*
 * File : viewactivity.component.ts
 * Use: view acitvity details
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from '../services/certificate.service';
import { ApiService } from '../../service/api.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment as env } from '../../../environments/environment';
import * as moment from 'moment';

declare var jQuery;

@Component({
  selector: 'app-viewactivity',
  templateUrl: './viewactivity.component.html',
  styleUrls: ['./viewactivity.component.css']
})
export class ViewactivityComponent implements OnInit {

  activityId: any;
  batchId: any;
  actDetail: any = {};
  subProductList: any = [];
  dataSubProductLists: any = [];
  baseUrl = env.baseUrl;
  userDetails: any = [];
  constructor(
    private route: ActivatedRoute,
    public apiService: ApiService,
    private certiService: CertificateService,
    public ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.batchId = data['batchid'];
      if (this.batchId) {
        this.callactivityBatchDetail(this.batchId);
      }
    });
  }

  getBatchActivityDetyails(batchId) {
    this.callactivityBatchDetail(batchId);
  }

  callactivityBatchDetail(batchId) {
    this.userDetails = JSON.parse(localStorage.getItem('user_details'));
    this.certiService.activityBatchDetail(batchId).subscribe(res => {
      this.actDetail = res;
    });
  }

  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }

  logout() {
    this.apiService.logout();
  }

}

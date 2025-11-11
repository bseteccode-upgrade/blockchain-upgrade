/*
 * File : product-details.component.ts
 * Use: product certificate details display option
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from '../services/certificate.service';
import { ApiService } from '../../service/api.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment as env } from '../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  activityId: any;
  batchId: any;
  actDetail: any = {};
  subProductList: any = [];
  dataSubProductLists: any = [];
  baseUrl = env.baseUrl;
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

}

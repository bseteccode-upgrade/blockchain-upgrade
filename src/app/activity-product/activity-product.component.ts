/*
 * File : acitvity-procduct.component.ts
 * Use: Search the product
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ApiService } from '../service/api.service';
import * as moment from 'moment';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-activity-product',
  templateUrl: './activity-product.component.html',
  styleUrls: ['./activity-product.component.css']
})
export class ActivityProductComponent implements OnInit {
  appName = env.project_name;
  siteName = env.project_site;
  process = false;
  submitted = false;
  actDetail: any;
  batchId = '';
  resultfound = true;
  pkid: any;
  subProductList: any = [];
  dataSubProductLists: any = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit() {
    // Get product Id from url and display the activity details
    this.route.queryParams.subscribe(data => {
      this.batchId = data['id'];
      if (this.batchId) {
        this.process = true;
        this.apiService.activityBatchDetailWithoutToken(this.batchId, new Date().getTimezoneOffset(), '').subscribe(res => {
          this.resultfound = true;
          this.actDetail = res;
          this.submitted = true;
          this.process = false;
        }, err => {
          this.resultfound = false;
          this.process = false;
          this.submitted = true;
        });
      }
    });
  }

  /**
   * @function searchProduct
   * @description search product based redirect to the productlocation page
   * @param pkid product search id
   */
  searchProduct(pkid) {
    this.router.navigate(['batches'], { queryParams: { id: pkid } });
  }

  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }

}

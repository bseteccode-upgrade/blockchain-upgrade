/*
 * File : report.component.ts
 * Use: report page for product activity
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ApiService } from '../../service/api.service';
import { ProductService } from '../services/product.service';
import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  process = false;
  submitted = false;
  actDetail: any;
  batchId = '';
  resultfound = true;
  pkid: any;
  subProductList: any = [];
  dataSubProductLists: any = [];

  lat: any;
  lng: any;
  origin = {};
  // { lat: 43.361405, lng: -8.411919 };
  destination = {};
  // { lat: 43.292005, lng: -8.343993 };
  waypoints = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit() {
    // this.route.params.subscribe(data => {
    //   // this.activityId = data['id'];
    //   this.batchId = data['batchid'];
    //   if (this.batchId) {
    //     // this.certiService.activityDetail(this.activityId).subscribe(res => {
    //     //   this.actDetail = res;
    //     // });
    //     this.callactivityBatchDetail(this.batchId);
    //     // this.getFinalSubProductList();
    //   }
    // });
    this.route.params.subscribe(data => {
      this.batchId = data['id'];
      if (this.batchId) {
        this.process = true;
        this.apiService.activityBatchDetailWithoutToken(this.batchId, new Date().getTimezoneOffset(), '').subscribe(res => {
          this.resultfound = true;
          this.actDetail = res;
          if (this.actDetail.localtion_list.length > 0) {
            this.lat = this.actDetail.localtion_list[0].location.lat;
            this.lng = this.actDetail.localtion_list[0].location.lng;
          }
          if (this.actDetail.localtion_list.length >= 2) {
            this.origin = { lat: this.actDetail.localtion_list[0].location.lat, lng: this.actDetail.localtion_list[0].location.lng };
            this.destination = { lat: this.actDetail.localtion_list[this.actDetail.localtion_list.length-1].location.lat, lng: this.actDetail.localtion_list[this.actDetail.localtion_list.length-1].location.lng };
          }
          this.submitted = true;
          this.process = false;
          // setTimeout(() => {
          //   this.process = false;
          // }, 8000);
        }, err => {
          this.resultfound = false;
          this.process = false;
          this.submitted = true;
        });
      }
    });
  }

  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }

  // searchProduct(pkid) {
  //   this.router.navigate(['batches'], { queryParams: { id: pkid } });
  // }

}


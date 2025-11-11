/*
 * File : newgraphic.component.ts
 * Use: Tree strucutre format create for activity trace option
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../services/certificate.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
declare var jQuery;
import * as moment from 'moment';

@Component({
  selector: 'app-newgraphic',
  templateUrl: './newgraphic.component.html',
  styleUrls: ['./newgraphic.component.css']
})
export class NewgraphicComponent implements OnInit {
  response: any = [];
  batchId: any;
  responseData: any = [];
  calenderVals: any = [];
  constructor(
    private route: ActivatedRoute,
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

  callactivityBatchDetail(batchId) {
    this.certiService.activityBatchGraphicalDetail(batchId).subscribe(res => {
      this.responseData = res;
      if (this.responseData.certificates) {
        this.response = this.responseData.certificates;
        this.calenderVals = this.responseData.month_dict;
      }
    });
  }

  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }

}

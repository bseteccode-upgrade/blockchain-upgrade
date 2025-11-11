/*
 * File : acitvity-procduct-loc.component.ts
 * Use: track the product location
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ApiService } from '../service/api.service';
import { CertificateService } from '../product/services/certificate.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-acitvity-procduct-loc',
  templateUrl: './acitvity-procduct-loc.component.html',
  styleUrls: ['./acitvity-procduct-loc.component.css']
})
export class AcitvityProcductLocComponent implements OnInit {
  appName = env.project_name;
  siteName = env.project_site;
  process = false;
  submitted = false;
  actDetail: any;
  batchId = '';
  workflow_id = '';
  resultfound = true;
  resultMsg = '';
  pkid: any;
  subProductList: any = [];
  searchForm: FormGroup;
  errorMsgArr: any = [];
  errorMsg: any;

  lat: any;
  lng: any;
  origin = {};
  destination = {};
  waypoints = [];


  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService,
    private certiService: CertificateService,
    public ngxSmartModalService: NgxSmartModalService
  ) {
    this.searchForm = this.formbuilder.group({
      'search': ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'workflow': ['', Validators.compose([Validators.required, this.noWhitespaceValidator])]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    /** onload gathering the file activity location from api and display to the page */
    this.route.queryParams.subscribe(data => {
      this.batchId = data['id'];
      this.workflow_id = data['workflow'];
      if (this.batchId) {
        this.apiService.activityLocDetailWithoutToken(this.batchId, this.workflow_id).subscribe(res => {
          this.resultfound = true;
          this.actDetail = res;
          if (this.actDetail.message === 'location_not_found' || this.actDetail.message === 'product_not_found') {
            this.resultMsg = this.actDetail.message;
            this.resultfound = false;
            this.process = false;
            this.submitted = true;
          } else {
            this.submitted = true;
            this.process = false;
            if (this.actDetail.location) {
              this.lat = this.actDetail.location.location.lat;
              this.lng = this.actDetail.location.location.lng;
              this.origin = { lat: this.actDetail.location.location.lat, lng: this.actDetail.location.location.lng };
              this.destination = { lat: this.actDetail.location.location.lat, lng: this.actDetail.location.location.lng };
            }
          }
        }, err => {
          this.resultfound = false;
          this.process = false;
          this.submitted = true;
        });
      }
    });
  }

  /**
   * @function searchProdLoc
   * @description search product based redirect to the productlocation page
   * @param searchData form search data's
   */
  searchProdLoc(searchData?: any) {
    this.errorMsg = '';
    if (this.searchForm.valid) {
      this.router.navigate(['prductlocation'], { queryParams: { id: searchData['search'], workflow: searchData['workflow'] } });
    } else {
      this.errorMsg = 'error';
    }
  }

  getErrorMsg(field) {
    return this.searchForm.controls[field].hasError('required')
      || this.searchForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

  /**
   * @function searchProduct
   * @description search product based redirect to the productlocation page
   * @param prductlocation form search data's
   */
  searchProduct(prductlocation) {
    this.router.navigate(['prductlocation'], { queryParams: { id: prductlocation } });
  }

  /**
   * @function convertDateToString
   * @description convert date format
   * @param dateToBeConverted date input
   */
  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }
}

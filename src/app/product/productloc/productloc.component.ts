/*
 * File : productloc.component.ts
 * Use: product location details display
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ApiService } from '../../service/api.service';
import { CertificateService } from '../services/certificate.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-productloc',
  templateUrl: './productloc.component.html',
  styleUrls: ['./productloc.component.css']
})
export class ProductlocComponent implements OnInit {
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
    this.route.params.subscribe(data => {
      this.batchId = data['id'];
      this.workflow_id = data['workflow'];
      if (this.batchId) {
        this.apiService.activityLocDetail(this.batchId, this.workflow_id).subscribe(res => {
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

  searchProdLoc(searchData?: any) {
    this.errorMsg = '';
    if (this.searchForm.valid) {
      this.router.navigate([`productlocation/${searchData['search']}/${searchData['workflow']}`]);
    } else {
      this.errorMsg = 'error';
    }
  }

  getErrorMsg(field) {
    return this.searchForm.controls[field].hasError('required')
      || this.searchForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }

}


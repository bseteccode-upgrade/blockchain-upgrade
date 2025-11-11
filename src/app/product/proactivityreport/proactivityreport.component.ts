/*
 * File : proactivityreport.component.ts
 * Use: activity report option
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ApiService } from '../../service/api.service';
import { CertificateService } from '../services/certificate.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { waypoints } from '../../../data/waypoints';
import * as moment from 'moment';

@Component({
  selector: 'app-proactivityreport',
  templateUrl: './proactivityreport.component.html',
  styleUrls: ['./proactivityreport.component.css']
})
export class ProactivityreportComponent implements OnInit {
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

  lat: Number;
  lng: Number;
  origin: any;
  destination: any;
  public waypointsData: any;

  resAcvityData: any;
  modelWorkFlowId: any = '';
  modelBatchId: any = '';
  modeloutbatch: any = '';

  // public lat: Number = 24.799448;
  // public lng: Number = 120.979021;

  // public origin = { lat: 24.799448, lng: 120.979021 };
  // public destination = { lat: 24.799524, lng: 120.975017 };
  // public waypointsData = [
  //   {
  //     location: { lat: 24.799448, lng: 120.979021 },
  //     stopover: false,
  //   },
  //   {
  //     location: { lat: 24.7950879, lng: 120.9784989 },
  //     stopover: false,
  //   },
  //   {
  //     location: { lat: 24.7941879, lng: 120.9785989 },
  //     stopover: false,
  //   }, {
  //     location: { lat: 24.7992879, lng: 120.9716989 },
  //     stopover: false,
  //   },
  //   {
  //     location: { lat: 24.799524, lng: 120.975017 },
  //     stopover: false,
  //   }
  // ];

  public renderOptions = {
    suppressMarkers: true,
  };

  public markerOptions: any = waypoints;
  mapType = 2;
  public waypointsRoadData: any = [];
  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService,
    private certiService: CertificateService,
    public ngxSmartModalService: NgxSmartModalService
  ) {
    this.searchForm = this.formbuilder.group({
      'search': [this.modeloutbatch, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'workflow': [this.modelWorkFlowId, Validators.compose([Validators.required, this.noWhitespaceValidator])]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    if (localStorage.getItem('searchoutbatchid') !== null && localStorage.getItem('searchoutbatchid') !== undefined) {
      this.modeloutbatch = localStorage.getItem('searchoutbatchid');
      this.modelWorkFlowId = localStorage.getItem('searchworkflowid');
      this.commonSearchActivity(this.modeloutbatch, this.modelWorkFlowId);
    } else {
    this.apiService.getLatestActivity().subscribe(resData => {
      this.resAcvityData = resData;
      if (this.resAcvityData.status !== false) {
        this.modeloutbatch = this.resAcvityData.out_batch;
        this.modelWorkFlowId = this.resAcvityData.workflow_id;
        this.commonSearchActivity(this.resAcvityData.out_batch, this.resAcvityData.workflow_id);
      } else {
        if (this.resAcvityData.message === 'no_records_found') {
          this.resultMsg = this.resAcvityData.message;
        } else {
          this.resultMsg = 'no_records_found';
        }
        this.resultfound = true;
        this.process = false;
      }
    }, err => {
      this.resultMsg = 'no_records_found';
      this.resultfound = true;
      this.process = false;
    });
    }
  }

  selectedMap(val) {
    this.mapType = val && val != 'null' ? val : '1';
  }

  /**
   * @description common function for search actvity report details
   * @param batch batch id
   * @param workflowId workflow id
   */
  commonSearchActivity(batch, workflowId, search = false) {
    this.apiService.activityLocDetail(batch, workflowId).subscribe(res => {
      this.actDetail = res;
      if (this.actDetail.message === 'location_not_found' || this.actDetail.message === 'product_not_found') {
        this.resultMsg = this.actDetail.message;
        this.resultfound = true;
        this.process = false;
        this.submitted = true;
      } else {
        this.submitted = true;
        this.resultfound = false;
        this.process = false;
        if (this.actDetail.localtion_list.length > 0) {
          if (search) {
            localStorage.setItem('searchworkflowid', workflowId);
            localStorage.setItem('searchoutbatchid', batch);
          }
          this.lat = this.actDetail.localtion_list['0'].location.lat;
          this.lng = this.actDetail.localtion_list['0'].location.lng;
          this.origin = { lat: this.actDetail.localtion_list['0'].location.lat, lng: this.actDetail.localtion_list['0'].location.lng };
          this.destination = { lat: this.actDetail.localtion_list[this.actDetail.localtion_list.length - 1].location.lat, lng: this.actDetail.localtion_list[this.actDetail.localtion_list.length - 1].location.lng };
          this.waypointsData = this.actDetail.localtion_list;
          this.waypointsRoadData = this.actDetail.localtion_list_road;
        }
      }
    }, err => {
      this.resultMsg = 'no_records_found';
      this.resultfound = true;
      this.process = false;
      this.submitted = true;
    });
  }

  /**
   * @description search activity details based on search form fields
   * @param searchData form data
   */
  searchProdLoc(searchData?: any) {
    this.errorMsg = '';
    if (this.searchForm.valid) {
      this.commonSearchActivity(searchData['search'], searchData['workflow'], true);
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



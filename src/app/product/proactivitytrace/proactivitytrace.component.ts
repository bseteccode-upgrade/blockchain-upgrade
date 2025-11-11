/*
 * File : proactivityreport.component.ts
 * Use: activity trace option ( find the location of the product )
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from '../services/certificate.service';
import { ApiService } from '../../service/api.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment as env } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { waypoints } from '../../../data/waypoints';
import { ActivityhistoryComponent } from '../activityhistory/activityhistory.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-proactivitytrace',
  templateUrl: './proactivitytrace.component.html',
  styleUrls: ['./proactivitytrace.component.css']
})
export class ProactivitytraceComponent implements OnInit {
  searchForm: FormGroup;
  errorMsgArr: any = [];
  errorMsg: any;

  activityId: any;
  batchId: any;
  actDetail: any = {};
  subProductList: any = [];
  dataSubProductLists: any = [];
  baseUrl = env.baseUrl;

  modelBatchId: any = '';
  resAcvityData: any;
  resultfound = true;
  isLoadingResults = true;

  lat: Number;
  lng: Number;
  origin: any;
  destination: any;
  isLoading = false;
  public waypointsData: any = [];
  public markerOptions: any = waypoints;
  public renderOptions = {
    suppressMarkers: true,
  };
  mapType = 2;
  public waypointsRoadData: any = [];
  offset: any;
  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    public apiService: ApiService,
    private certiService: CertificateService,
    public ngxSmartModalService: NgxSmartModalService,
    private dialog: MatDialog
  ) {
    this.searchForm = this.formbuilder.group({
      'search': [this.modelBatchId, Validators.compose([Validators.required, this.noWhitespaceValidator])]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.offset = new Date().getTimezoneOffset();
    if (localStorage.getItem('searchoutbatchid') !== null && typeof localStorage.getItem('searchoutbatchid') !== 'undefined') {
      this.resultfound = true;
      this.isLoadingResults = true;
      this.modelBatchId = localStorage.getItem('searchoutbatchid');
      this.batchId = localStorage.getItem('searchoutbatchid');
      this.callactivityBatchDetail(localStorage.getItem('searchoutbatchid'));
    } else {
    this.apiService.getLatestActivity().subscribe(resData => {
      this.resAcvityData = resData;
      if (this.resAcvityData.status !== false) {
        this.resultfound = true;
        this.isLoadingResults = true;
        this.modelBatchId = this.resAcvityData.batch;
        this.batchId = this.resAcvityData.batch;
        this.callactivityBatchDetail(this.resAcvityData.batch);
      } else {
        this.resultfound = true;
        this.isLoadingResults = false;
      }
    }, err => {
      this.resultfound = true;
      this.isLoadingResults = false;
    });
  }
  }

  selectedMap(val) {
    this.mapType = val && val != 'null' ? val : '1';
  }

  dataHistory(certId) {
    this.isLoading = true;
    this.certiService.historyActivityDetails(certId).subscribe(res => {
      this.isLoading = false;
      const dialogRef = this.dialog.open(ActivityhistoryComponent, {
        data: {
          certData: res
        }
      });
    });
  }

  getBatchActivityDetyails(batchId) {
    this.callactivityBatchDetail(batchId);
  }

  /**
   * @description search activity details based on search form fields
   * @param searchData form data
   */
  searchProdLoc(searchData?: any) {
    this.mapType = 2;
    this.resultfound = true;
    this.isLoadingResults = true;
    this.errorMsg = '';
    this.waypointsData = [];
    this.waypointsRoadData = [];
    if (this.searchForm.valid) {
      this.batchId = searchData['search'];
      this.callactivityBatchDetail(searchData['search'], true);
    } else {
      this.resultfound = true;
      this.isLoadingResults = false;
      this.errorMsg = 'error';
    }
  }

  callactivityBatchDetail(batchId, search = false) {
    this.certiService.activityBatchDetail(batchId, this.offset).subscribe(res => {
      this.resultfound = false;
      this.isLoadingResults = false;
      this.actDetail = res;
      if (this.actDetail.localtion_list.length > 0) {
        this.lat = this.actDetail.localtion_list['0'].location.lat;
        this.lng = this.actDetail.localtion_list['0'].location.lng;
        this.origin = { lat: this.actDetail.localtion_list['0'].location.lat, lng: this.actDetail.localtion_list['0'].location.lng };
        this.destination = { lat: this.actDetail.localtion_list[this.actDetail.localtion_list.length - 1].location.lat, lng: this.actDetail.localtion_list[this.actDetail.localtion_list.length - 1].location.lng };
        this.waypointsData = this.actDetail.localtion_list;
        this.waypointsRoadData = this.actDetail.localtion_list_road;
        // this.markerOptions = this.actDetail.marker_options;
      }
      if (search) {
        localStorage.setItem('searchworkflowid', this.actDetail.workflow_id);
        localStorage.setItem('searchoutbatchid', batchId);
      }
    }, err => {
      this.isLoadingResults = false;
      this.resultfound = true;
    });
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


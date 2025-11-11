/*
 * File : sup-view-product.component.ts
 * Use: Supply chain view the report of the product activity details
 * Copyright : vottun 2019
 */
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment as env } from '../../environments/environment';
import * as moment from 'moment';
import { waypoints } from '../../data/waypoints';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sup-view-product',
  templateUrl: './sup-view-product.component.html',
  styleUrls: ['./sup-view-product.component.css']
})
export class SupViewProductComponent implements OnInit, AfterViewInit {

  activityId: any;
  batchId: any;
  actDetail: any = {};
  subProductList: any = [];
  dataSubProductLists: any = [];
  baseUrl = env.baseUrl;

  // modelBatchId: any = '';
  resAcvityData: any;
  resultfound = true;
  isLoadingResults = true;

  lat: Number;
  lng: Number;
  origin: any;
  destination: any;
  public waypointsData: any = [];
  public waypointsRoadData: any = [];
  public markerOptions: any = waypoints;
  public renderOptions = {
    suppressMarkers: true,
  };
  mapType = '1';
  languages: any = [];
  selectedLang = 'EN';
  offset: any = '';
  constructor(
    private route: ActivatedRoute,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService,
    private elementRef: ElementRef,
    public domSanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.route.params.subscribe(val => this.myInit());
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }

  myInit() {
    this.offset = new Date().getTimezoneOffset();
    this.route.params.subscribe(params => {
      this.batchId = params['id'];
      localStorage.setItem('fromqrscanned', this.batchId);
      if (this.batchId) {
        this.resultfound = true;
        this.isLoadingResults = true;
        this.getLanguages();
      } else {
        this.resultfound = true;
        this.isLoadingResults = false;
        this.route.queryParams.subscribe(data => {
          this.batchId = data['id'];
          localStorage.setItem('fromqrscanned', this.batchId);
          if (this.batchId) {
            this.resultfound = true;
            this.isLoadingResults = true;
            this.getLanguages();
          } else {
            this.resultfound = true;
            this.isLoadingResults = false;
          }
        });
      }
    });
  }

  ngOnInit() {
    localStorage.removeItem('fromqrscanned');
  }

  seconds_with_leading_zeros() {
    return /\((.*)\)/.exec(new Date().toString())[1];
  }

  getLanguages() {
    this.apiService.getLanguage().subscribe(data => {
      this.languages = data;
      if (localStorage.getItem('selectedLanguage') != null) {
        const langVal: any = JSON.parse(localStorage.getItem('selectedLanguage'));
        this.selectedLang = langVal.language_code;
        this.apiService.setSeparateLanguage(langVal);
      }
      this.callactivityBatchDetail(this.batchId, this.selectedLang);
    });
  }

  selectLang(lang) {
    this.selectedLang = lang.language_code;
    localStorage.setItem('selectedLanguage', JSON.stringify(lang));
    this.apiService.setSeparateLanguage(lang);
    this.route.params.subscribe(params => {
      this.batchId = params['id'];
    });
    this.callactivityBatchDetail(this.batchId, lang.language_code);
  }

  onActivityDetails(certificateDetails) {
    const dialogRef = this.dialog.open(ActivityDetailsComponent, {
      data: {
        certData: certificateDetails,
        title: this.actDetail.title
      }
    });
  }

  selectedMap(val) {
    this.mapType = val && val != 'null' ? val : '1';
  }

  callactivityBatchDetail(batchId, lang = '') {
    const language_code = lang != '' ? lang : 'en';
    const selLang = this.languages.find(e => e.language_code.toLowerCase() === language_code.toLowerCase());
    this.apiService.activityBatchDetailWithoutToken(batchId, this.offset, selLang.id).subscribe(res => {
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
      }
    }, err => {
      this.isLoadingResults = false;
      this.resultfound = true;
    });
  }

  convertDateToString(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('DD/MM/YYYY HH:mm A');
  }

  convertDateToStringMM(dateToBeConverted) {
    return moment(dateToBeConverted, 'DD-MM-YYYY HH:mm A').format('MM/DD/YYYY HH:mm A');
  }

  ngAfterViewInit() {
    var v = document.createElement('script');
    v.type = 'text/javascript';
    v.innerHTML = "function googleTranslateElementInit() { new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element'); } ";
    this.elementRef.nativeElement.appendChild(v);
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    this.elementRef.nativeElement.appendChild(s);
  }

}


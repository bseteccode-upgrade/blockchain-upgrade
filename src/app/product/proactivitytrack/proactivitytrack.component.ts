/*
 * File : proactivitytrack.component.ts
 * Use: display the activity details based on posted activity
 * Copyright : vottun 2019
 */
import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CertificateService } from '../services/certificate.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import * as moment from 'moment';
import { ActivitydetailComponent } from '../activitydetail/activitydetail.component';
declare var jQuery;
import { MatDialog } from '@angular/material';
import * as JSC from 'jscharting';
import { charts } from 'highcharts';

@Component({
  selector: 'app-proactivitytrack',
  templateUrl: './proactivitytrack.component.html',
  styleUrls: ['./proactivitytrack.component.css']
})
export class ProactivitytrackComponent implements OnInit, AfterViewInit, OnDestroy {
  searchForm: FormGroup;
  errorMsgArr: any = [];
  errorMsg: any;
  chart: any;
  response: any = [];
  resContinunity: any = [];
  batchId: any;
  responseData: any = [];
  calenderVals: any = [];
  modelBatchId: any = '';
  resAcvityData: any;
  resultfound = true;
  isLoadingResults = true;
  isLoading = false;
  multiclass = '';
  actvityDetailsRes: any;
  @ViewChild('mynetwork') mynetwork: ElementRef;

  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private certiService: CertificateService,
    public ngxSmartModalService: NgxSmartModalService,
    public apiService: ApiService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
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
    // if (localStorage.getItem('searchoutbatchid') !== null && localStorage.getItem('searchoutbatchid') !== undefined) {
    //   this.resultfound = true;
    //   this.isLoadingResults = true;
    //   this.modelBatchId = localStorage.getItem('searchoutbatchid');
    //   this.callactivityBatchDetail(localStorage.getItem('searchoutbatchid'));
    // } else {
    //   this.apiService.getLatestActivity().subscribe(resData => {
    //     this.resAcvityData = resData;
    //     if (this.resAcvityData.status !== false) {
    //       this.resultfound = true;
    //       this.isLoadingResults = true;
    //       this.modelBatchId = this.resAcvityData.batch;
    //       this.callactivityBatchDetail(this.resAcvityData.batch);
    //     } else {
    //       this.resultfound = true;
    //       this.isLoadingResults = false;
    //     }
    //   }, err => {
    //     this.resultfound = true;
    //     this.isLoadingResults = false;
    //   });
    // }
  }

  dataHistory(certId) {
    this.isLoading = true;
    this.certiService.historywithActivityDetails(certId).subscribe(res => {
      this.isLoading = false;
      this.actvityDetailsRes = res;
      const dialogRef = this.dialog.open(ActivitydetailComponent, {
        data: {
          activityCertData: this.actvityDetailsRes.certificates,
          historyCertData: this.actvityDetailsRes.history
        }
      });
    });
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('searchoutbatchid') !== null && localStorage.getItem('searchoutbatchid') !== undefined) {
      this.resultfound = true;
      this.isLoadingResults = true;
      this.modelBatchId = localStorage.getItem('searchoutbatchid');
      this.cdr.detectChanges();
      this.callactivityBatchDetail(localStorage.getItem('searchoutbatchid'));
    } else {
      this.apiService.getLatestActivity().subscribe(resData => {
        this.resAcvityData = resData;
        if (this.resAcvityData.status !== false) {
          this.resultfound = true;
          this.isLoadingResults = true;
          this.modelBatchId = this.resAcvityData.batch;
          this.cdr.detectChanges();
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
    // var popupThis = this;
    // var chart = JSC.chart('chartDiv', {
    //   debug: true,
    //   type: 'organization right',
    //   legend_visible: false,
    //   series: [
    //     {
    //       line_color: '#747c72',
    //       defaultPoint: {
    //         label: {
    //           text: '<b>%name</b><br/>%out_batch_id',
    //           autoWrap: false
    //         },
    //         annotation: {
    //           padding: 9,
    //           corners: ['cut', 'square', 'cut', 'square'],
    //           margin: [15, 5, 10, 0]
    //         },
    //         color: '#dcead7',
    //         tooltip: '<i>%name</i><br/>%company_name<br/>%out_batch_id<br/>%date_issued<br/>%product_name<br/>'
    //       },
    //       defaultPoint_events_click: function () {
    //         // alert(this.id);
    //         popupThis.dataHistory(this.id);
    //       },
    //       points: []
    //     }
    //   ],
    // });
  }



  /**
   * @description search activity details based on search form fields
   * @param searchData form data
   */
  searchProdLoc(searchData?: any) {
    this.resultfound = true;
    this.isLoadingResults = true;
    this.errorMsg = '';
    if (this.searchForm.valid) {
      this.callactivityBatchDetail(searchData['search'], true);
    } else {
      jQuery('.trace-diagram-container').css('display', 'none');
      this.resultfound = true;
      // this.resultfound = false;
      this.isLoadingResults = false;
      this.errorMsg = 'error';
    }
  }

  callactivityBatchDetail(batchId, search = false) {
    this.certiService.activityBatchGraphicalDetail(batchId).subscribe(res => {
      this.responseData = res;
      if (this.responseData.workflow_node) {
        jQuery('.trace-diagram-container').css('display', 'block');
        this.resultfound = false;
        this.isLoadingResults = false;
        if (search) {
          localStorage.setItem('searchworkflowid', this.responseData.workflow_id);
          localStorage.setItem('searchoutbatchid', batchId);
        }

        var popupThis = this;
        console.log(popupThis.responseData);
        console.log(popupThis.responseData.workflow_node);
        this.chart = JSC.chart('chartDiv', {
          width: 1000,
          height: this.responseData.height,
          debug: true,
          type: 'organization Right',
          legend_visible: false,
          series: [
            {
              line_color: '#747c72',
              defaultPoint: {
                label: {
                  text: "<span style='listStyleType:none;'><ul><li><span style='font-size:14px;font-weight:bold;margin:10px 0'>%name</span></li><li><span style='font-size:12px'>%outbatchid</span><br/> </li><li><span style='font-size:12px'>%dateissued <img src='assets/images/information.png' style='width:18px'></span></li></ul></span>",
                  autoWrap: false
                },
                annotation: {
                  padding: [5, 10],
                  corners: ['cut', 'square', 'cut', 'square'],
                  margin: [10, 20, 10, 20],
                },
                color: '#dcead7',
                fill: '#fff',
                tooltip: "",
              },
              defaultPoint_events_click: function () {
                popupThis.dataHistory(this.id);
              },
              points: popupThis.responseData.workflow_node,
            }
          ],
          // toolbar: {
          //   defaultItem: { margin: 5, events_click: popupThis.orientChart },
          //   items: {
          //     Left_icon: 'system/default/zoom/arrow-left',
          //     Right_icon: 'system/default/zoom/arrow-right',
          //     Down_icon: 'system/default/zoom/arrow-down',
          //     Up_icon: 'system/default/zoom/arrow-up'
          //   }
          // }
        });


        // function orientChart(direction) {
        //   chart.options({ type: 'organization ' + direction });
        // }

        // function orientChart(direction) {
        //   chart.options({ type: 'organization ' + direction });
        //   }
        // chart.redraw();
        // this.response = this.responseData.normal_workflow;
        // this.resContinunity = this.responseData.group_workflow;
        // if (this.resContinunity.length > 0) {
        //   this.multiclass = 'multiple_workflow';
        // } else {
        //   this.multiclass = '';
        // }
        this.calenderVals = this.responseData.month_dict;
      } else {
        jQuery('.trace-diagram-container').css('display', 'none');
        if (this.resAcvityData.msg = 'no_product_cert') {
          this.resultfound = true;
          this.isLoadingResults = false;
        }
      }
    }, err => {
      jQuery('.trace-diagram-container').css('display', 'none');
      this.resultfound = true;
      this.isLoadingResults = false;
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
  orientChart(direction) {
    this.chart.options({
      type: 'organization ' + direction
    });
  }

  ngOnDestroy(): void {
    jQuery('.trace-diagram-container').css('display', 'none');
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

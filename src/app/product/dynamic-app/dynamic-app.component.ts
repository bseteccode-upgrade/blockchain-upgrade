import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { CertificateService } from '../services/certificate.service';
import { ApiService } from '../../service/api.service';
import { ProductService } from '../services/product.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { NgLocaleLocalization } from '@angular/common';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonService } from '../../service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var jQuery;
import { Subject } from 'rxjs';

import { } from 'googlemaps';
declare var google: any;

@Component({
  selector: 'my-app',
  templateUrl: './dynamic-app.component.html',
  styleUrls: ['./dynamic-app.component.css']
})
export class DynamicAppComponent implements OnInit, AfterViewInit {
  public form: FormGroup;
  unsubcribe: any;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  batchList: any;
  batchDetails: any;
  public fields: any;
  displayField: any = [];
  displayDynamicField = false;
  displayMobileView = false;
  displayBatchId = '';
  errorstep = '';
  optionvalue = '';
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  getReturnData: any;
  step1DisplayForm = false;
  allowTestMode = this.userDetails.profile_details.allow_test_activity;
  workflowList: any = this.userDetails.workflow_list;
  typeyouselect = [
    { id: 1, text: 'correction' },
    { id: 2, text: 'new' }
  ];
  // disablestep1button = true;
  formCreationData: any;
  userTitle: any;
  outBatchList: any = [];
  switchData: any = [];
  currentWorkflowFields: any;
  currentStep: any = this.userDetails.profile_details.product_step === 0 ? 1 : this.userDetails.profile_details.product_step;
  normalUrlFlow = true;
  resTestModeUserList: any = [];
  testModeUserList: any;
  callFunction: any = false;

  private geoCoder = new google.maps.Geocoder;
  geoAddress: any;

  constructor(
    public apiService: ApiService,
    public productService: ProductService,
    private common: CommonService,
    public router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public certiService: CertificateService,
  ) {
    this.certiService.callFunctionUserListSteps.subscribe(updated => {
      this.callFunction = updated;
      if (this.callFunction) {
        this.productService.getTestModeUserLists(localStorage.getItem('workflow_db_id'), localStorage.getItem('activity_id_dynamic'), localStorage.getItem('out_batch_id_dynamic')).subscribe(resData => {
          this.resTestModeUserList = resData;
        });
      }
    });
    this.geoCoder = new google.maps.Geocoder;
  }

  ngOnInit() {
    this.getBatchList();
    localStorage.removeItem('correctEditId');
    localStorage.removeItem('in_batch_id_dynamic');
    localStorage.setItem('workflow_db_id', null);
    if (localStorage.getItem('option') !== null) {
      this.optionvalue = localStorage.getItem('option');
    } else if (this.optionvalue) {
      localStorage.setItem('option', this.optionvalue);
    }
    this.productService.getPosition().then(pos => {
      localStorage.removeItem('currentAddress');
      localStorage.removeItem('addressLatlng');
      if (pos.lat && typeof pos.lat != 'undefined') {
        this.getAddress(pos.lat, pos.lng);
      }
    });
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.certiService.gotGeoCode.next(true);
          this.geoAddress = results[0].formatted_address;
          localStorage.setItem('currentAddress', this.geoAddress);
          localStorage.setItem('addressLatlng', latitude + ',' + longitude);
        } else {
          this.certiService.gotGeoCode.next(false);
          localStorage.removeItem('currentAddress');
          localStorage.removeItem('addressLatlng');
          window.alert('No location found');
        }
      } else {
        this.certiService.gotGeoCode.next(false);
        localStorage.removeItem('currentAddress');
        localStorage.removeItem('addressLatlng');
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  getOutBatchList() {
    if (this.currentStep != 1) {
      if (localStorage.getItem('option') !== null) {
        this.optionvalue = localStorage.getItem('option');
      } else if (this.optionvalue) {
        localStorage.setItem('option', this.optionvalue);
      }
      if (this.allowTestMode && localStorage.getItem('workflow_db_id') !== null) {
        this.productService.getOutBatchListWF(localStorage.getItem('workflow_db_id')).subscribe(resdata => {
          this.outBatchList = resdata;
        });
      } else {
        this.productService.getOutBatchList(localStorage.getItem('option')).subscribe(data => {
          this.outBatchList = data;
          this.typeyouselect = this.outBatchList.is_qc ? [{ id: 1, text: 'correction' }] : this.typeyouselect;
        });
      }
    }
  }

  ngAfterViewInit() {
    this.getOutBatchList();
    this.route.params.subscribe(data => {
      if (data['outbatch']) {
        localStorage.removeItem('selectOutBatchID');
        localStorage.removeItem('option');
        this.normalUrlFlow = false;
        this.currentStep = data['step'];
        this.cdRef.detectChanges();
        if (this.currentStep == 1) {
          localStorage.getItem('workflow_db_id');
          localStorage.setItem('correctEditId', data['actid']);
          localStorage.setItem('selectOutBatchID', data['actid']);
          this.workFlowStepWithoutUrl(data['wfid'], data['outbatch']);
        } else {
          localStorage.setItem('option', data['unikey']);
          localStorage.setItem('type', 'qrcode');
          localStorage.setItem('selectOutBatchID', data['actid']);
          localStorage.setItem('correctEditId', data['actid']);
          this.callSelectBatchId(data['unikey'], true, data['outbatch']);
        }
      }
    });
    if (this.userDetails.userType === '5' && !this.apiService.pages.issue_certificate) {
      this.common.openSnackBar('dont_have_privillege', 'Close');
      this.router.navigate(['/signin']);
    } else {
      if (localStorage.getItem('userTypeOriginal') === '5' && this.userDetails.pages.issue_certificate) {
        if (this.userDetails.profile_details.new_step_value === 0) {
          this.ngxSmartModalService.getModal('younotassign').open();
        } else if (this.currentStep != 1 && !localStorage.getItem('type') && this.normalUrlFlow) {
          this.redirectToMemberInbox();
        }
      }
    }
    if (localStorage.getItem('option') && this.normalUrlFlow) {
      localStorage.removeItem('selectOutBatchID');
      this.onChangebatchId(localStorage.getItem('option'));
    }
    if (this.currentStep == 1 && !localStorage.getItem('option') && this.normalUrlFlow) {
      localStorage.removeItem('selectOutBatchID');
      this.cdRef.detectChanges();
      if (this.workflowList.length == 1 || localStorage.getItem('wfsteponeid')) {
        let workflow_db_id;
        if (localStorage.getItem('wfsteponeid')) {
          workflow_db_id = localStorage.getItem('wfsteponeid');
        } else {
          workflow_db_id = this.workflowList['0'].workflow_db_id;
        }
        localStorage.setItem('workflow_db_id', workflow_db_id);
        const index = this.workflowList.findIndex(e => e.workflow_db_id === workflow_db_id);
        this.userTitle = this.workflowList[index]['role'];
        this.cdRef.detectChanges();
        this.fields = this.workflowList[index].field_set;
        this.currentWorkflowFields = this.workflowList[index].field_set;
        if (!this.workflowList[index].is_blocked) {
          this.productService.getOutBatchListWF(workflow_db_id).subscribe(data => {
            this.outBatchList = data;
            this.typeyouselect = this.outBatchList.is_qc ? [{ id: 1, text: 'correction' }] : this.typeyouselect;
            if (this.outBatchList.allow_test_activity || this.workflowList[index].test_mode) {
              this.allowTestMode = true;
              this.productService.getTestModeUserLists(workflow_db_id, '', '').subscribe(resData => {
                this.resTestModeUserList = resData;
              });
            }
            if (this.outBatchList.list.length !== 0) {
              if (this.outBatchList.allow_modify_activity) {
                // this.ngxSmartModalService.getModal('inactivity').open();
                this.onwhatyougoonwith('2');
              } else {
                this.displayDynamicField = true;
                this.step1DisplayForm = true;
                this.cdRef.detectChanges();
                this.form = new FormGroup({
                  fields: new FormControl(JSON.stringify(this.fields))
                });
                this.unsubcribe = this.form.valueChanges.subscribe((update) => {
                  this.fields = JSON.parse(update.fields);
                });
              }
            } else {
              this.displayDynamicField = true;
              this.step1DisplayForm = true;
              this.cdRef.detectChanges();
              this.form = new FormGroup({
                fields: new FormControl(JSON.stringify(this.fields))
              });
              this.unsubcribe = this.form.valueChanges.subscribe((update) => {
                this.fields = JSON.parse(update.fields);
              });
            }
          });
        } else {
          this.ngxSmartModalService.getModal('user_blocked').open();
        }
      } else {
        if (this.workflowList.length > 1 && localStorage.getItem('wfsteponeid')) {
          this.userTitle = '';
          this.cdRef.detectChanges();
          this.fromMemberindex(localStorage.getItem('wfsteponeid'));
        } else if (this.workflowList.length > 1) {
          this.userTitle = '';
          this.cdRef.detectChanges();
          this.ngxSmartModalService.getModal('selectworkflow').open();
        } else {
          if (this.userDetails.profile_details.new_step_value === 0) {
            this.ngxSmartModalService.getModal('younotassign').open();
          } else {
            this.redirectToMemberInbox();
          }
        }
      }
    }
  }

  firstStepFormDisplay(outbatch) {
    if (outbatch != '') {
      this.fields.map((val, index) => {
        var oldStr = val.name;
        var newStr = oldStr.substring(0, oldStr.length - 2);
        if (newStr === 'out_batch' || newStr === 'out_batch_') {
          this.fields[index].value = outbatch; // outbatch
          this.fields[index].readonly = false;
        }
        // if (val.name === 'quality_check_users' || val.name === 'next_step_users') {
        //   this.fields[index].readonly = true;
        // }
      });
    }
    this.displayDynamicField = true;
    this.step1DisplayForm = true;
    this.cdRef.detectChanges();
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    });
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      this.fields = JSON.parse(update.fields);
    });
  }
  /**
   * @description if Step1 user assign to multiple workflow we using this function
   * @param event get value from selection
   */
  changeValueWorkFlowStep1(event: any) {
    localStorage.setItem('workflow_db_id', event.target.value);
    const index = this.workflowList.findIndex(e => e.workflow_db_id === event.target.value);
    const valArr = this.workflowList[index];
    this.currentWorkflowFields = this.workflowList[index]['field_set'];
    this.fields = this.workflowList[index]['field_set'];
    this.userTitle = this.workflowList[index]['role'];
    this.cdRef.detectChanges();
    if (!this.workflowList[index].is_blocked) {
      this.productService.getOutBatchListWF(event.target.value).subscribe(data => {
        this.outBatchList = data;
        this.typeyouselect = this.outBatchList.is_qc ? [{ id: 1, text: 'correction' }] : this.typeyouselect;
        this.ngxSmartModalService.getModal('selectworkflow').close();
        if (this.outBatchList.allow_test_activity) {
          this.allowTestMode = true;
          this.productService.getTestModeUserLists(event.target.value, '', '').subscribe(resData => {
            this.resTestModeUserList = resData;
          });
        }
        if (this.outBatchList.list.length !== 0 && this.outBatchList.allow_modify_activity) {
          // this.ngxSmartModalService.getModal('inactivity').open();
          this.onwhatyougoonwith('2');
        } else {
          this.displayDynamicField = true;
          this.step1DisplayForm = true;
          this.cdRef.detectChanges();
          this.form = new FormGroup({
            fields: new FormControl(JSON.stringify(this.fields))
          });
          this.unsubcribe = this.form.valueChanges.subscribe((update) => {
            this.fields = JSON.parse(update.fields);
          });
        }
      });
    } else {
      this.ngxSmartModalService.getModal('selectworkflow').close();
      this.ngxSmartModalService.getModal('user_blocked').open();
    }

  }

  fromMemberindex(wfid) {
    localStorage.setItem('workflow_db_id', wfid);
    localStorage.removeItem('wfsteponeid');
    const index = this.workflowList.findIndex(e => e.workflow_db_id === wfid);
    const valArr = this.workflowList[index];
    this.currentWorkflowFields = this.workflowList[index]['field_set'];
    this.fields = this.workflowList[index]['field_set'];
    this.userTitle = this.workflowList[index]['role'];
    this.cdRef.detectChanges();
    if (!this.workflowList[index].is_blocked) {
      this.productService.getOutBatchListWF(wfid).subscribe(data => {
        this.displayDynamicField = true;
        this.step1DisplayForm = true;
        this.cdRef.detectChanges();
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.fields))
        });
        this.unsubcribe = this.form.valueChanges.subscribe((update) => {
          this.fields = JSON.parse(update.fields);
        });
      });
    } else {
      this.ngxSmartModalService.getModal('user_blocked').open();
    }
  }

  workFlowStepWithoutUrl(wfid, outbatch) {
    localStorage.setItem('workflow_db_id', wfid);
    const index = this.workflowList.findIndex(e => e.workflow_db_id === wfid);
    const valArr = this.workflowList[index];
    this.currentWorkflowFields = this.workflowList[index]['field_set'];
    this.fields = this.workflowList[index]['field_set'];
    this.userTitle = this.workflowList[index]['role'];
    this.cdRef.detectChanges();
    if (!this.workflowList[index].is_blocked) {
      this.productService.getOutBatchListWF(wfid).subscribe(data => {
        this.outBatchList = data;
        const index = this.outBatchList.list.findIndex(e => e.out_batch_id === outbatch);
        // localStorage.setItem('selectOutBatchID', this.outBatchList['list'][index].id);
        this.typeyouselect = this.outBatchList.is_qc ? [{ id: 1, text: 'correction' }] : this.typeyouselect;
        if (this.outBatchList.allow_test_activity) {
          this.allowTestMode = true;
          this.productService.getTestModeUserLists(wfid, '', outbatch).subscribe(resData => {
            this.resTestModeUserList = resData;
          });
        }
        if (this.outBatchList.list.length !== 0 && localStorage.getItem('correctEditId') && typeof localStorage.getItem('correctEditId') != 'undefined') {
          if (this.currentStep == 1 && this.outBatchList.list.length !== 0) {
            this.firstStepFormDisplay(outbatch);
          } else {
            this.callSelectBatchId(this.outBatchList['list'][index].unique_code, true, outbatch);
          }
        } else {
          this.displayDynamicField = true;
          this.step1DisplayForm = true;
          this.cdRef.detectChanges();
          this.form = new FormGroup({
            fields: new FormControl(JSON.stringify(this.fields))
          });
          this.unsubcribe = this.form.valueChanges.subscribe((update) => {
            this.fields = JSON.parse(update.fields);
          });
        }
      });
    } else {
      this.ngxSmartModalService.getModal('user_blocked').open();
    }
  }

  onwhatyougoonwith(value: any) {
    if (value === '1') {
      localStorage.removeItem('selected_outbatchid');
      // this.ngxSmartModalService.getModal('inactivity').close();
      this.ngxSmartModalService.getModal('selectbatch').open();
    } else {
      localStorage.removeItem('selectOutBatchID');
      if (this.currentStep == 1 && this.outBatchList.list.length !== 0) {
        if (localStorage.getItem('wfsteponeid')) {
          this.fromMemberindex(localStorage.getItem('wfsteponeid'));
        } else {
          this.firstStepFormDisplay('');
        }
      } else {
        this.callSelectBatchId(localStorage.getItem('option'));
      }
      // this.ngxSmartModalService.getModal('inactivity').close();
    }
  }

  selectedbatch(event) {
    const index = this.outBatchList.list.findIndex(e => e.out_batch_id === event.target.value);
    localStorage.setItem('selectOutBatchID', this.outBatchList['list'][index].id);
    this.ngxSmartModalService.getModal('selectbatch').close();
    if (this.currentStep == 1 && this.outBatchList.list.length !== 0) {
      this.firstStepFormDisplay(event.target.value);
    } else {
      this.callSelectBatchId(this.outBatchList['list'][index].unique_code, true, event.target.value);
    }
  }

  selectedstep(event) {
    // const index = this.outBatchList.workflow_steps.findIndex(e => e.id === event.target.value);
    // if (this.currentStep < this.outBatchList['workflow_steps'][index].step && (localStorage.getItem('activity_id_dynamic') === null) || typeof localStorage.getItem('activity_id_dynamic') === 'undefined') {
    //   this.errorstep = 'Please post the activity then switch to next step.';
    //   setTimeout(() => {
    //     event.target.value = null;
    //     this.errorstep = '';
    //   }, 2000);
    // } else {
    var activity_id = localStorage.getItem('activity_id_dynamic');
    var out_batch_id = localStorage.getItem('out_batch_id_dynamic');
    var selected_workflow_user_id = event.target.value;
    var current_workflow_user_id = localStorage.getItem('workflow_db_id');
    if (this.currentStep == 1) {
      var current_key = '';
    } else {
      var current_key = localStorage.getItem('option');
    }

    var params = {
      'workflow_user_id': selected_workflow_user_id,
      'current_user_workflow_user_id': current_workflow_user_id,
      'activity_id': activity_id,
      'unikey': current_key
    };

    this.productService.switchToNextStep(params).subscribe(data => {
      this.switchData = data;
      if (this.switchData.has_previous) {
        if (confirm("Are you sure to switch to Next Step?")) {
          this.apiService.logoutAdminMember().subscribe(data => {
            this.apiService.codeBasedSetLanguage('EN');
            localStorage.removeItem('workflow_db_id');
            localStorage.removeItem('redirectProduct');
            localStorage.removeItem('option');
            localStorage.removeItem('in_batch_id_dynamic');
            localStorage.removeItem('out_batch_id_dynamic');
            localStorage.removeItem('activity_id_dynamic');
            localStorage.removeItem('user_details');
            localStorage.removeItem('type');
            localStorage.removeItem('paymentPlan');
            localStorage.removeItem('user_reg_type');
            localStorage.removeItem('user_email');
            localStorage.removeItem('token');
            localStorage.removeItem('redirectwhichcert');
            localStorage.removeItem('redirectWhich');
            localStorage.removeItem('redirectFrom');
            localStorage.removeItem('searchworkflowid');
            localStorage.removeItem('searchoutbatchid');
            localStorage.removeItem('activitySearchData');
            localStorage.removeItem('selectOutBatchID');
            localStorage.clear();

            this.ngxSmartModalService.getModal('switch_next').close();
            localStorage.setItem('reloadActivity', 'yes');
            localStorage.setItem('reloadtype', 'qrcode');
            localStorage.setItem('reloadoption', this.switchData.uniq_key);
            localStorage.setItem('token', 'Token ' + this.switchData.token);
            localStorage.setItem('user_reg_type', '5');
            localStorage.setItem('reloadworkflow', this.switchData.workflow_user_id);
            this.apiService.getUser();
          });
        } else {
          event.target.value = null;
        }
      } else {
        this.errorstep = 'Please post activity for previous step.';
        setTimeout(() => {
          event.target.value = null;
          this.errorstep = '';
        }, 3000);
      }
    });
    // }
  }


  getBatchList() {
    this.productService.getInBatchList().subscribe(data => {
      this.batchList = data;
    });
  }

  onChangebatchId(id, find = false, outbatch = null) {
    this.batchDetails = [];
    this.displayField = [];
    this.productService.getActivitydetailsForm(id).subscribe(data => {
      this.displayDynamicField = true;
      this.batchDetails = data;
      localStorage.setItem('summaryData', JSON.stringify(data));
      localStorage.setItem('workflow_db_id', this.batchDetails.workflow_db_id);
      this.userTitle = this.batchDetails.certifier_designation;
      this.cdRef.detectChanges();
      this.currentStep = this.batchDetails.current_step;
      this.cdRef.detectChanges();
      var outBatch = this.batchDetails.default_out_batch_id;
      if (!this.batchDetails.is_blocked) {
        this.getOutBatchList();
        if (this.batchDetails.allow_test_activity) {
          this.allowTestMode = true;
          this.productService.getTestModeUserLists(this.batchDetails.workflow_db_id, '', id).subscribe(resData => {
            this.resTestModeUserList = resData;
          });
        }
        if (!this.batchDetails.workflow_active) {
          this.ngxSmartModalService.getModal('inactivity').open();
        } else if (this.batchDetails.has_activity && this.batchDetails.allow_modify_activity) {
          // this.ngxSmartModalService.getModal('inactivity').open();
          this.onwhatyougoonwith('2');
        } else {
          if (this.batchDetails.has_activity && !this.batchDetails.allow_modify_activity && this.batchDetails.is_qc) {
            this.ngxSmartModalService.getModal('sameactivityerror').open();
          } else {
            if (this.batchDetails.has_activity && this.normalUrlFlow && this.batchDetails.allow_modify_activity && this.batchDetails.is_qc) {
              // localStorage.setItem('selectOutBatchID', this.batchDetails.default_edit_id);
              this.ngxSmartModalService.getModal('sameactivityerror').open();
            } else {
              this.callSelectBatchId(id);
            }
          }
        }
      } else {
        this.ngxSmartModalService.getModal('user_blocked').open();
      }
    });
  }

  callSelectBatchId(id, find = false, outbatch = null) {
    this.batchDetails = [];
    this.displayField = [];
    this.productService.getActivitydetailsForm(id).subscribe(data => {
      this.displayDynamicField = true;
      this.batchDetails = data;
      localStorage.setItem('summaryData', JSON.stringify(data));
      localStorage.setItem('workflow_db_id', this.batchDetails.workflow_db_id);
      this.userTitle = this.batchDetails.certifier_designation;
      this.cdRef.detectChanges();
      this.currentStep = this.batchDetails.current_step;
      this.cdRef.detectChanges();
      var outBatch = this.batchDetails.default_out_batch_id;
      if (!this.batchDetails.is_blocked) {
        if (this.batchDetails.allow_test_activity) {
          if (this.currentStep != 1) {
            this.getOutBatchList();
          }
          this.allowTestMode = true;
        }
        if (this.batchDetails.has_activity && !this.batchDetails.allow_modify_activity && this.batchDetails.is_qc) {
          this.ngxSmartModalService.getModal('sameactivityerror').open();
        } else {
          if (this.batchDetails.has_activity && this.normalUrlFlow && this.batchDetails.allow_modify_activity && this.batchDetails.is_qc) {
            // localStorage.setItem('selectOutBatchID', this.batchDetails.default_edit_id);
            this.ngxSmartModalService.getModal('sameactivityerror').open();
          } else {
            this.formFieldCreation(data, find, outbatch);
          }
        }
      } else {
        this.ngxSmartModalService.getModal('user_blocked').open();
      }
    });
  }

  formFieldCreation(data, find, outbatch) {
    this.formCreationData = data;
    this.fields = this.formCreationData.field_set;
    if (find) {
      this.fields.map((val, index) => {
        var oldStr = val.name;
        var newStr = oldStr.substring(0, oldStr.length - 2);
        if (newStr === 'out_batch' || newStr === 'out_batch_') {
          this.fields[index].value = outbatch; // outbatch
          this.fields[index].readonly = false;
        }
        // if (val.name === 'quality_check_users' || val.name === 'next_step_users') {
        //   this.fields[index].readonly = true;
        // }
      });
    }
    this.step1DisplayForm = true;
    this.cdRef.detectChanges();
    localStorage.setItem('notFirstForm', JSON.stringify(this.fields));
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    });
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      this.fields = JSON.parse(update.fields);
    });
    this.displayBatchId = this.batchDetails.batch_to_show;
    localStorage.setItem('in_batch_id_dynamic', this.batchDetails.batch_to_show);
    localStorage.setItem('workflow_db_id', this.batchDetails.workflow_db_id);
    var i = 0;
    this.batchDetails.field_set.map((val, index) => {
      var oldStr = val.name;
      var newStr = oldStr.substring(0, oldStr.length - 2);
      if (newStr !== 'out_batch' && newStr !== 'out_batch_' && newStr !== 'out_batch_lable' && newStr !== 'out_batch_lable_' && newStr !== 'produ' && newStr !== 'barco') {
        this.displayField[i] = { 'label': val.label, 'value': val.value, 'type': val.type };
        i++;
      }
    });
  }

  onUpload(e) {
    // console.log(e);
  }

  getFields() {
    return this.fields;
  }

  logout() {
    this.apiService.logout();
  }

  redirectToMemberInbox() {
    this.router.navigate(['/membersinbox']);
  }

  redirectToPrivilege(is_blocked = false) {
    if (is_blocked) {
      this.ngxSmartModalService.getModal('user_blocked').close();
    }
    if (this.userDetails.pages.certificate) {
      this.router.navigate(['/productcertificate']);
    } else if (this.userDetails.pages.account_settings) {
      this.router.navigate(['/accountsetting']);
    } else if (this.userDetails.pages.students) {
      this.router.navigate(['/productlist']);
    } else if (this.userDetails.pages.change_password) {
      this.router.navigate(['/changepwd']);
    } else {
      this.apiService.logout();
    }
  }

  ngDistroy() {
    this.unsubcribe();
  }
}

/*
 * File : workflowlist.component.ts
 * Use: Workflow data list and search functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { TeamService } from '../../service/team.service';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../../service/api.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonService } from '../../service/common.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
declare var jQuery;
import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-workflowlist',
  templateUrl: './workflowlist.component.html',
  styleUrls: ['./workflowlist.component.css']
})
export class WorkflowlistComponent implements OnInit {
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  displayedColumns = ['workflow', 'step', 'role', 'company_name', 'company_logo', 'product', 'avatar', 'name', 'email', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('resetFormID') resetFormCheck;
  subPublisherList: any = [];
  // dataSource = new MatTableDataSource<Element>(this.subPublisherList);
  selection = new SelectionModel<Element>(true, []);
  process = false;
  profileExist = false;
  reasonForm: FormGroup;
  searchForm: FormGroup;
  firstStepMailForm: FormGroup;
  resDelete: any = [];
  disableYes = true;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  firstUserMailErrorMsg = '';
  certID = '';
  checkSubmit = false;
  pageEvent: PageEvent;
  subPublisherListCount: any;
  searchFormData: any = [];
  loginuserType: any;
  userDetails: any;
  mailResData; any = [];
  subPublisherListResData: any = [];
  /* Scroll Pagination */
  slimScrollState = new SlimScrollState();
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;

  workflow_scrollUpDistance = 0;
  workflow_throttle = 300;
  workflow_no_page: number;
  workflow_scrollDistance = 1;
  workflow_inc_page = 1;
  workflow_default_page = 1;
  resTestMode: any;
  firstStepUserRes: any = [];
  firstStepUserList: any = [];
  btnClick = function () {
    this.router.navigate(['/accountsetting']);
  };
  constructor(
    private formbuilder: FormBuilder,
    private teamService: TeamService,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService,
    public common: CommonService,
    private router: Router,
    private activateRoute: ActivatedRoute,
  ) {
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
    this.searchForm = this.formbuilder.group({
      'workflow_id': [''],
      'inactive': false,
      'test': false,
    });
    this.firstStepMailForm = this.formbuilder.group({
      'selected_member_id': [[]],
      'i_dont_know': [true],
      'workflow_id': [null]
    });
    this.activateRoute.params.subscribe(val => this.myInit());
  }

  myInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user_details'));
    this.loginuserType = localStorage.getItem('userTypeOriginal');
    if (this.loginuserType !== '3') {
      this.displayedColumns = ['avatar', 'name', 'email', 'role', 'phone', 'actions'];
    }
    this.initialTeam([]);
  }

  onScrollDownWorkflow(searchData?: any) {
    // this.workflow_inc_page += 1;
    // this.workflow_default_page = this.workflow_inc_page;
    // if (this.workflow_inc_page <= this.workflow_no_page) {
    //   this.initialTeam(searchData);
    // }
  }

  testModeChanges(workflowDetail, type = 'prod') {
    if (!this.userDetails.profile_details.sandbox && type === 'test') {
      this.ngxSmartModalService.getModal('sendBoxEnable').open();
    } else {
      this.ngxSmartModalService.setModalData({ id: workflowDetail.workflow_db_id, type: 'test' }, 'testModeModal', true);
      this.ngxSmartModalService.getModal('testModeModal').open();
    }
  }


  testModeWorkFlow(workflow) {
    this.teamService.testModeWF(workflow.id).subscribe(
      data => {
        this.resTestMode = data;
        if (this.resTestMode.message === 'status Changed') {
          this.subPublisherList = [];
          this.workflow_default_page = 1;
          this.workflow_inc_page = 1;
          this.initialTeam(this.searchFormData);
          this.ngxSmartModalService.getModal('testModeModal').close();
          this.apiService.getUser();
          this.common.openSnackBar('test_mode_activated_successful', 'Close');
        } else {
          this.checkSubmit = false;
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      },
      err => {
        this.checkSubmit = false;
        this.ngxSmartModalService.getModal('testModeModal').close();
        this.common.openSnackBar('some_error_occurred', 'Close');
      }
    );
  }

  ngOnInit() {
  }

  searchFormSubmit(searchData) {
    this.subPublisherList = [];
    this.workflow_default_page = 1;
    this.workflow_inc_page = 1;
    this.initialTeam(searchData);
  }

  resetSearchForm() {
    this.searchForm.controls['workflow_id'].setValue('');
    this.searchForm.controls['inactive'].setValue('');
    this.searchForm.markAsTouched();
    this.searchForm.reset();
    this.subPublisherList = [];
    this.workflow_default_page = 1;
    this.workflow_inc_page = 1;
    this.initialTeam([]);
  }

  initialTeam(searchData = []) {
    this.searchFormData = [];
    // if (this.apiService.user && this.apiService.user.profile_id) {
      if (this.workflow_default_page === 1) {
        this.process = true;
      }
      const params = new URLSearchParams();
      searchData['page'] = this.workflow_default_page;
      // searchData['page_count'] = 10;
      for (const key in searchData) {
        if (searchData[key]) {
          this.searchFormData[key] = searchData[key];
          params.set(key, searchData[key]);
        }
      }
      this.teamService.getWFTeamList(params.toString()).subscribe(
        data => {
          this.process = false;
          this.subPublisherListResData = data;
          this.subPublisherListCount = this.subPublisherListResData.count;
          if (this.subPublisherListResData.count > 0) {
            this.workflow_no_page = Math.ceil(this.subPublisherListResData.count / 10);
            this.subPublisherListResData.results.map(item => {
              return item;
            }).forEach(item => {
              this.subPublisherList.push(item);
            });
          } else {
            this.process = false;
          }
          if (this.loginuserType === '3' || this.loginuserType === '0') {
            this.reasonForm.controls['reason_type'].setValidators(null);
            this.reasonForm.updateValueAndValidity();
          }
        },
        err => {
          this.process = false;
        }
      );
    // }
    // }
  }

  getCompanyAdminFirstStep(workflowId) {
    this.firstStepMailForm.controls['workflow_id'].setValue(workflowId);
    this.teamService.getFirstStepUserList(workflowId).subscribe(
      data => {
        this.firstStepUserRes = data;
        this.firstStepUserList = this.firstStepUserRes;
        if (this.firstStepUserList.members.length > 0) {
          this.ngxSmartModalService.setModalData(
            {
              'userlist': this.firstStepUserList.members,
              'workflow_db_id': workflowId
            }, 'mailsendfirstuser');
          this.ngxSmartModalService.getModal('mailsendfirstuser').open();
        } else {
          this.ngxSmartModalService.setModalData(
            {
              'userlist': [],
              'workflow_db_id': workflowId
            }, 'mailsendfirstuser');
          this.ngxSmartModalService.getModal('mailsendfirstuser').open();
        }
      });
  }

  firstStepUserSubmit(formData) {
    /* If step - 1 users has no memmbers , send notification to company admin */
    if (this.firstStepUserList.members.length <= 0) {
      formData.i_dont_know = true;
      this.firstStepMailForm.controls['selected_member_id'].clearValidators();
      this.firstStepMailForm.controls['selected_member_id'].updateValueAndValidity();
    }
    if (!this.firstStepMailForm.invalid) {
      this.teamService.sendMailWf(formData).subscribe(
        data => {
          this.mailResData = data;
          if (this.mailResData.status === true) {
            const index = this.subPublisherList.findIndex(e => e.workflow_db_id === this.firstStepMailForm.controls['workflow_id'].value);
            this.subPublisherList[index].send_mail_but = false;
            this.common.openSnackBar(this.mailResData.msg, 'Close');
            this.ngxSmartModalService.getModal('mailsendfirstuser').close();
          }
        });
    } else {
      this.firstUserMailErrorMsg = 'error';
    }
  }

  setIdontknowValues(obj) {
    if (obj.length > 0) {
      this.firstStepMailForm.controls['i_dont_know'].setValue(false);
    } else {
      this.firstStepMailForm.controls['i_dont_know'].setValue(true);
      this.firstStepMailForm.controls['selected_member_id'].setValidators(null);
      this.firstStepMailForm.controls['selected_member_id'].setValue([]);
      this.ngSelectComponent.handleClearClick();
      this.firstStepMailForm.controls['selected_member_id'].updateValueAndValidity();
    }
  }

  checkIDontKnow(checked) {
    if (checked) {
      this.firstStepMailForm.controls['selected_member_id'].setValidators(null);
      this.firstStepMailForm.controls['selected_member_id'].setValue([]);
      this.ngSelectComponent.handleClearClick();
      this.firstStepMailForm.controls['selected_member_id'].updateValueAndValidity();
    } else {
      this.firstStepMailForm.controls['selected_member_id'].setValidators([Validators.required]);
      this.firstStepMailForm.controls['selected_member_id'].updateValueAndValidity();
    }
  }

  onPageChange(pageevent) {
    this.pageEvent = pageevent;
    this.initialTeam(this.searchFormData);
  }

  reasonFormSubmit(formdata) {
    if (!this.reasonForm.invalid) {
      const params = {
        'reason_type': formdata.reason_type,
        'reason': formdata.reason
      };
      this.checkSubmit = true;
      this.teamService.deleteTeamMember(this.certID, params).subscribe(
        data => {
          this.resDelete = data;
          if (this.resDelete.msg === 'Team member deleted successfully') {
            this.common.openSnackBar('deletion_successful', 'Close');
            this.ngxSmartModalService.getModal('myModal').close();
            this.initialTeam(this.searchFormData);
          } else {
            this.checkSubmit = false;
            this.common.openSnackBar('some_error_occurred', 'Close');
          }
        },
        err => {
          this.checkSubmit = false;
          this.common.openSnackBar('some_error_occurred', 'Close');
          this.ngxSmartModalService.getModal('myModal').close();
        }
      );
    } else {
      this.reasonErrorMsg = 'error';
    }
  }

  getfirstUserMailErrorMsg(field) {
    return this.firstStepMailForm.controls[field].hasError('required') ? 'enter_a_value' : '';
  }

  getreasonErrorMsg(field) {
    if (field === 'reason_type' || field === 'reason') {
      return this.reasonForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    }
  }

  getReasonType(type) {
    this.reasonTypeVal = type;
    this.disableYes = false;
    if (type === 5) {
      this.reasonForm.controls['reason'].setValidators(Validators.compose([Validators.required]));
      this.reasonForm.controls['reason'].updateValueAndValidity();
      this.hideOtherField = true;
    } else {
      this.reasonForm.controls['reason'].clearValidators();
      this.reasonForm.controls['reason'].updateValueAndValidity();
      this.hideOtherField = false;
    }
  }
  /**
   * Delete Workflow form the list and refresh
   * @param workflow workflow id
   */
  deleteWorkFlow(workflow) {
    this.teamService.deleteWF({ 'workflow_db_id': workflow }).subscribe(
      data => {
        this.resDelete = data;
        if (this.resDelete.message === 'workflow deleted successfully') {
          this.subPublisherList = [];
          this.workflow_default_page = 1;
          this.workflow_inc_page = 1;
          this.initialTeam(this.searchFormData);
          this.ngxSmartModalService.getModal('deleteModal').close();
          this.common.openSnackBar('deletion_successful', 'Close');
        } else {
          this.checkSubmit = false;
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      },
      err => {
        this.checkSubmit = false;
        this.ngxSmartModalService.getModal('deleteModal').close();
        this.common.openSnackBar('some_error_occurred', 'Close');
      }
    );
  }


  /**
   * Clone Workflow form the list and refresh
   * @param workflow id
   */
  cloneWorkFlow(workflow) {
    this.teamService.cloneWF(workflow).subscribe(
      data => {
        this.resDelete = data;
        if (this.resDelete.status) {
          this.subPublisherList = [];
          this.workflow_default_page = 1;
          this.workflow_inc_page = 1;
          this.initialTeam(this.searchFormData);
          this.ngxSmartModalService.getModal('cloneModal').close();
          this.common.openSnackBar('cloned_successful', 'Close');
        } else {
          this.checkSubmit = false;
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      },
      err => {
        this.checkSubmit = false;
        this.ngxSmartModalService.getModal('cloneModal').close();
        this.common.openSnackBar('some_error_occurred', 'Close');
      }
    );
  }


  /**
   * Activate Workflow form the list and refresh
   * @param workflow id
   */
  activateWorkFlow(workflow) {
    this.teamService.activeWF(workflow).subscribe(
      data => {
        this.resDelete = data;
        if (this.resDelete.status) {
          this.subPublisherList = [];
          this.workflow_default_page = 1;
          this.workflow_inc_page = 1;
          this.initialTeam(this.searchFormData);
          this.ngxSmartModalService.getModal('activeModal').close();
          this.common.openSnackBar('active_successful', 'Close');
        } else {
          this.checkSubmit = false;
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      },
      err => {
        this.checkSubmit = false;
        this.ngxSmartModalService.getModal('activeModal').close();
        this.common.openSnackBar('some_error_occurred', 'Close');
      }
    );
  }

  /**
   * Inactivate Workflow form the list and refresh
   * @param workflow id
   */
  inactivateWorkFlow(workflow) {
    this.teamService.activeWF(workflow).subscribe(
      data => {
        this.resDelete = data;
        if (this.resDelete.status) {
          this.subPublisherList = [];
          this.workflow_default_page = 1;
          this.workflow_inc_page = 1;
          this.initialTeam(this.searchFormData);
          this.ngxSmartModalService.getModal('inactiveModal').close();
          this.common.openSnackBar('inactive_successful', 'Close');
        } else {
          this.checkSubmit = false;
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      },
      err => {
        this.checkSubmit = false;
        this.ngxSmartModalService.getModal('inactiveModal').close();
        this.common.openSnackBar('some_error_occurred', 'Close');
      }
    );
  }


  setCertId(id) {
    this.checkSubmit = false;
    this.certID = id;
    this.formValidationReset();
  }

  formValidationReset() {
    this.hideOtherField = false;
    this.reasonErrorMsg = '';
    this.reasonForm.reset();
    this.resetFormCheck.resetForm();
  }

  /**
   * Send mail to first step user
   * @param email firstuser mail address
   * @param workflow_id workflow id
   */
  // onStep1WfEmail(email: any, workflow_id: any) {
  //   this.teamService.sendMailWf({ email: email, workflow_id: workflow_id }).subscribe(
  //     data => {
  //       this.mailResData = data;
  //       if (this.mailResData.status === true) {
  //         const index = this.subPublisherList.findIndex(e => e.workflow_db_id === workflow_id);
  //         this.subPublisherList[index].send_mail_but = false;
  //         this.common.openSnackBar(this.mailResData.msg, 'Close');
  //       }
  //     });
  // }

  scrollChanged($event: ISlimScrollState, searchData?: any) {
    this.slimScrollState = $event;
    if ($event.isScrollAtEnd) {
      this.workflow_inc_page += 1;
      this.workflow_default_page = this.workflow_inc_page;
      if (this.workflow_inc_page <= this.workflow_no_page) {
        this.initialTeam(searchData);
      }
    }
  }

}

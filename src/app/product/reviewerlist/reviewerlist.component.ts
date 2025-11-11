/*
 * File : reviewerlist.component.ts
 * Use: reviewer data list and search functionality
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

@Component({
  selector: 'app-reviewerlist',
  templateUrl: './reviewerlist.component.html',
  styleUrls: ['./reviewerlist.component.css']
})
export class ReviewerlistComponent implements OnInit {

  displayedColumns = ['workflow', 'step', 'role', 'company_name', 'company_logo', 'product', 'avatar', 'name', 'email', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('resetFormID') resetFormCheck;
  subPublisherList: any = [];
  dataSource = new MatTableDataSource<Element>(this.subPublisherList);
  selection = new SelectionModel<Element>(true, []);
  process = false;
  profileExist = false;
  reasonForm: FormGroup;
  searchForm: FormGroup;
  resDelete: any = [];
  disableYes = true;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  certID = '';
  checkSubmit = false;
  pageEvent: PageEvent;
  subPublisherListCount: any;
  searchFormData: any = [];
  loginuserType: any;
  userDetails: any;
  mailResData; any = [];
  constructor(
    private formbuilder: FormBuilder,
    private teamService: TeamService,
    public apiService: ApiService,
    public ngxSmartModalService: NgxSmartModalService,
    public common: CommonService,
    private router: Router
  ) {
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
    this.searchForm = this.formbuilder.group({
      'product': [''],
      'role': [''],
      'name': [''],
      'email': [''],
      'workflow_id': ['']
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user_details'));
    this.loginuserType = localStorage.getItem('userTypeOriginal');
    if (this.loginuserType !== '3') {
      this.displayedColumns = ['avatar', 'name', 'email', 'role', 'phone', 'actions'];
    }
    setTimeout(() => {
      this.initialTeam(false, [], 1);
    }, 1000);
  }

  initialTeam(isDelete = false, searchData?: any, page = 1, search = false) {
    this.searchFormData = [];
    // if (!this.profileExist) {
    if (this.apiService.user && this.apiService.user.profile_id) {
      // this.profileExist = true;
      this.process = true;
      const params = new URLSearchParams();
      searchData['page'] = page;
      for (const key in searchData) {
        if (searchData[key]) {
          this.searchFormData[key] = searchData[key];
          params.set(key, searchData[key]);
        }
      }
      this.teamService.getReviewerList(params.toString()).subscribe(
        data => {
          this.process = false;
          this.subPublisherList = data;
          this.subPublisherListCount = this.subPublisherList.count;
          this.dataSource = new MatTableDataSource<Element>(this.subPublisherList.results);
          if (this.searchFormData && Object.keys(this.searchFormData).length > 1 && search) {
            this.paginator.pageIndex = 0;
          }
          if (isDelete) {
            this.paginator.pageIndex = this.paginator.pageIndex !== 0 ? this.paginator.pageIndex - 1 : 0;
            this.paginator._changePageSize(this.paginator.pageSize);
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
    }
    // }
  }

  onPageChange(pageevent) {
    this.pageEvent = pageevent;
    this.initialTeam(false, this.searchFormData, pageevent.pageIndex + 1, false);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
            this.initialTeam(true, [], 1, false);
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

  deleteWorkFlow(step, workflow) {
    this.teamService.deleteWorkFlow({ 'workflow_id': workflow, 'email': null, 'step': step }).subscribe(
      data => {
        this.resDelete = data;
        if (this.resDelete.msg === 'Team member deleted successfully') {
          this.common.openSnackBar('deletion_successful', 'Close');
          this.ngxSmartModalService.getModal('myModal').close();
          this.initialTeam(true, [], 1, false);
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

  onWithOutIdRedirect(workflow_id, id, step, role) {
    this.router.navigate([`/reviewerdetail/null/${workflow_id}/${id}/${step}/${role}`]);
  }

  onStep1WfEmail(email, workflow_id) {
    this.teamService.sendMailWf({ email: email }).subscribe(
      data => {
        this.mailResData = data;
        if (this.mailResData.status === true) {
          jQuery('#' + workflow_id).remove();
          this.common.openSnackBar(this.mailResData.msg, 'Close');
        }
      });
  }
}
/*
 * File : members.component.ts
 * Use: supply chain team member list data display and search option
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { TeamService } from '../../service/team.service';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../../service/api.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CommonService } from '../../service/common.service';
import { FormBuilder, FormGroup, Validators, FormControl,FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
declare var jQuery;
import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  displayedColumns = ['workflow', 'step', 'role', 'company_name', 'company_logo', 'product', 'avatar', 'name', 'email', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('resetFormID') resetFormCheck;
  @ViewChild('addcompetitor') addcompetitor: FormGroupDirective;
  @ViewChild('linkcompetitor') linkcompetitor: FormGroupDirective;
  subPublisherList: any = [];
  // dataSource = new MatTableDataSource<Element>(this.subPublisherList);
  selection = new SelectionModel<Element>(true, []);
  process = false;
  profileExist = false;
  addCompetitorForm: FormGroup;
  linkCompetitorForm: FormGroup;
  disfield = false;
  errorMsg: string;
  errorMsgArr: any = [];
  competitorList:any;
  allcompetitorList:any;
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
      'name': [''],
      'email': ['']
    });

    this.addCompetitorForm = this.formbuilder.group({
      'competitor_name':  [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
    
    this.linkCompetitorForm = this.formbuilder.group({
      'competitor_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });    
  }


  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  resetErrorMsg(){
    this.errorMsg = '';
    this.getCompetitorList()
  }

  savecompetitor(formData, member_id) {
    this.errorMsg = '';
    if (this.addcompetitor.form.valid) {
      const params = {
        competitor_name: formData.competitor_name,
        member_id: member_id
      };
      this.teamService.add_competitor(params).subscribe(
        data => {
          this.resDelete = data;
          this.addCompetitorForm.reset();
          this.common.openSnackBar('competiror_added_successfully', 'Close');
          this.ngxSmartModalService.getModal('add_competitor').close();          
        },
        err => {

          this.checkSubmit = false;
          this.common.openSnackBar(err.error.msg, 'Close');
          this.addCompetitorForm.reset();
          this.ngxSmartModalService.getModal('add_competitor').close();
        }
      );
    } else {
      this.errorMsg = 'error';
    }

  }

  savelinkcompetitor(formData, member_id) {
    this.errorMsg = '';
    if (this.linkcompetitor.form.valid) {
      const params = {
        competitor_name: formData.competitor_name,
        member_id: member_id
      };
      this.teamService.edit_competitor(params).subscribe(
        data => {
          this.resDelete = data;
          this.common.openSnackBar('competiror_updated_successfully', 'Close');
          this.ngxSmartModalService.getModal('link_competitor').close();
        },
        err => {
          this.checkSubmit = false;
          this.common.openSnackBar(err.error.msg, 'Close');
          this.ngxSmartModalService.getModal('link_competitor').close();
        }
      );
    } else {
      this.errorMsg = 'error';
    }

  }

  onScrollDownWorkflow(searchData?: any) {
    // console.log('hi');
    // this.workflow_inc_page += 1;
    // console.log(this.workflow_default_page);
    // console.log(this.workflow_inc_page);
    // this.workflow_default_page = this.workflow_inc_page;
    // if (this.workflow_inc_page <= this.workflow_no_page) {
    //   this.initialTeam(searchData);
    // }
  }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user_details'));
    this.loginuserType = localStorage.getItem('userTypeOriginal');
    setTimeout(() => {
      this.initialTeam([]);
      this.getCompetitorList();
    }, 1000);
  }

  getCompetitorList() {
    this.teamService.get_competitor().subscribe(
      data => {
        this.competitorList = data['result'];
        this.allcompetitorList = data['alllist'];
      },
      err => {
        this.process = false;
      }
    );
  }

  checkCompetitorExists(id) {
    if (this.getCompetitorName(id)) {
      return true;
    } else {
      return false;
    }
  }

  resetSearchForm() {
    this.searchForm.controls['name'].setValue('');
    this.searchForm.controls['email'].setValue('');
    this.searchForm.markAsTouched();
    this.subPublisherList = [];
    this.workflow_default_page = 1;
    this.workflow_inc_page = 1;
    this.initialTeam([]);
  }

  searchFormSubmit(searchData) {
    this.subPublisherList = [];
    this.workflow_default_page = 1;
    this.workflow_inc_page = 1;
    this.initialTeam(searchData);
  }

  getCompetitorName(id) {
    let list = this.allcompetitorList.filter(t => t[1] == id);
    if (list.length > 0) {
      const arrayVals = list[0];
     return arrayVals[0];
    }
    return "";
  }

  

  initialTeam(searchData?: any) {
    this.process = this.workflow_default_page == 1 ? true : false;
    this.searchFormData = [];
    const params = new URLSearchParams();
    searchData['page'] = this.workflow_default_page;
    // searchData['page_count'] = 10;
    for (const key in searchData) {
      if (searchData[key]) {
        this.searchFormData[key] = searchData[key];
        params.set(key, searchData[key]);
      }
    }
    this.teamService.getMemberList(params.toString()).subscribe(
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
            this.initialTeam([]);
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

  onDeleteCompetitor(id) {
    this.errorMsg = '';
      const params = {
        member_id:id
      }
      this.teamService.delete_competitor(params).subscribe(
        data => {
          this.resDelete = data;
          this.common.openSnackBar('competiror_deleted_successfully', 'Close');
          this.ngxSmartModalService.getModal('delete_competitor').close();
        },
        err => {
          this.checkSubmit = false;
          this.common.openSnackBar(err.error.msg, 'Close');
          this.ngxSmartModalService.getModal('delete_competitor').close();
        }
      );
   
  }


  onDeleteMember(id) {
    this.teamService.deleteMember(id).subscribe(
      data => {
        this.resDelete = data;
        if (this.resDelete.msg === 'Member deleted successfully') {
          this.subPublisherList = [];
          this.workflow_default_page = 1;
          this.workflow_inc_page = 1;
          this.common.openSnackBar('deletion_successful', 'Close');
          this.ngxSmartModalService.getModal('myModal').close();
          this.initialTeam([]);
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
    this.router.navigate([`/team/null/${workflow_id}/${id}/${step}/${role}`]);
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

  getErrorMsg(field) {
    return this.addCompetitorForm.controls[field].hasError('required')
      || this.addCompetitorForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

}


/*
 * File : members-form.component.ts
 * Use: team member create and edit with user privillege's
 * Copyright : vottun 2019
 */
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { TeamService } from '../../service/team.service';
import { CommonService } from '../../service/common.service';
import { ProductService } from '../../product/services/product.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState } from '../../ngx-slimscroll/classes/slimscroll-state.class';
declare var jQuery;

@Component({
  selector: 'app-members-form',
  templateUrl: './members-form.component.html',
  styleUrls: ['./members-form.component.css']
})
export class MembersFormComponent implements OnInit, AfterViewInit {
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;
  slimScrollState = new SlimScrollState();
  teamMemberForm: FormGroup;
  userType: any = localStorage.getItem('userTypeOriginal');
  errorMsg: string;
  allcount: any = 0;
  fieldData: any = [];
  errorMsgArr: any = [];
  selectsArray: any = [];
  selectstring: string;
  disfield = false;
  successMsg: string;
  memberId: string;
  workflowrole: any;
  workflowstep: any;
  workflowid: any;
  workflowname: any;
  selectedstatus: any = true;
  disprimaryfield: any = false;
  process = false;
  orgPic = new FormData();
  teamModel: any = {
    'first_name': '',
    'last_name': '',
    'email': '',
    'phone': '',
    'organization': '',
    'university_avatar': '',
    'reviewer': this.userType != 0 ? true : false,
    'download': false,
    'all_steps': true,
    'specific_step': false,
    'students': false,
    'certificate': true,
    'issue_certificate': false,
    'account_settings': false,
    'add_product': false,
    'change_password': false,
    'admin_prv': false,
    'dashboard_prv': false,
    'producttrace_pre': false,
    'producttrack_pre': false,
    'productloc_pre': false,
    'canned_message_pre': false,
    'member_menu_pre': false,
    'workflow_menu_pre': false,
    'download_activities_pre': false,
    'workflow_db_id': null
  };
  reswfuserdata: any;
  wfuserlists: any = [];
  disablebutton = false;
  access_notify = false;
  wflists: any;
  reswflistdata: any;
  resWFMemdata: any;
  wfmemlists: any;
  reswfdatas: any;
  reswfdataLists: any = [];
  sltWfMemberList: any;
  selectedMember: any = [];
  resAllUserWfList: any;
  selectmemberDetailsList: any = [];
  constructor(
    private formbuilder: FormBuilder,
    public apiService: ApiService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    public common: CommonService,
    private router: Router,
    private productService: ProductService,
    public ngxSmartModalService: NgxSmartModalService
  ) {
    this.memberId = this.route.snapshot.paramMap.get('id');
    this.workflowrole = this.route.snapshot.paramMap.get('role');
    this.workflowstep = this.route.snapshot.paramMap.get('step');
    this.workflowid = this.route.snapshot.paramMap.get('userid');
    this.workflowname = this.route.snapshot.paramMap.get('wfname');
    // this.getworkflowuserlist();
    this.createForm();
    this.getWorkflowList();
  }

  ngAfterViewInit() {
    jQuery(document).ready(function () {
      jQuery('.wfClassAddLi:first').addClass('highlight');
    });
  }

  getWorkflowList() {
    this.teamService.getWFTeamList([], true).subscribe(
      data => {
        this.reswflistdata = data;
        this.wflists = this.reswflistdata.results;
      });
  }

  getAllUserList() {
    this.teamService.getAllUserWf().subscribe(
      data => {
        this.resAllUserWfList = data;
        if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null' && typeof this.teamModel.activity_field_set != 'undefined' && this.teamModel.activity_field_set != '') {
          this.preSelectMember(this.teamModel.activity_field_set.split(','));
        }
      });
  }

  getWorkflowListSelect() {
    this.teamService.getWFData().subscribe(
      data => {
        this.reswfdatas = data;
        this.reswfdataLists = this.reswfdatas.results;
        this.selectWorkFlow(this.reswfdataLists[0].workflow_db_id);
      });
  }

  firstWFLiSelect(id) {
    jQuery('.wfClassAddLi').removeClass('highlight');
    jQuery('#' + id).parent().addClass('highlight');
  }

  selectWorkFlow(id) {
    jQuery('.wfClassAddLi').removeClass('highlight');
    jQuery('#' + id).parent().addClass('highlight');
    const selIndivArr = this.reswfdataLists.find(x => x.workflow_db_id === id);
    const arrIndexSelect = this.reswfdataLists.indexOf(selIndivArr);
    this.sltWfMemberList = this.reswfdataLists[arrIndexSelect].workflow_members;
  }

  selectMember(memberId) {
    if (this.selectedMember === [] || !this.selectedMember.includes(memberId)) {
      jQuery('#' + memberId).parent().addClass('highlight');
      this.selectedMember.push(memberId);
      const selectMemIndex = this.resAllUserWfList.find(x => x.id === memberId);
      const arrMemberIndex = this.resAllUserWfList.indexOf(selectMemIndex);
      this.selectmemberDetailsList.push(this.resAllUserWfList[arrMemberIndex]);
      this.teamMemberForm.controls['activity_field_set'].setValue(this.selectedMember);
    }
  }

  preSelectMember(members: any) {
    let i;
    const newArrSelectedMember = [];
    for (i = 0; i < members.length; i++) {

      newArrSelectedMember.push(members[i]);
      const selectMemIndex = this.resAllUserWfList.find(data => data.id === members[i]);
      const arrMemberIndex = this.resAllUserWfList.indexOf(selectMemIndex);
      this.selectmemberDetailsList.push(this.resAllUserWfList[arrMemberIndex]);
      if (i === members.length - 1) {
        this.teamMemberForm.controls['activity_field_set'].setValue(newArrSelectedMember);
        this.selectedMember = newArrSelectedMember;
      }
    }
  }

  deleteMember(memberId) {
    const originalArrSelectMem = this.selectedMember;
    jQuery('#' + memberId).parent().removeClass('highlight');
    const finalArr = originalArrSelectMem.find(x => x === memberId);
    const findMemberIndex = originalArrSelectMem.indexOf(finalArr);
    originalArrSelectMem.splice(findMemberIndex, 1);
    const selectDeletedMem = this.selectmemberDetailsList.find(x => x.id === memberId);
    const findDeleteMemberIndex = this.selectmemberDetailsList.indexOf(selectDeletedMem);
    this.selectmemberDetailsList.splice(findDeleteMemberIndex, 1);

    this.selectedMember = originalArrSelectMem;
    this.teamMemberForm.controls['activity_field_set'].setValue(this.selectedMember);
  }

  exchangeValueFun() {
    if (this.teamMemberForm.controls['all_steps'].value) {
      this.teamMemberForm.controls['specific_step'].setValue(false);
      this.teamMemberForm.controls['workflow_db_id'].setValue(null);
      this.teamMemberForm.controls['activity_field_set'].setValue(null);
      this.teamMemberForm.controls['activity_field_set'].clearValidators();
      this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
      this.teamMemberForm.controls['workflow_db_id'].clearValidators();
      this.teamMemberForm.controls['workflow_db_id'].updateValueAndValidity();
    } else {
      this.teamMemberForm.controls['specific_step'].setValue(true);
      this.teamMemberForm.controls['activity_field_set'].setValidators([Validators.required]);
      this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
      // this.teamMemberForm.controls['workflow_db_id'].setValidators([Validators.required]);
      // this.teamMemberForm.controls['workflow_db_id'].updateValueAndValidity();
      setTimeout(() => {
        this.firstWFLiSelect(this.reswfdataLists[0].workflow_db_id);
      }, 300);
    }
  }

  exchangeValueIn() {
    if (this.teamMemberForm.controls['specific_step'].value) {
      this.teamMemberForm.controls['all_steps'].setValue(false);
      this.teamMemberForm.controls['activity_field_set'].setValidators([Validators.required]);
      this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
      // this.teamMemberForm.controls['workflow_db_id'].setValidators([Validators.required]);
      // this.teamMemberForm.controls['workflow_db_id'].updateValueAndValidity();
      setTimeout(() => {
        this.firstWFLiSelect(this.reswfdataLists[0].workflow_db_id);
      }, 300);
    } else {
      this.selectedMember = [];
      this.selectmemberDetailsList = [];
      this.teamMemberForm.controls['all_steps'].setValue(true);
      this.teamMemberForm.controls['workflow_db_id'].setValue(null);
      this.teamMemberForm.controls['activity_field_set'].setValue(null);
      this.teamMemberForm.controls['activity_field_set'].clearValidators();
      this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
      this.teamMemberForm.controls['workflow_db_id'].clearValidators();
      this.teamMemberForm.controls['workflow_db_id'].updateValueAndValidity();
    }
  }

  reviewerSelect() {
    if (!this.teamMemberForm.controls['reviewer'].value) {
      this.teamMemberForm.controls['admin_prv'].setValue(true);
      this.adminSelect();
    }
  }

  customSearchFn(term: string, item: any) {
    term = (term).toLocaleLowerCase();
    return (item.email).toLocaleLowerCase().indexOf(term) > -1 ||
      (item.role).toLocaleLowerCase().indexOf(term) > -1 ||
      (item.step).toString().toLocaleLowerCase().indexOf(term) > -1;
  }

  adminSelect() {
    if (!this.teamMemberForm.controls['admin_prv'].value) {
      this.selectsArray = [];
      for (let i = 1; i <= 1; i++) {
        this.selectsArray.push(i);
        if (i === 1) {
          this.disablebuttonFun(this.selectsArray);
        }
      }
      this.teamMemberForm.controls['certificate'].setValue(true);
      this.teamMemberForm.controls['reviewer'].setValue(true);
      this.teamMemberForm.controls['account_settings'].setValue(false);
      this.teamMemberForm.controls['change_password'].setValue(false);
      this.teamMemberForm.controls['specific_step'].setValue(false);
      this.teamMemberForm.controls['download'].setValue(false);
      this.teamMemberForm.controls['dashboard_prv'].setValue(false);
      this.teamMemberForm.controls['producttrace_pre'].setValue(false);
      this.teamMemberForm.controls['producttrack_pre'].setValue(false);
      this.teamMemberForm.controls['productloc_pre'].setValue(false);
      this.teamMemberForm.controls['canned_message_pre'].setValue(false);
      // this.teamMemberForm.controls['students'].setValue(false);
      // this.teamMemberForm.controls['add_product'].setValue(false);
      this.teamMemberForm.controls['issue_certificate'].setValue(false);
      this.teamMemberForm.controls['member_menu_pre'].setValue(false);
      this.teamMemberForm.controls['workflow_menu_pre'].setValue(false);
      this.teamMemberForm.controls['download_activities_pre'].setValue(false);
    } else {
      this.selectsArray = [];
      for (let i = 1; i <= 11; i++) {
        this.selectsArray.push(i);
        if (i === 11) {
          this.disablebuttonFun(this.selectsArray);
        }
      }
      this.teamMemberForm.controls['certificate'].setValue(true);
      this.teamMemberForm.controls['reviewer'].setValue(false);
      this.teamMemberForm.controls['account_settings'].setValue(true);
      this.teamMemberForm.controls['change_password'].setValue(true);
      this.teamMemberForm.controls['specific_step'].setValue(false);
      this.teamMemberForm.controls['download'].setValue(false);
      this.teamMemberForm.controls['dashboard_prv'].setValue(true);
      this.teamMemberForm.controls['producttrace_pre'].setValue(true);
      this.teamMemberForm.controls['producttrack_pre'].setValue(true);
      this.teamMemberForm.controls['productloc_pre'].setValue(true);
      // this.teamMemberForm.controls['canned_message_pre'].setValue(true);
      this.teamMemberForm.controls['students'].setValue(true);
      this.teamMemberForm.controls['add_product'].setValue(true);
      this.teamMemberForm.controls['issue_certificate'].setValue(false);
      this.teamMemberForm.controls['member_menu_pre'].setValue(true);
      this.teamMemberForm.controls['workflow_menu_pre'].setValue(true);
      // this.teamMemberForm.controls['download_activities_pre'].setValue(true);
    }
  }

  ngOnInit() {
    this.getWorkflowListSelect();
    this.getAllUserList();
    // Using this condition for member edit form and prepopulate the values
    if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null') {
      this.teamService.getMember(this.memberId).subscribe(data => {
        this.teamModel = data;
        this.createForm();
        if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null' && this.teamModel.activity_field_set != '') {
          this.preSelectMember(this.teamModel.activity_field_set.split(','));
        }
      }, err => {
        this.router.navigate(['workflowlist']);
        this.common.openSnackBar('Invalid member id', 'Close');
      });
    }
  }

  // getworkflowuserlist() {
  //   this.productService.getwfuser().subscribe(data => {
  //     this.reswfuserdata = data;
  //     if (this.reswfuserdata.count != 0) {
  //       this.wfuserlists = this.reswfuserdata.results;
  //     }
  //   });
  // }

  createForm() {
    if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null') {
      this.teamMemberForm = this.formbuilder.group({
        'first_name': [this.teamModel.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'last_name': [this.teamModel.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'email': [this.teamModel.email, Validators.compose([Validators.required, Validators.email, this.noWhitespaceValidator])],
        'phone': [this.teamModel.phone, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
        'university_avatar': [this.teamModel.university_avatar],
        'organization': [this.teamModel.organization],
        'reviewer': [this.teamModel.reviewer],
        'download': [this.teamModel.download],
        'all_steps': [this.teamModel.all_steps],
        'specific_step': [this.teamModel.specific_step],
        'activity_field_set': [this.teamModel.activity_field_set ? this.teamModel.activity_field_set.split(',') : []],
        'students': [this.teamModel.students],
        'certificate': [this.teamModel.certificate],
        'issue_certificate': [this.teamModel.issue_certificate],
        'account_settings': [this.teamModel.account_settings],
        'add_product': [this.teamModel.add_product],
        'change_password': [this.teamModel.change_password],
        'admin_prv': [this.teamModel.admin_prv],
        'dashboard_prv': [this.teamModel.dashboard_prv],
        'producttrace_pre': [this.teamModel.producttrace_pre],
        'producttrack_pre': [this.teamModel.producttrack_pre],
        'productloc_pre': [this.teamModel.productloc_pre],
        'canned_message_pre': [this.teamModel.canned_message_pre],
        'member_menu_pre': [this.teamModel.member_menu_pre],
        'workflow_menu_pre': [this.teamModel.workflow_menu_pre],
        'download_activities_pre': [this.teamModel.download_activities_pre],
        'register_type': ['5'],
        'custom_template': [null],
        'workflow_db_id': [this.teamModel.workflow_db_id]
      });
      if (this.teamModel.reviewer) {
        if (this.teamModel.all_steps) {
          this.teamMemberForm.controls['activity_field_set'].setValue(null);
          this.teamMemberForm.controls['activity_field_set'].clearValidators();
          this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
          this.teamMemberForm.controls['workflow_db_id'].clearValidators();
          this.teamMemberForm.controls['workflow_db_id'].updateValueAndValidity();
        } else {
          this.teamMemberForm.controls['activity_field_set'].setValidators([Validators.required]);
          this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
          // this.teamMemberForm.controls['workflow_db_id'].setValidators([Validators.required]);
          // this.teamMemberForm.controls['workflow_db_id'].updateValueAndValidity();
          setTimeout(() => {
            this.firstWFLiSelect(this.reswfdataLists[0].workflow_db_id);
          }, 300);
          if (this.teamModel.workflow_db_id && this.teamModel.workflow_db_id != null) {
            this.onSelectWF(this.teamModel.workflow_db_id, true);
          }
        }
      }
      this.disablebutton = false;
      this.access_notify = false;
    } else {
      this.teamMemberForm = this.formbuilder.group({
        'first_name': [this.teamModel.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'last_name': [this.teamModel.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'email': [this.teamModel.email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'phone': [this.teamModel.phone, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
        'university_avatar': [this.teamModel.university_avatar],
        'organization': [this.teamModel.organization],
        'reviewer': [this.teamModel.reviewer],
        'download': [this.teamModel.download],
        'all_steps': [this.teamModel.all_steps],
        'specific_step': [this.teamModel.specific_step],
        'activity_field_set': [this.teamModel.activity_field_set ? this.teamModel.activity_field_set.split(',') : []],
        'students': [this.teamModel.students],
        'certificate': [this.teamModel.certificate],
        'issue_certificate': [this.teamModel.issue_certificate],
        'account_settings': [this.teamModel.account_settings],
        'add_product': [this.teamModel.add_product],
        'change_password': [this.teamModel.change_password],
        'admin_prv': [this.teamModel.admin_prv],
        'dashboard_prv': [this.teamModel.dashboard_prv],
        'producttrace_pre': [this.teamModel.producttrace_pre],
        'producttrack_pre': [this.teamModel.producttrack_pre],
        'productloc_pre': [this.teamModel.productloc_pre],
        'canned_message_pre': [this.teamModel.canned_message_pre],
        'member_menu_pre': [this.teamModel.member_menu_pre],
        'workflow_menu_pre': [this.teamModel.workflow_menu_pre],
        'download_activities_pre': [this.teamModel.download_activities_pre],
        'register_type': ['5'],
        'custom_template': [null],
        'workflow_db_id': [this.teamModel.workflow_db_id]
      });
    }
    if (this.teamModel.reviewer) {
      this.selectsArray = [
        this.teamModel.students === true ? 1 : 0,
        this.teamModel.certificate === true ? 1 : 0,
        this.teamModel.issue_certificate === true ? 1 : 0,
        this.teamModel.account_settings === true ? 1 : 0,
        this.teamModel.add_product === true ? 1 : 0,
        this.teamModel.change_password === true ? 1 : 0,
        this.teamModel.reviewer === true ? 1 : 0,
        this.teamModel.dashboard_prv === true ? 1 : 0,
        this.teamModel.producttrace_pre === true ? 1 : 0,
        this.teamModel.producttrack_pre === true ? 1 : 0,
        this.teamModel.productloc_pre === true ? 1 : 0,
        // this.teamModel.canned_message_pre === true ? 1 : 0,
        this.teamModel.member_menu_pre === true ? 1 : 0,
        this.teamModel.workflow_menu_pre === true ? 1 : 0,
        this.teamModel.download_activities_pre === true ? 1 : 0
      ];
    } else {
      this.selectsArray = [
        this.teamModel.students === true ? 1 : 0,
        this.teamModel.certificate === true ? 1 : 0,
        this.teamModel.issue_certificate === true ? 1 : 0,
        this.teamModel.account_settings === true ? 1 : 0,
        this.teamModel.add_product === true ? 1 : 0,
        this.teamModel.change_password === true ? 1 : 0,
        this.teamModel.reviewer === true ? 1 : 0,
        this.teamModel.dashboard_prv === true ? 1 : 0,
        this.teamModel.producttrace_pre === true ? 1 : 0,
        this.teamModel.producttrack_pre === true ? 1 : 0,
        this.teamModel.productloc_pre === true ? 1 : 0,
        // this.teamModel.canned_message_pre === true ? 1 : 0,
        this.teamModel.member_menu_pre === true ? 1 : 0,
        this.teamModel.workflow_menu_pre === true ? 1 : 0
      ];
    }
    
    const filtered = this.selectsArray.filter(function (el) {
      return el != null;
    });
    this.disablebuttonFun(filtered);
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submitForm(formData) {
    formData.cannedmessage_prv = formData.canned_message_pre;
    this.teamMemberForm.markAsTouched();
    this.errorMsgArr = [];
    this.errorMsg = '';
    if (this.teamMemberForm.valid) {
      formData.activity_field_set = formData.activity_field_set ? formData.activity_field_set.toString() : '';
      if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null') {
        this.editTeamMember(formData, this.memberId);
      } else {
        this.addTeamMember(formData);
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  onSelectWF(wfdbid, fromEdit = false) {
    this.teamService.getwfmemlists(wfdbid).subscribe(
      data => {
        this.reswfuserdata = data;
        if (!fromEdit) {
          this.wfuserlists = [];
          this.teamMemberForm.controls['activity_field_set'].setValue(null);
        }
        this.teamMemberForm.controls['activity_field_set'].setValidators([Validators.required]);
        this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
        if (this.reswfuserdata.user_list.length != 0) {
          this.wfuserlists = this.reswfuserdata.user_list;
        }
      });
  }

  addTeamMember(formData) {
    this.process = true;
    this.teamService.addMember(formData).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('member_added', 'Close');
        this.router.navigate(['members']);
      },
      err => {
        this.process = false;
        if (err.error && err.error.non_field_errors) {
          this.errorMsg = err.error.non_field_errors[0];
        } else if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else if (err.status === 400) {
          const errArr = [];
          if (err.error[0] === "This email is registered with this account type already") {
            this.errorMsg = "This email is registered with this account type already";
          } else {
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
                this.errorMsgArr[key] = err.error[key][0];
              }
            }
            this.errorMsg = (errArr.length !== 0) ? 'provide_valid_inputs' : err.error;
          }
        } else {
          this.errorMsg = 'some_error_occurred';
        }
      }
    );
  }

  editTeamMember(formData, memberId) {
    this.process = true;
    this.teamService.editMember(formData, memberId).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('member_edited', 'Close');
        this.router.navigate(['members']);
      },
      err => {
        this.process = false;
        if (err.error && err.error.non_field_errors) {
          this.errorMsg = err.error.non_field_errors[0];
        } else if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else if (err.status === 400) {
          const errArr = [];
          if (err.error[0] === "This email is registered with this account type already") {
            this.errorMsg = "This email is registered with this account type already";
          } else {
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
                this.errorMsgArr[key] = err.error[key][0];
              }
            }
            this.errorMsg = (errArr.length !== 0) ? 'provide_valid_inputs' : err.error;
          }
        } else {
          this.errorMsg = 'some_error_occurred';
        }
      }
    );
  }

  deleteProfileImage() {
    this.teamModel.university_avatar = '';
    this.teamMemberForm.controls['university_avatar'].setValue(null);
  }

  onSelectTeamCheck(value: any, isChecked: boolean, find = '') {
    if (isChecked) {
      this.selectsArray.push(value);
      if (find === 'block' && this.teamMemberForm.controls['issue_certificate'].value === false) {
        this.selectsArray.push(value);
      }
    } else {
      const courseVal = this.selectsArray.find(x => x === value);
      const index = this.selectsArray.indexOf(courseVal);
      this.selectsArray.splice(index, 1);
    }
    this.disablebuttonFun(this.selectsArray);
  }

  disablebuttonFun(selectedArray) {
    const filtered = selectedArray.filter(function (el) { return el; });
    this.selectstring = filtered.toString();
    console.log(this.selectstring);
    if (this.selectstring !== '') {
      this.disablebutton = false;
      this.access_notify = false;
    } else {
      this.disablebutton = true;
      this.access_notify = true;
    }
  }

  getErrorMsg(field) {
    if (field === 'phone') {
      return this.teamMemberForm.controls[field].hasError('pattern') ? 'enter_valid_phonenumber' : '';
    } else {
      return this.teamMemberForm.controls[field].hasError('required')
        || this.teamMemberForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
        this.teamMemberForm.controls[field].hasError('email') ? 'not_valid_email' : '';
    }
  }

  clear() {
    if (this.teamMemberForm.controls['all_steps'].value) {
      this.teamMemberForm.controls['activity_field_set'].setValue(null);
      this.teamMemberForm.controls['activity_field_set'].clearValidators();
      this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
      this.teamMemberForm.controls['workflow_db_id'].clearValidators();
      this.teamMemberForm.controls['workflow_db_id'].updateValueAndValidity();
    } else {
      this.teamMemberForm.controls['activity_field_set'].setValidators([Validators.required]);
      this.teamMemberForm.controls['activity_field_set'].updateValueAndValidity();
      // this.teamMemberForm.controls['workflow_db_id'].setValidators([Validators.required]);
      // this.teamMemberForm.controls['workflow_db_id'].updateValueAndValidity();
    }
  }

  uploadFileOrg(e) {
    this.errorMsg = '';
    this.errorMsgArr['university_avatar'] = '';
    this.orgPic = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.orgPic.append('file', file, file.name);
        this.orgPic.append('user', this.apiService.user.id);
        this.apiService.uploadFile(this.orgPic).subscribe(
          data => {
            this.teamModel.university_avatar = data['file_url'];
            this.teamMemberForm.controls['university_avatar'].setValue(data['file_url']);
            this.orgPic = new FormData();
          },
          err => {
            this.common.openSnackBar('error_in_file_upload', 'Close');
          }
        );
      } else {
        this.teamModel.university_avatar = '';
        this.teamMemberForm.controls['university_avatar'].setValue(null);
        this.errorMsgArr['university_avatar'] = 'file_size_more';
        this.errorMsg = 'provide_valid_inputs';
      }
    } else {
      this.teamModel.university_avatar = '';
      this.teamMemberForm.controls['university_avatar'].setValue(null);
      this.errorMsgArr['university_avatar'] = 'invalid_file_type';
      this.errorMsg = 'provide_valid_inputs';
    }
  }
}

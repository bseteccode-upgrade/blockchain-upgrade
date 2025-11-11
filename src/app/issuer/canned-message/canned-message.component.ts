/*
 * File : canned-message.component.ts
 * Use: canned message functionality for supply chain and credential user's
 * Copyright : vottun 2019
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-canned-message',
  templateUrl: './canned-message.component.html',
  styleUrls: ['./canned-message.component.css']
})
export class CannedMessageComponent implements OnInit, OnDestroy {
  mailModel: any = {
    first_cert_email: '',
    sec_cert_email: '',
    student_email: '',
    first_cert_email_sub: '',
    sec_cert_email_sub: '',
    supy_chn_email: '',
    send_qr_email: '',
    send_qr_email_sub: '',
    supy_chn_email_sub: '',
    first_cert_email_badge: '',
    first_cert_email_sub_badge: '',
    sec_cert_email_badge: '',
    sec_cert_email_sub_badge: '',
    member_new_email: '',
    team_mail_subject: '',
    first_step_mail_sub: '',
    first_step_mail: '',
    modify_activity_mail: '',
    modify_activity_mail_sub: '',
    modify_activity_mail_own: '',
    modify_activity_mail_own_sub: '',
    send_next_user_mail: '',
    send_next_user_mail_sub: '',
    company_admin_email: '',
    company_admin_email_sub: '',
    supply_chain_keyword: '',
    edu_keywords: '',
    team_member_invite_subject: '',
    team_member_invite_mail_content: '',
    email_share_mail_subject: '',
    email_share_mail_content: '',
    first_step_resend_subject: '',
    first_step_resend_mail_content: '',
    activity_share_subject: '',
    activity_share_mail_content: '',
    company_admin_with_team_member_sub: '',
    company_admin_with_team_member_email: ''
  };
  errorMsg: string;
  mailform: FormGroup;
  supplymailform: FormGroup;
  profilePic = new FormData();
  errorMsgArr: any = [];
  studentId: string;
  process = false;

  first_cert_email_sub_create: any = [];
  first_cert_email_sub_find: any = [];
  first_cert_email_sub_arr = [];
  first_cert_email_create: any = [];
  first_cert_email_find: any = [];
  first_cert_email_arr = [
    'home_page', 'email', 'passw'
  ];
  sec_cert_email_sub_create: any = [];
  sec_cert_email_sub_find: any = [];
  sec_cert_email_sub_arr = [];
  sec_cert_email_create: any = [];
  sec_cert_email_find: any = [];
  sec_cert_email_arr = [
    'home_page'
  ];
  first_cert_email_sub_badge_create: any = [];
  first_cert_email_sub_badge_find: any = [];
  first_cert_email_sub_badge_arr = [];
  first_cert_email_badge_create: any = [];
  first_cert_email_badge_find: any = [];
  first_cert_email_badge_arr = [
    'home_page', 'email', 'passw'
  ];
  sec_cert_email_sub_badge_create: any = [];
  sec_cert_email_sub_badge_find: any = [];
  sec_cert_email_sub_badge_arr = [];
  sec_cert_email_badge_create: any = [];
  sec_cert_email_badge_find: any = [];
  sec_cert_email_badge_arr = [
    'home_page'
  ];

  supy_chn_email_create: any = [];
  supy_chn_email_find: any = [];
  supy_chn_email_arr = [
    'name', 'home_page', 'email', 'password'
  ];
  activity_success_mail_create: any = [];
  activity_success_mail_find: any = [];
  activity_success_mail_arr = [
    'name', 'product_detail'
  ];
  member_welcome_mail_create: any = [];
  member_welcome_mail_find: any = [];
  member_welcome_mail_arr = [
    'name', 'university', 'home_page', 'email', 'password'
  ];
  first_step_mail_create: any = [];
  first_step_mail_find: any = [];
  first_step_mail_arr = [
    'name', 'workflow_id', 'home_page', 'email', 'password'
  ];
  first_step_mail_sub_create: any = [];
  first_step_mail_sub_find: any = [];
  first_step_mail_sub_arr = [];
  modify_activity_mail_create: any = [];
  modify_activity_mail_find: any = [];
  modify_activity_mail_arr = [
    'name', 'workflow_id', 'home_page', 'email', 'password', 'product_detail'
  ];
  modify_activity_mail_sub_create: any = [];
  modify_activity_mail_sub_find: any = [];
  modify_activity_mail_sub_arr = [];

  modify_activity_mail_own_create: any = [];
  modify_activity_mail_own_find: any = [];
  modify_activity_mail_own_arr = [
    'name', 'workflow_id', 'home_page', 'email', 'password', 'product_detail'
  ];
  modify_activity_mail_own_sub_create: any = [];
  modify_activity_mail_own_sub_find: any = [];
  modify_activity_mail_own_sub_arr = [];

  send_next_user_mail_sub_create: any = [];
  send_next_user_mail_sub_find: any = [];
  send_next_user_mail_sub_arr = [];
  send_next_user_mail_create: any = [];
  send_next_user_mail_find: any = [];
  send_next_user_mail_arr = [
    'name', 'workflow_id', 'home_page', 'email', 'password', 'product_detail'
  ];

  company_admin_email_sub_create: any = [];
  company_admin_email_sub_find: any = [];
  company_admin_email_sub_arr = [];
  company_admin_email_create: any = [];
  company_admin_email_find: any = [];
  company_admin_email_arr = [
    'name', 'workflow_id', 'home_page', 'email', 'password'
  ];

  company_admin_with_team_member_sub_create: any = [];
  company_admin_with_team_member_sub_find: any = [];
  company_admin_with_team_member_sub_arr = [];
  company_admin_with_team_member_email_create: any = [];
  company_admin_with_team_member_email_find: any = [];
  company_admin_with_team_member_email_arr = [
    'name', 'workflow_id', 'home_page', 'email', 'password', 'team_members'
  ];

  team_member_invite_sub_create: any = [];
  team_member_invite_sub_find: any = [];
  team_member_invite_sub_arr = [];
  team_member_invite_email_create: any = [];
  team_member_invite_email_find: any = [];
  team_member_invite_email_arr = ['home_page', 'email', 'passw'];

  email_share_sub_create: any = [];
  email_share_sub_find: any = [];
  email_share_sub_arr = [];
  email_share_email_create: any = [];
  email_share_email_find: any = [];
  email_share_email_arr = ['home_page'];

  resend_mail_sub_create: any = [];
  resend_mail_sub_find: any = [];
  resend_mail_sub_arr = [];
  resend_mail_email_create: any = [];
  resend_mail_email_find: any = [];
  resend_mail_email_arr = [
    'name', 'workflow_id', 'home_page', 'email', 'password'
  ];

  activity_share_sub_create: any = [];
  activity_share_sub_find: any = [];
  activity_share_sub_arr = [];
  activity_share_email_create: any = [];
  activity_share_email_find: any = [];
  activity_share_email_arr = ['in_batch_id', 'transaction_address', 'evidence'];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    sanitize: false,
    toolbarPosition: 'top'
  };
  getMailContentSubscribtion: any;
  constructor(
    private formbuilder: FormBuilder,
    private stdService: StudentService,
    public apiService: ApiService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getMailContent();
  }

  getMailContent() {
    this.getMailContentSubscribtion = this.stdService.getMailData(this.apiService.user.profile_id).subscribe(
      data => {
        this.mailModel = data;
        this.createForm();
      });
  }

  createForm() {
    this.mailform = this.formbuilder.group({
      'edutype': ['firstcert'],
      'first_cert_email': [this.mailModel.first_cert_email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'sec_cert_email': [this.mailModel.sec_cert_email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'student_email': [this.mailModel.student_email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_cert_email_sub': [this.mailModel.first_cert_email_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'sec_cert_email_sub': [this.mailModel.sec_cert_email_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_cert_email_badge': [this.mailModel.first_cert_email_badge, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_cert_email_sub_badge': [this.mailModel.first_cert_email_sub_badge, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'sec_cert_email_badge': [this.mailModel.sec_cert_email_badge, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'sec_cert_email_sub_badge': [this.mailModel.sec_cert_email_sub_badge, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'team_member_invite_subject': [this.mailModel.team_member_invite_subject, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'team_member_invite_mail_content': [this.mailModel.team_member_invite_mail_content, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'email_share_mail_subject': [this.mailModel.email_share_mail_subject, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'email_share_mail_content': [this.mailModel.email_share_mail_content, Validators.compose([Validators.required, this.noWhitespaceValidator])]
    });
    this.supplymailform = this.formbuilder.group({
      'supplytype': ['workflow'],
      'supy_chn_email': [this.mailModel.supy_chn_email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'send_qr_email': [this.mailModel.send_qr_email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'send_qr_email_sub': [this.mailModel.send_qr_email_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'supy_chn_email_sub': [this.mailModel.supy_chn_email_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'member_new_email': [this.mailModel.member_new_email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'team_mail_subject': [this.mailModel.team_mail_subject, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_step_mail': [this.mailModel.first_step_mail, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_step_mail_sub': [this.mailModel.first_step_mail_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'modify_activity_mail': [this.mailModel.modify_activity_mail, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'modify_activity_mail_sub': [this.mailModel.modify_activity_mail_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'modify_activity_mail_own': [this.mailModel.modify_activity_mail_own, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'modify_activity_mail_own_sub': [this.mailModel.modify_activity_mail_own_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'send_next_user_mail': [this.mailModel.send_next_user_mail, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'send_next_user_mail_sub': [this.mailModel.send_next_user_mail_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'company_admin_email': [this.mailModel.company_admin_email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'company_admin_email_sub': [this.mailModel.company_admin_email_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_step_resend_subject': [this.mailModel.first_step_resend_subject, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'first_step_resend_mail_content': [this.mailModel.first_step_resend_mail_content, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'activity_share_subject': [this.mailModel.activity_share_subject, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'activity_share_mail_content': [this.mailModel.activity_share_mail_content, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'company_admin_with_team_member_email': [this.mailModel.company_admin_with_team_member_email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'company_admin_with_team_member_sub': [this.mailModel.company_admin_with_team_member_sub, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  checkDifferentKeyWord(subStr, field, msg) {
    if (this.mailModel.edu_keywords.length > 0) {
      const index = this.mailModel.edu_keywords.findIndex(e => e.key === subStr);
      if (index == -1) {
        this.errorMsg = 'provide_valid_inputs';
        // this.errorMsgArr[field] = msg;
        this.common.openSnackBar('first_cert_email_sub_error_msg');
      }
    }
  }

  submit(formData) {
    this.errorMsgArr = [];
    this.errorMsg = '';
    const first_cert_email_sub_find_form_value = formData.first_cert_email_sub.replace(/\n/g, ' ');
    this.first_cert_email_sub_find = first_cert_email_sub_find_form_value.split(' ');
    this.first_cert_email_sub_create = [];
    this.first_cert_email_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.first_cert_email_sub_arr.includes(mySubString)) {
          if (!this.first_cert_email_sub_create.includes(mySubString)) {
            this.first_cert_email_sub_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'first_cert_email_sub', 'first_cert_email_sub_error_msg');
      }
    });
    // if (this.first_cert_email_sub_create.length < this.first_cert_email_sub_arr.length) {
    //   this.errorMsg = 'provide_valid_inputs';
    //   this.errorMsgArr['first_cert_email_sub'] = 'first_cert_email_sub_error_msg';
    //   this.common.openSnackBar('first_cert_email_sub_error_msg', 'Close');
    //   return false;
    // }
    const first_cert_email_form_value = formData.first_cert_email.replace(/\n/g, ' ');
    this.first_cert_email_find = first_cert_email_form_value.split(' ');
    this.first_cert_email_create = [];
    this.first_cert_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.first_cert_email_arr.includes(mySubString)) {
          if (!this.first_cert_email_create.includes(mySubString)) {
            this.first_cert_email_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'first_cert_email', 'first_cert_email_error_msg');
      }
    });
    if (this.first_cert_email_create.length < this.first_cert_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      // this.errorMsgArr['first_cert_email'] = 'first_cert_email_error_msg';
      this.common.openSnackBar('first_cert_email_error_msg', 'Close');
      return false;
    }

    const sec_cert_email_sub_form_value = formData.sec_cert_email_sub.replace(/\n/g, ' ');
    this.sec_cert_email_sub_find = sec_cert_email_sub_form_value.split(' ');
    this.sec_cert_email_sub_create = [];
    this.sec_cert_email_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.sec_cert_email_sub_arr.includes(mySubString)) {
          if (!this.sec_cert_email_sub_create.includes(mySubString)) {
            this.sec_cert_email_sub_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'sec_cert_email_sub', 'sec_cert_email_sub_error_msg');
      }
    });
    // if (this.sec_cert_email_sub_create.length < this.sec_cert_email_sub_arr.length) {
    //   this.errorMsg = 'provide_valid_inputs';
    //   this.errorMsgArr['sec_cert_email_sub'] = 'sec_cert_email_sub_error_msg';
    //   this.common.openSnackBar('sec_cert_email_sub_error_msg', 'Close');
    //   return false;
    // }

    const sec_cert_email_form_value = formData.sec_cert_email.replace(/\n/g, ' ');
    this.sec_cert_email_find = sec_cert_email_form_value.split(' ');
    this.sec_cert_email_create = [];
    this.sec_cert_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.sec_cert_email_arr.includes(mySubString)) {
          if (!this.sec_cert_email_create.includes(mySubString)) {
            this.sec_cert_email_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'sec_cert_email', 'sec_cert_email_error_msg');
      }
    });
    if (this.sec_cert_email_create.length < this.sec_cert_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['sec_cert_email'] = 'sec_cert_email_error_msg';
      this.common.openSnackBar('sec_cert_email_error_msg', 'Close');
      return false;
    }

    const first_cert_email_sub_badge_form_value = formData.first_cert_email_sub_badge.replace(/\n/g, ' ');
    this.first_cert_email_sub_badge_find = first_cert_email_sub_badge_form_value.split(' ');
    this.first_cert_email_sub_badge_create = [];
    this.first_cert_email_sub_badge_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.first_cert_email_sub_badge_arr.includes(mySubString)) {
          if (!this.first_cert_email_sub_badge_create.includes(mySubString)) {
            this.first_cert_email_sub_badge_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'first_cert_email_sub_badge', 'first_cert_email_sub_badge_error_msg');
      }
    });
    // if (this.first_cert_email_sub_badge_create.length < this.first_cert_email_sub_badge_arr.length) {
    //   this.errorMsg = 'provide_valid_inputs';
    //   this.errorMsgArr['first_cert_email_sub_badge'] = 'first_cert_email_sub_badge_error_msg';
    //   this.common.openSnackBar('first_cert_email_sub_badge_error_msg', 'Close');
    //   return false;
    // }

    const first_cert_email_badge_form_value = formData.first_cert_email_badge.replace(/\n/g, ' ');
    this.first_cert_email_badge_find = first_cert_email_badge_form_value.split(' ');
    this.first_cert_email_badge_create = [];
    this.first_cert_email_badge_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.first_cert_email_badge_arr.includes(mySubString)) {
          if (!this.first_cert_email_badge_create.includes(mySubString)) {
            this.first_cert_email_badge_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'first_cert_email_badge', 'first_cert_email_badge_error_msg');
      }
    });
    if (this.first_cert_email_badge_create.length < this.first_cert_email_badge_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['first_cert_email_badge'] = 'first_cert_email_badge_error_msg';
      this.common.openSnackBar('first_cert_email_badge_error_msg', 'Close');
      return false;
    }


    const sec_cert_email_sub_badge_form_value = formData.sec_cert_email_sub_badge.replace(/\n/g, ' ');
    this.sec_cert_email_sub_badge_find = sec_cert_email_sub_badge_form_value.split(' ');
    this.sec_cert_email_sub_badge_create = [];
    this.sec_cert_email_sub_badge_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.sec_cert_email_sub_badge_arr.includes(mySubString)) {
          this.sec_cert_email_sub_badge_create.push(mySubString);
        }
        this.checkDifferentKeyWord(mySubString, 'sec_cert_email_sub_badge', 'sec_cert_email_sub_badge_error_msg');
      }
    });
    // if (this.sec_cert_email_sub_badge_create.length < this.sec_cert_email_sub_badge_arr.length) {
    //   this.errorMsg = 'provide_valid_inputs';
    //   this.errorMsgArr['sec_cert_email_sub_badge'] = 'sec_cert_email_sub_badge_error_msg';
    //   this.common.openSnackBar('sec_cert_email_sub_badge_error_msg', 'Close');
    //   return false;
    // }

    const sec_cert_email_badge_form_value = formData.sec_cert_email_badge.replace(/\n/g, ' ');
    this.sec_cert_email_badge_find = sec_cert_email_badge_form_value.split(' ');
    this.sec_cert_email_badge_create = [];
    this.sec_cert_email_badge_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.sec_cert_email_badge_arr.includes(mySubString)) {
          if (!this.sec_cert_email_badge_create.includes(mySubString)) {
            this.sec_cert_email_badge_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'sec_cert_email_badge', 'sec_cert_email_badge_error_msg');
      }
    });
    if (this.sec_cert_email_badge_create.length < this.sec_cert_email_badge_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['sec_cert_email_badge'] = 'sec_cert_email_badge_error_msg';
      this.common.openSnackBar('sec_cert_email_badge_error_msg', 'Close');
      return false;
    }

    const team_member_invite_subject_form_value = formData.team_member_invite_subject.replace(/\n/g, ' ');
    this.team_member_invite_sub_find = team_member_invite_subject_form_value.split(' ');
    this.team_member_invite_sub_create = [];
    this.team_member_invite_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.sec_cert_email_badge_arr.includes(mySubString)) {
          if (!this.team_member_invite_sub_create.includes(mySubString)) {
            this.team_member_invite_sub_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'team_member_invite_subject', 'team_member_invite_subject_error_msg');
      }
    });
    // if (this.team_member_invite_sub_create.length < this.team_member_invite_sub_arr.length) {
    //   this.errorMsg = 'provide_valid_inputs';
    //   this.errorMsgArr['team_member_invite_subject'] = 'team_member_invite_subject_error_msg';
    //   this.common.openSnackBar('team_member_invite_subject_error_msg', 'Close');
    //   return false;
    // }

    const team_member_invite_mail_content_form_value = formData.team_member_invite_mail_content.replace(/\n/g, ' ');
    this.team_member_invite_email_find = team_member_invite_mail_content_form_value.split(' ');
    this.team_member_invite_email_create = [];
    this.team_member_invite_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.team_member_invite_email_arr.includes(mySubString)) {
          if (!this.team_member_invite_email_create.includes(mySubString)) {
            this.team_member_invite_email_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'team_member_invite_mail_content', 'team_member_invite_mail_content_error_msg');
      }
    });
    if (this.team_member_invite_email_create.length < this.team_member_invite_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['team_member_invite_mail_content'] = 'team_member_invite_mail_content_error_msg';
      this.common.openSnackBar('team_member_invite_mail_content_error_msg', 'Close');
      return false;
    }
    const email_share_mail_subject_form_value = formData.email_share_mail_subject.replace(/\n/g, ' ');
    this.email_share_sub_find = email_share_mail_subject_form_value.split(' ');
    this.email_share_sub_create = [];
    this.email_share_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.email_share_sub_arr.includes(mySubString)) {
          if (!this.email_share_sub_create.includes(mySubString)) {
            this.email_share_sub_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'email_share_mail_subject', 'email_share_mail_subject_error_msg');
      }
    });
    // if (this.email_share_sub_create.length < this.email_share_sub_arr.length) {
    //   this.errorMsg = 'provide_valid_inputs';
    //   this.errorMsgArr['email_share_mail_subject'] = 'email_share_mail_subject_error_msg';
    //   this.common.openSnackBar('email_share_mail_subject_error_msg', 'Close');
    //   return false;
    // }

    const email_share_mail_content_form_value = formData.email_share_mail_content.replace(/\n/g, ' ');
    this.email_share_email_find = email_share_mail_content_form_value.split(' ');
    this.email_share_email_create = [];
    this.email_share_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.email_share_email_arr.includes(mySubString)) {
          if (!this.email_share_email_create.includes(mySubString)) {
            this.email_share_email_create.push(mySubString);
          }
        }
        this.checkDifferentKeyWord(mySubString, 'email_share_mail_content', 'email_share_mail_content_error_msg');
      }
    });
    if (this.email_share_email_create.length < this.email_share_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['email_share_mail_content'] = 'email_share_mail_content_error_msg';
      this.common.openSnackBar('email_share_mail_content_error_msg', 'Close');
      return false;
    }

    if (this.mailform.valid && this.errorMsg == '') {
      this.editMail(formData, this.apiService.user.profile_id);
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  /**
   * Select mail type function
   * @param value selected mail type
   * @param fieldName field name
   */
  getSelectedValue(value, fieldName) {
    this.supplymailform.controls[fieldName].setValue(value);
  }

  supsubmit(formData) {
    this.errorMsgArr = [];

    this.supy_chn_email_find = formData.supy_chn_email.split(' ');
    this.supy_chn_email_create = [];
    this.supy_chn_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.supy_chn_email_arr.includes(mySubString)) {
          this.supy_chn_email_create.push(mySubString);
        }
      }
    });
    if (this.supy_chn_email_create.length < this.supy_chn_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['supy_chn_email'] = 'supy_chn_email_error_msg';
      this.common.openSnackBar('supy_chn_email_error_msg', 'Close');
      return false;
    }

    this.activity_success_mail_find = formData.send_qr_email.split(' ');
    this.activity_success_mail_create = [];
    this.activity_success_mail_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.activity_success_mail_arr.includes(mySubString)) {
          this.activity_success_mail_create.push(mySubString);
        }
      }
    });
    if (this.activity_success_mail_create.length < this.activity_success_mail_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['send_qr_email'] = 'send_qr_email_error_msg';
      this.common.openSnackBar('send_qr_email_error_msg', 'Close');
      return false;
    }

    this.member_welcome_mail_find = formData.member_new_email.split(' ');
    this.member_welcome_mail_create = [];
    this.member_welcome_mail_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.member_welcome_mail_arr.includes(mySubString)) {
          this.member_welcome_mail_create.push(mySubString);
        }
      }
    });
    if (this.member_welcome_mail_create.length < this.member_welcome_mail_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['member_new_email'] = 'member_new_email_error_msg';
      this.common.openSnackBar('member_new_email_error_msg', 'Close');
      return false;
    }

    this.first_step_mail_find = formData.first_step_mail.split(' ');
    this.first_step_mail_create = [];
    this.first_step_mail_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.first_step_mail_arr.includes(mySubString)) {
          this.first_step_mail_create.push(mySubString);
        }
      }
    });
    if (this.first_step_mail_create.length < this.first_step_mail_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['first_step_mail'] = 'first_step_mail_error_msg';
      this.common.openSnackBar('first_step_mail_error_msg', 'Close');
      return false;
    }

    this.first_step_mail_sub_find = formData.first_step_mail_sub.split(' ');
    this.first_step_mail_sub_create = [];
    this.first_step_mail_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.first_step_mail_sub_arr.includes(mySubString)) {
          this.first_step_mail_sub_create.push(mySubString);
        }
      }
    });
    if (this.first_step_mail_sub_create.length < this.first_step_mail_sub_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['first_step_mail_sub'] = 'first_step_mail_sub_error_msg';
      this.common.openSnackBar('first_step_mail_sub_error_msg', 'Close');
      return false;
    }

    this.modify_activity_mail_find = formData.modify_activity_mail.split(' ');
    this.modify_activity_mail_create = [];
    this.modify_activity_mail_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.modify_activity_mail_arr.includes(mySubString)) {
          this.modify_activity_mail_create.push(mySubString);
        }
      }
    });
    if (this.modify_activity_mail_create.length < this.modify_activity_mail_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['modify_activity_mail'] = 'modify_activity_mail_error_msg';
      this.common.openSnackBar('modify_activity_mail_error_msg', 'Close');
      return false;
    }

    this.modify_activity_mail_sub_find = formData.modify_activity_mail_sub.split(' ');
    this.modify_activity_mail_sub_create = [];
    this.modify_activity_mail_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.modify_activity_mail_sub_arr.includes(mySubString)) {
          this.modify_activity_mail_sub_create.push(mySubString);
        }
      }
    });
    if (this.modify_activity_mail_sub_create.length < this.modify_activity_mail_sub_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['modify_activity_mail_sub'] = 'please check the modify activity subject';
      this.common.openSnackBar('please check the modify activity subject', 'Close');
      return false;
    }

    this.modify_activity_mail_own_find = formData.modify_activity_mail_own.split(' ');
    this.modify_activity_mail_own_create = [];
    this.modify_activity_mail_own_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.modify_activity_mail_own_arr.includes(mySubString)) {
          this.modify_activity_mail_own_create.push(mySubString);
        }
      }
    });
    if (this.modify_activity_mail_own_create.length < this.modify_activity_mail_own_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['modify_activity_mail_own'] = 'modify_activity_mail_own_error_msg';
      this.common.openSnackBar('please check the modify activity own mail content', 'Close');
      return false;
    }

    this.modify_activity_mail_own_sub_find = formData.modify_activity_mail_own_sub.split(' ');
    this.modify_activity_mail_own_sub_create = [];
    this.modify_activity_mail_own_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.modify_activity_mail_own_sub_arr.includes(mySubString)) {
          this.modify_activity_mail_own_sub_create.push(mySubString);
        }
      }
    });
    if (this.modify_activity_mail_own_sub_create.length < this.modify_activity_mail_own_sub_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['modify_activity_mail_own_sub'] = 'please check the modify activity own mail subject';
      this.common.openSnackBar('please check the modify activity own mail subject', 'Close');
      return false;
    }
    this.send_next_user_mail_sub_find = formData.send_next_user_mail_sub.split(' ');
    this.send_next_user_mail_sub_create = [];
    this.send_next_user_mail_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.send_next_user_mail_sub_arr.includes(mySubString)) {
          this.send_next_user_mail_sub_create.push(mySubString);
        }
      }
    });
    if (this.send_next_user_mail_sub_create.length < this.send_next_user_mail_sub_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['send_next_user_mail_sub'] = 'next_step_mail_sub_error_msg';
      this.common.openSnackBar('next_step_mail_sub_error_msg', 'Close');
      return false;
    }

    this.send_next_user_mail_sub_find = formData.send_next_user_mail.split(' ');
    this.send_next_user_mail_sub_create = [];
    this.send_next_user_mail_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.send_next_user_mail_arr.includes(mySubString)) {
          this.send_next_user_mail_sub_create.push(mySubString);
        }
      }
    });
    if (this.send_next_user_mail_sub_create.length < this.send_next_user_mail_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['send_next_user_mail'] = 'send_next_user_mail_error_msg';
      this.common.openSnackBar('send_next_user_mail_error_msg', 'Close');
      return false;
    }

    this.company_admin_email_sub_find = formData.company_admin_email_sub.split(' ');
    this.company_admin_email_sub_create = [];
    this.company_admin_email_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.company_admin_email_sub_arr.includes(mySubString)) {
          this.company_admin_email_sub_create.push(mySubString);
        }
      }
    });
    if (this.company_admin_email_sub_create.length < this.company_admin_email_sub_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['company_admin_email_sub'] = 'company_admin_email_sub_error_msg';
      this.common.openSnackBar('company_admin_email_sub_error_msg', 'Close');
      return false;
    }

    this.company_admin_email_find = formData.company_admin_email.split(' ');
    this.company_admin_email_create = [];
    this.company_admin_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.company_admin_email_arr.includes(mySubString)) {
          this.company_admin_email_create.push(mySubString);
        }
      }
    });
    if (this.company_admin_email_create.length < this.company_admin_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['company_admin_email'] = 'company_admin_email_error_msg';
      this.common.openSnackBar('company_admin_email_error_msg', 'Close');
      return false;
    }

    this.company_admin_with_team_member_sub_find = formData.company_admin_with_team_member_sub.split(' ');
    this.company_admin_with_team_member_sub_create = [];
    this.company_admin_with_team_member_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.company_admin_with_team_member_sub_arr.includes(mySubString)) {
          this.company_admin_with_team_member_sub_create.push(mySubString);
        }
      }
    });
    if (this.company_admin_with_team_member_sub_create.length < this.company_admin_with_team_member_sub_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['company_admin_with_team_member_sub'] = 'company_admin_with_team_member_sub_error_msg';
      this.common.openSnackBar('company_admin_with_team_member_sub_error_msg', 'Close');
      return false;
    }

    this.company_admin_with_team_member_email_find = formData.company_admin_with_team_member_email.split(' ');
    this.company_admin_with_team_member_email_create = [];
    this.company_admin_with_team_member_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.company_admin_with_team_member_email_arr.includes(mySubString)) {
          this.company_admin_with_team_member_email_create.push(mySubString);
        }
      }
    });
    if (this.company_admin_with_team_member_email_create.length < this.company_admin_with_team_member_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['company_admin_with_team_member_email'] = 'company_admin_with_team_member_email_error_msg';
      this.common.openSnackBar('company_admin_with_team_member_email_error_msg', 'Close');
      return false;
    }


    this.resend_mail_sub_find = formData.first_step_resend_subject.split(' ');
    this.resend_mail_sub_create = [];
    this.resend_mail_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.resend_mail_sub_arr.includes(mySubString)) {
          this.resend_mail_sub_create.push(mySubString);
        }
      }
    });
    if (this.resend_mail_sub_create.length < this.resend_mail_sub_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['first_step_resend_subject'] = 'first_step_resend_mail_sub_error_msg';
      this.common.openSnackBar('first_step_resend_mail_sub_error_msg', 'Close');
      return false;
    }

    this.resend_mail_email_find = formData.first_step_resend_mail_content.split(' ');
    this.resend_mail_email_create = [];
    this.resend_mail_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.resend_mail_email_arr.includes(mySubString)) {
          this.resend_mail_email_create.push(mySubString);
        }
      }
    });
    if (this.resend_mail_email_create.length < this.resend_mail_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['first_step_resend_mail_content'] = 'first_step_resend_mail_content_error_msg';
      this.common.openSnackBar('first_step_resend_mail_content_error_msg', 'Close');
      return false;
    }

    this.activity_share_sub_find = formData.activity_share_subject.split(' ');
    this.activity_share_sub_create = [];
    this.activity_share_sub_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        if (this.activity_share_sub_arr.includes(mySubString)) {
          this.activity_share_sub_create.push(mySubString);
        }
      }
    });
    if (this.activity_share_sub_create.length < this.activity_share_sub_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['activity_share_subject'] = 'activity_share_subject_error_msg';
      this.common.openSnackBar('activity_share_subject_error_msg', 'Close');
      return false;
    }

    this.activity_share_email_find = formData.activity_share_mail_content.split(' ');
    this.activity_share_email_create = [];
    console.log(this.activity_share_email_find);
    this.activity_share_email_find.filter(x => {
      if (x != '' && x.indexOf('{') > -1) {
        const mySubString = x.substring(
          x.lastIndexOf('{') + 1,
          x.lastIndexOf('}')
        );
        console.log(mySubString);
        if (this.activity_share_email_arr.includes(mySubString)) {
          this.activity_share_email_create.push(mySubString);
        }
      }
    });
    console.log(this.activity_share_email_create.length);
    console.log(this.activity_share_email_arr.length);
    if (this.activity_share_email_create.length < this.activity_share_email_arr.length) {
      this.errorMsg = 'provide_valid_inputs';
      this.errorMsgArr['activity_share_mail_content'] = 'activity_share_mail_content_error_msg';
      this.common.openSnackBar('activity_share_mail_content_error_msg', 'Close');
      return false;
    }
    if (this.supplymailform.valid) {
      this.editMail(formData, this.apiService.user.profile_id);
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  editMail(formData, id) {
    this.stdService.updateMail(formData).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('mail_content_updated', 'Close');
        this.router.navigate(['canned']);
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = 'provide_valid_inputs';
        }
      }
    );
  }

  geterrorMsg(field) {
    return this.mailform.controls[field].hasError('required')
      || this.mailform.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

  geterrorMsgSup(field) {
    return this.supplymailform.controls[field].hasError('required')
      || this.supplymailform.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

  ngOnDestroy() {
    if (this.getMailContentSubscribtion) {
      this.getMailContentSubscribtion.unsubscribe();
    }
  }
}

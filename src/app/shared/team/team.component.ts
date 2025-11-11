/*
 * File : team.component.ts
 * Use: create the team member for publisher user
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { TeamService } from '../../service/team.service';
import { CertificateService } from '../../issuer/services/certificate.service';
import { CommonService } from '../../service/common.service';
import { ProductService } from '../../product/services/product.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  teamMemberForm: FormGroup;
  errorMsg: string;
  allcount: any = 0;
  fieldData: any = [];
  errorMsgArr: any = [];
  selectsArray: any = [];
  selectstring: string;
  disablebutton = true;
  disfield = false;
  successMsg: string;
  memberId: string;
  workflowrole: any;
  workflowstep: any;
  workflowid: any;
  workflowname: any;
  selectedstatus: any = true;
  disprimaryfield: any = false;
  access_notify = true;
  process = false;
  productList: any;
  profilePic = new FormData();
  orgPic = new FormData();
  statuslists: any = [{ 'value': true, 'text': 'active' }, { 'value': false, 'text': 'in_active' }];
  teamModel: any = {
    'first_name': '',
    'last_name': '',
    'email': '',
    'phone': '',
    'organization': '',
    'custom_template': null,
    'avatar': '',
    'university_avatar': '',
    'dashboard': false,
    'change_password': false,
    'allow_search': false,
    'account_settings': false,
    'blockchain_certificate': false,
    'issue_certificate': false,
    'students': false,
    'certificate': false,
    'is_active': true,
    'add_product': false,
    'course': false,
    'product_step': null,
    'product_assigned': null,
    'is_final_step': false,
    'activity_field_set': '',
    'show_role': false,
    'graphic_show_role': false,
    'num_sub_products': '',
    'admin_prv': false,
    'logs_prv': false,
    'teammembers_prv': false,
    'cannedmessage_prv': false,
    'api_prv': false,
    'bouncedmail_prv': false,
    'team_member_mail_id': null,
    'marketing_tool_prv': false,
  };
  dateTypes = [
    { index: 1, val: 'any_date' },
    { index: 2, val: 'past_date' },
    { index: 3, val: 'current_date' },
    { index: 4, val: 'future_date' }
  ];

  printData = [
    'any_date', 'past_date', 'current_date', 'future_date'
  ];

  allFields = [
    'date_certified',
    'country_certified',
    'manufacture_date',
    'description',
    'certifier_name',
    'certifier_designation',
    'expiry_date',
    'certificate_number',
    'transport',
    'shipping',
    'category',
    'weight',
    'type_of_packing',
    'storage_condition',
    'processing_plant',
    'grade',
    'minimum_shell_life'
  ];
  typeLists: any = [
    'text', 'number', 'date', 'dropdown', 'location', 'document'
  ];
  stepLists: any;
  dispProdMand = false;
  @ViewChild('optionval') optionval: ElementRef;
  cannedDatas: any = [];
  constructor(
    private formbuilder: FormBuilder,
    public apiService: ApiService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    public common: CommonService,
    private router: Router,
    private productService: ProductService,
    public ngxSmartModalService: NgxSmartModalService,
    private certService: CertificateService
  ) {
    this.memberId = this.route.snapshot.paramMap.get('id');
    this.workflowrole = this.route.snapshot.paramMap.get('role');
    this.workflowstep = this.route.snapshot.paramMap.get('step');
    this.workflowid = this.route.snapshot.paramMap.get('userid');
    this.workflowname = this.route.snapshot.paramMap.get('wfname');
    this.createForm();
    if (this.apiService.userType === '3' || this.apiService.userType === '0') {
      this.teamMemberForm.controls['product_step'].setValidators([Validators.required]);
      this.teamMemberForm.controls['custom_template'].setValidators([Validators.required, this.noWhitespaceValidator]);
      this.teamMemberForm.updateValueAndValidity();
    }
  }

  getCannedMsgList() {
    this.certService.getCannedMessageAll().subscribe(res => {
      this.cannedDatas = res;
      if (res != null && res != []) {
        console.log('hiiii');
        const result = this.cannedDatas.reduce(function (r, a) {
          r[a.mail_type] = r[a.mail_type] || [];
          r[a.mail_type].push(a);
          return r;
        }, Object.create(null));
        console.log(result);
        console.log(result[5]);
        if (result[5] && result[5].length > 0) {
          console.log(result);
          this.cannedDatas = result[5];
        } else {
          this.cannedDatas = [];
        }

      }

    });
  }

  ngOnInit() {
    this.getCannedMsgList();
    if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null') {
      this.teamService.getTeamMember(this.memberId).subscribe(data => {
        this.teamModel = data;
        this.createForm();
        this.selectsArray = [
          this.teamModel.students === true ? 1 : '',
          this.teamModel.certificate === true ? 1 : '',
          this.teamModel.issue_certificate === true ? 1 : '',
          // this.teamModel.blockchain_certificate === true ? 1 : '',
          this.teamModel.account_settings === true ? 1 : '',
          this.teamModel.change_password === true ? 1 : '',
          this.teamModel.allow_search === true ? 1 : '',
          this.teamModel.course === true ? 1 : '',
          this.teamModel.logs_prv === true ? 1 : '',
          this.teamModel.teammembers_prv === true ? 1 : '',
          this.teamModel.cannedmessage_prv === true ? 1 : '',
          this.teamModel.api_prv === true ? 1 : '',
          this.teamModel.bouncedmail_prv === true ? 1 : ''
        ];
        const filtered = this.selectsArray.filter(function (el) {
          return el != null;
        });
        if (this.apiService.userType === '3' || this.apiService.userType === '0') {
          this.teamMemberForm.controls['product_step'].setValidators([Validators.required]);
          this.teamMemberForm.controls['custom_template'].setValidators([Validators.required, this.noWhitespaceValidator]);
          this.teamMemberForm.controls['num_sub_products'].setValidators([Validators.required, this.noWhitespaceValidator, Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)]);
        }
        this.teamMemberForm.updateValueAndValidity();
      }, err => {
        // this.router.navigate(['teamlist']);
        // this.common.openSnackBar('Invalid member id', 'Close');
      });
    } else {
      // this.createForm();
    }
    this.stepLists = Array(100).fill(0);
  }

  createForm() {
    if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null') {
      this.teamMemberForm = this.formbuilder.group({
        'first_name': [this.teamModel.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'last_name': [this.teamModel.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'email': [this.teamModel.email, Validators.compose([Validators.required, Validators.email, this.noWhitespaceValidator])],
        'phone': [this.teamModel.phone, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
        'change_password': [this.teamModel.change_password],
        'allow_search': [this.teamModel.allow_search],
        'course': [this.teamModel.course],
        'workflow_id': [this.teamModel.workflow_id],
        'dashboard': [this.teamModel.dashboard],
        'students': [this.teamModel.students],
        'certificate': [this.teamModel.certificate],
        'issue_certificate': [this.teamModel.issue_certificate],
        'blockchain_certificate': [this.teamModel.blockchain_certificate],
        'account_settings': [this.teamModel.account_settings],
        'is_active': [true],
        'add_product': [this.teamModel.add_product],
        'avatar': [this.teamModel.avatar],
        'university_avatar': [this.teamModel.university_avatar],
        'organization': [this.teamModel.organization],
        'custom_template': [this.teamModel.custom_template],
        'product_assigned': [this.teamModel.product_assigned],
        'product_step': [this.workflowstep ? this.workflowstep : this.teamModel.product_step],
        'is_final_step': [this.teamModel.is_final_step],
        'fields_select': [null],
        'activity_field_set': [this.teamModel.activity_field_set ? this.teamModel.activity_field_set.split(',') : []],
        'field_set': this.formbuilder.array([]),
        'num_sub_products': [this.teamModel.num_sub_products],
        'show_role': [this.teamModel.show_role],
        'graphic_show_role': [this.teamModel.graphic_show_role],
        'admin_prv': [this.teamModel.admin_prv],
        'logs_prv': [this.teamModel.logs_prv],
        'teammembers_prv': [this.teamModel.teammembers_prv],
        'cannedmessage_prv': [this.teamModel.cannedmessage_prv],
        'api_prv': [this.teamModel.api_prv],
        'bouncedmail_prv': [this.teamModel.bouncedmail_prv],
        'register_type': ['4'],
        'team_member_mail_id': [this.teamModel.team_member_mail_id],
        'marketing_tool_prv': [this.teamModel.marketing_tool_prv],
      });
      this.access_notify = false;
      this.disablebutton = false;
    } else {
      this.teamMemberForm = this.formbuilder.group({
        'first_name': [this.teamModel.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'last_name': [this.teamModel.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'email': [this.teamModel.email, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'phone': [this.teamModel.phone, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
        'change_password': [this.teamModel.change_password],
        'allow_search': [this.teamModel.allow_search],
        'course': [this.teamModel.course],
        'workflow_id': [this.teamModel.workflow_id],
        'dashboard': [this.teamModel.dashboard],
        'students': [this.teamModel.students],
        'certificate': [this.teamModel.certificate],
        'issue_certificate': [this.teamModel.issue_certificate],
        'blockchain_certificate': [this.teamModel.blockchain_certificate],
        'account_settings': [this.teamModel.account_settings],
        'is_active': [true],
        'add_product': [this.teamModel.add_product],
        'avatar': [this.teamModel.avatar],
        'university_avatar': [this.teamModel.university_avatar],
        'organization': [this.teamModel.organization],
        'custom_template': [this.teamModel.custom_template],
        'product_assigned': [this.teamModel.product_assigned],
        'product_step': [this.workflowstep ? this.workflowstep : this.teamModel.product_step],
        'is_final_step': [this.teamModel.is_final_step],
        'fields_select': [null],
        'activity_field_set': [this.teamModel.activity_field_set ? this.teamModel.activity_field_set.split(',') : []],
        'field_set': this.formbuilder.array([this.initNqCoordinators('', '', '', '', false, false, [], false, false, false)]),
        'num_sub_products': [this.teamModel.num_sub_products],
        'show_role': [this.teamModel.show_role],
        'graphic_show_role': [this.teamModel.graphic_show_role],
        'admin_prv': [this.teamModel.admin_prv],
        'logs_prv': [this.teamModel.logs_prv],
        'teammembers_prv': [this.teamModel.teammembers_prv],
        'cannedmessage_prv': [this.teamModel.cannedmessage_prv],
        'api_prv': [this.teamModel.api_prv],

        'bouncedmail_prv': [this.teamModel.bouncedmail_prv],
        'register_type': ['4'],
        'team_member_mail_id': [this.teamModel.team_member_mail_id, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'marketing_tool_prv': [this.teamModel.marketing_tool_prv],
      });
    }

    this.getAllProductDetails();
  }
  initNqCoordinators(label = '', type = '', name = '', placeholder = '', req = false, show = false, options = [], primary = false, save = false, enable_furture = false) {
    return this.formbuilder.group({
      'label': [label],
      'type': [type],
      'name': [name],
      'placeholder': [placeholder],
      'required': [req],
      'options': this.formbuilder.array(options),
      'value': [],
      'show': [show],
      'primary': [primary],
      'save': [save],
      'enable_furture': [enable_furture]
    });
  }

  adminSelect() {
    if (!this.teamMemberForm.controls['admin_prv'].value) {
      this.teamMemberForm.controls['dashboard'].setValue(false);
      this.teamMemberForm.controls['students'].setValue(false);
      this.teamMemberForm.controls['certificate'].setValue(false);
      this.teamMemberForm.controls['issue_certificate'].setValue(false);
      this.teamMemberForm.controls['account_settings'].setValue(false);
      this.teamMemberForm.controls['change_password'].setValue(false);
      this.teamMemberForm.controls['allow_search'].setValue(false);
      this.teamMemberForm.controls['course'].setValue(false);
      this.teamMemberForm.controls['logs_prv'].setValue(false);
      this.teamMemberForm.controls['teammembers_prv'].setValue(false);
      this.teamMemberForm.controls['cannedmessage_prv'].setValue(false);
      this.teamMemberForm.controls['api_prv'].setValue(false);
      this.teamMemberForm.controls['bouncedmail_prv'].setValue(false);
      this.teamMemberForm.controls['marketing_tool_prv'].setValue(false);
      this.disablebuttonFun([]);
    } else {
      this.selectsArray = [];
      // this.teamMemberForm.controls['dashboard'].setValue(true);
      this.teamMemberForm.controls['students'].setValue(true);
      this.teamMemberForm.controls['certificate'].setValue(true);
      this.teamMemberForm.controls['issue_certificate'].setValue(true);
      this.teamMemberForm.controls['account_settings'].setValue(true);
      this.teamMemberForm.controls['change_password'].setValue(true);
      this.teamMemberForm.controls['allow_search'].setValue(true);
      this.teamMemberForm.controls['course'].setValue(true);
      this.teamMemberForm.controls['logs_prv'].setValue(true);
      this.teamMemberForm.controls['teammembers_prv'].setValue(true);
      this.teamMemberForm.controls['cannedmessage_prv'].setValue(true);
      if (this.apiService.user.profile_details.allow_api) {
        this.teamMemberForm.controls['api_prv'].setValue(true);
      } else {
        this.teamMemberForm.controls['api_prv'].setValue(false);
      }
      this.teamMemberForm.controls['bouncedmail_prv'].setValue(true);
      this.teamMemberForm.controls['marketing_tool_prv'].setValue(true);
      const checkTotalCheckBox = this.apiService.user.profile_details.allow_api ? 13 : 12;
      for (let i = 1; i <= checkTotalCheckBox; i++) {
        this.selectsArray.push(i);
        if (i === checkTotalCheckBox) {
          this.disablebuttonFun(this.selectsArray);
        }
      }
    }
  }

  addOptions(index, val) {
    if (val === 'dropdown') {
      if (!this.teamMemberForm.controls['field_set'].value[index].hasOwnProperty('options')) {
        this.teamMemberForm.controls['field_set'].value[index]['options'] = [];
      }
      this.ngxSmartModalService.setModalData({ 'selectedIndex': index }, 'myModal');
      this.ngxSmartModalService.getModal('myModal').open();
      this.optionval.nativeElement.value = '';
    }
  }

  removeFieldSet(index, mem = '') {
    if (mem) {
      this.allcount = this.allcount - 1;
      this.fieldData.splice(index, 1);
    }
    const control = <FormArray>this.teamMemberForm.controls['field_set'];
    control.removeAt(index);
    //this.teamMemberForm.controls['field_set']['controls'].splice(index, 1);
  }

  addOptionsValues(index, value) {
    if (value && value.trim().length !== 0 && value !== '' && value !== null) {
      this.teamMemberForm.controls['field_set'].value[index]['options'].push({ 'key': value, 'label': value });
      this.optionval.nativeElement.value = '';
    }
  }
  removeOptions(i, j) {
    this.teamMemberForm.controls['field_set'].value[i]['options'].splice(j, 1);
  }

  addFields() {
    const control = <FormArray>this.teamMemberForm.controls['field_set'];
    control.push(this.initNqCoordinators());
  }

  removeFields(index) {
    if (index !== 0) {
      const control = <FormArray>this.teamMemberForm.controls['field_set'];
      control.removeAt(index);
    } else {
      const control = <FormArray>this.teamMemberForm.controls['field_set'];
      control.reset();
      const controllabel = <FormArray>this.teamMemberForm.controls['field_set'];
      controllabel.reset();
    }
  }

  getAllProductDetails(searchData?: any) {
    this.productService.getProductList(searchData).subscribe(data => {
      this.productList = data;
      if (this.apiService.userType === '3' || this.apiService.userType === '0') {
        this.teamMemberForm.controls['product_step'].setValidators([Validators.required]);
        this.teamMemberForm.controls['custom_template'].setValidators([Validators.required, this.noWhitespaceValidator]);
        this.teamMemberForm.controls['num_sub_products'].setValidators([Validators.required, this.noWhitespaceValidator, Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)]);
        this.teamMemberForm.updateValueAndValidity();
      }
    });
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
    if (this.selectstring !== '') {
      this.disablebutton = false;
      this.access_notify = false;
    } else {
      this.disablebutton = true;
      this.access_notify = true;
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submitForm(formData) {
    this.teamMemberForm.markAsTouched();
    var ers = '';
    this.disprimaryfield = false;
    this.disfield = false;
    if (formData.field_set.length > 0 && (this.apiService.userType === '3' || this.apiService.userType === '0')) {
      var i = 0;
      for (var k = 0; k < formData.field_set.length; k++) {
        formData.field_set[k].name = formData.field_set[k].label;
        // if (formData.field_set[k].type == '' && formData.field_set[k].label == '' || formData.field_set[k].placeholder == '' || formData.field_set[k].type == '' || formData.field_set[k].type == null || formData.field_set[k].value == '' || formData.field_set[k].value == null) {
        if (formData.field_set[k].type == '' && formData.field_set[k].label == '' || formData.field_set[k].placeholder == '' || formData.field_set[k].type == '' || formData.field_set[k].type == null) {
          ers = '2';
        }
        if (formData.field_set[k].type === 'dropdown' && formData.field_set[k].hasOwnProperty('options') && formData.field_set[k].options.length === 0) {
          ers = '2';
        }
        if (formData.field_set[k].primary) {
          i++;
          if (i > 2) {
            ers = '3';
          }
        }
      }
    } else {
      ers = '2';
    }
    if (ers == '2' && (this.apiService.userType === '3' || this.apiService.userType === '0')) {
      this.disfield = true;
      return false;
    } else {
      if (ers == '3') {
        this.errorMsg = 'provide_valid_inputs';
        this.disprimaryfield = true;
        return false;
      }
      this.disfield = false;
    }
    this.errorMsgArr = [];
    this.errorMsg = '';
    formData.activity_field_set = formData.activity_field_set ? formData.activity_field_set.toString() : '';
    if (this.teamMemberForm.valid) {
      if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null') {
        this.editTeamMember(formData, this.memberId);
      } else {
        this.addTeamMember(formData);
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  addTeamMember(formData) {
    this.process = true;
    this.teamService.addTeamMember(formData).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar(this.apiService.userType === '3' || this.apiService.userType === '0' ? 'workflow_added' : 'team_member_added', 'Close');
        if (this.workflowid) {
          this.router.navigate([`/workflow/${this.workflowid}`]);
        } else {
          this.router.navigate(['teamlist']);
        }
      },
      err => {
        this.process = false;
        if (err.error && err.error.non_field_errors) {
          this.errorMsg = err.error.non_field_errors[0];
        } else if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else if (err.status === 400) {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = (errArr.length !== 0) ? 'provide_valid_inputs' : err.error;
        } else {
          this.errorMsg = 'some_error_occurred';
        }
      }
    );
  }

  editTeamMember(formData, memberId) {
    this.process = true;
    this.teamService.editTeamMember(formData, memberId).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar(this.apiService.userType === '3' || this.apiService.userType === '0' ? 'workflow_edited' : 'team_member_edited', 'Close');
        this.router.navigate(['teamlist']);
      },
      err => {
        this.process = false;
        if (err.error && err.error.non_field_errors) {
          this.errorMsg = err.error.non_field_errors[0];
        } else if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else if (err.status === 400) {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = (errArr.length !== 0) ? 'provide_valid_inputs' : err.error;
        } else {
          this.errorMsg = 'some_error_occurred';
        }
      }
    );
  }

  getErrorMsg(field) {
    if (field === 'phone') {
      return this.teamMemberForm.controls[field].hasError('pattern') ? 'enter_valid_phonenumber' : '';
    } else if (field === 'num_sub_products') {
      return this.teamMemberForm.controls[field].hasError('required')
        || this.teamMemberForm.controls[field].hasError('whitespace') ? 'enter_a_value' : this.teamMemberForm.controls[field].hasError('pattern') ? 'enter_only_number' : '';
    } else if (field === 'product_assigned') {
      return this.teamMemberForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    } else if (field === 'team_member_mail_id') {
      return this.teamMemberForm.controls['team_member_mail_id'].hasError('required') ? 'please_select_mail_content' : '';
    } else {
      return this.teamMemberForm.controls[field].hasError('required')
        || this.teamMemberForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
        this.teamMemberForm.controls[field].hasError('email') ? 'not_valid_email' : '';
    }
  }

  uploadFile(e) {
    this.errorMsg = '';
    this.errorMsgArr['avatar'] = '';
    this.profilePic = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.profilePic.append('file', file, file.name);
        this.profilePic.append('user', this.apiService.user.id);
        this.apiService.uploadFile(this.profilePic).subscribe(
          data => {
            this.teamModel.avatar = data['file_url'];
            this.teamMemberForm.controls['avatar'].setValue(data['file_url']);
            this.profilePic = new FormData();
          },
          err => {
            this.common.openSnackBar('error_in_file_upload', 'Close');
          }
        );
      } else {
        this.teamModel.avatar = '';
        this.errorMsgArr['avatar'] = 'file_size_more';
      }
    } else {
      this.teamModel.avatar = '';
      this.errorMsgArr['avatar'] = 'invalid_file_type';
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
        this.errorMsgArr['university_avatar'] = 'file_size_more';
      }
    } else {
      this.teamModel.university_avatar = '';
      this.errorMsgArr['university_avatar'] = 'invalid_file_type';
    }
  }
}
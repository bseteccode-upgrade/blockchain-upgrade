/*
 * File : workflowcreate.component.ts
 * Use: create and edit functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { TeamService } from '../../service/team.service';
import { CommonService } from '../../service/common.service';
import { ProductService } from '../../product/services/product.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { map, startWith } from 'rxjs/operators';
import { DomSanitizer, DOCUMENT } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-workflowcreate',
  templateUrl: './workflowcreate.component.html',
  styleUrls: ['./workflowcreate.component.css']
})
export class WorkflowcreateComponent implements OnInit {

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
  disOutBoxError: any = false;
  access_notify = true;
  process = false;
  productList: any;
  profilePic = new FormData();
  orgPic = new FormData();
  statuslists: any = [{ 'value': true, 'text': 'active' }, { 'value': false, 'text': 'in_active' }];
  teamModel: any = {
    'first_name': '',
    // 'parent_email': '',
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
    'show_role': true,
    'graphic_show_role': true,
    // 'num_sub_products': '',
    'isDisableField': false,
    'notification_fields': [],
    'datetimeplace': 1,
    'show_product': false,
    'step_content': '',
    'box_title': '',
    'show_transaction': true,
    'show_inoutbatch': true,
    'show_transaction_checkbox': false
  };
  dateTypes = [
    { index: 1, val: 'any_date' },
    { index: 2, val: 'past_date' },
    { index: 3, val: 'current_date' },
    { index: 4, val: 'future_date' }
  ];

  dateTypesTimeStamp = [
    { index: 1, val: 'any_date' },
    { index: 2, val: 'past_date' },
    { index: 3, val: 'current_date' },
    { index: 4, val: 'future_date' }
  ];

  dateFormats = [
    { index: 1, val: 'mm/dd/yy' },
    { index: 2, val: 'dd/mm/yy' }
  ];

  timestampFormats = [
    { index: 1, val: 'mm/dd/yy hh:mm' },
    { index: 2, val: 'dd/mm/yy hh:mm' }
  ];
  dateDisplayPlaceListFormats = [
    { index: 1, val: 'in_box' },
    { index: 2, val: 'out_box' },
    { index: 3, val: 'dont_show' },
    { index: 4, val: 'both_in_and_out' },
  ];
  printData = [
    'any_date', 'past_date', 'current_date', 'future_date'
  ];

  dateformatData = [
    'mm/dd/yy', 'dd/mm/yy'
  ];

  timestampformatData = [
    'mm/dd/yy hh:mm', 'dd/mm/yy hh:mm'
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
    'text', 'number', 'date', 'dropdown', 'location', 'document', 'timestamp', 'productimage'
  ];
  stepLists: any;
  dispProdMand = false;
  @ViewChild('optionval') optionval: ElementRef;

  reswfuserdata: any;
  wfuserlists: any = [];
  groupnameinput: any = '';
  search: any;
  options: any = [];
  filteredOptions: any = [];
  myControl = new FormControl();
  resParentdata: any;
  parentUserList: any = [];
  resGraphData: any;
  graphLists: any = [];
  previousOutBatchCount: any;
  parentEmailConv: any;
  resWFData: any = {
    'show_transaction_checkbox': false
  };
  show_transaction_checkbox: any = false;
  isNext = false;
  isPrev = false;
  wfRedirectData: any = [];
  allfieldlist: any = [];
  @ViewChild('workflowFormGen') workflowFormGen: FormGroupDirective;
  currentStepDetailsRes: any = [];
  allSteps: any = [];
  sltStepFieldList: any = [];
  selectedField: any = [];
  selectFieldDetailsList: any = [];

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
    uploadUrl: env.url + 'files/new/upload/',
    sanitize: false,
    toolbarPosition: 'top'
  };
  constructor(
    private formbuilder: FormBuilder,
    public apiService: ApiService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    public common: CommonService,
    private router: Router,
    private productService: ProductService,
    public ngxSmartModalService: NgxSmartModalService,
    @Inject(DOCUMENT) private document: HTMLDocument,
  ) {
    this.memberId = this.route.snapshot.paramMap.get('id');
    this.workflowstep = this.route.snapshot.paramMap.get('step');
    this.workflowid = this.route.snapshot.paramMap.get('userid');
    this.createForm();
    if (this.apiService.userType === '3' || this.apiService.userType === '0') {
      this.teamMemberForm.controls['product_step'].setValidators([Validators.required]);
      this.teamMemberForm.controls['custom_template'].setValidators([Validators.required, this.noWhitespaceValidator]);
      this.teamMemberForm.updateValueAndValidity();
    }

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(group_name => group_name ? this._filter(group_name) : this.options.slice())
      );
  }

  private _filter(val) {
    return this.options.filter(option => option.email.toLowerCase().indexOf(val) === 0);
  }
  /**
   * Get parent mail details
   */
  getParentNodeEmail() {
    this.productService.getParentEmail(this.workflowid && this.workflowid != null ? this.workflowid : this.teamModel.workflow_db_id, this.workflowstep && this.workflowstep != null ? this.workflowstep : this.teamModel.product_step).subscribe(data => {
      this.resParentdata = data;
      if (this.resParentdata.status === true) {
        this.isNext = this.resParentdata.next_step_but;
        this.isPrev = this.resParentdata.previouw_step_but;
        this.parentUserList = this.resParentdata.users;
        const parentEmaillist = [];
        if (this.parentUserList.length > 1) {
          this.previousOutBatchCount = this.resParentdata.count;
          // for parent mail address array convertion
          const control = <FormArray>this.teamMemberForm.controls['email'];
          for (let i = 0; i < 1; i++) {
            if (this.teamModel.email != 0) {
              control.push(this.selectmembermail(this.teamModel.email[0].email));
            } else {
              control.push(this.selectmembermail());
            }
          }
        } else {
          this.previousOutBatchCount = 1;
          const control = <FormArray>this.teamMemberForm.controls['email'];
          if (this.teamModel.email != 0) {
            control.push(this.selectmembermail(this.teamModel.email[0].email));
          } else {
            control.push(this.selectmembermail());
          }
        }
      }
    });
  }
  /**
   * Get memberlist for autocomplete search
   */
  getworkflowuserlist() {
    this.productService.getwfuseronly(this.workflowid && this.workflowid != null ? this.workflowid : this.teamModel.workflow_db_id, this.workflowstep && this.workflowstep != null ? this.workflowstep : this.teamModel.product_step).subscribe(data => {
      this.reswfuserdata = data;
      if (this.reswfuserdata.length != 0) {
        this.options = this.reswfuserdata;
        this.wfuserlists = this.reswfuserdata;
      }
    });
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    if (item.organization != null) {
      return item.first_name.toLocaleLowerCase().indexOf(term) > -1 ||
        item.last_name.toLocaleLowerCase().indexOf(term) > -1 ||
        item.organization.toLocaleLowerCase().indexOf(term) > -1;
    } else {
      return item.first_name.toLocaleLowerCase().indexOf(term) > -1 ||
        item.last_name.toLocaleLowerCase().indexOf(term) > -1;
    }
  }

  getinputgroupname(inputVal) {
    this.groupnameinput = inputVal;
  }

  getAllWorflowFields() {
    this.productService.getAllStepFields(this.workflowid).subscribe(data => {
      this.allfieldlist = data;
    }, err => {
      console.log(err);
    });
  }

  ngOnInit() {
    this.getAllWorflowFields();
    if (this.workflowstep != 1) {
      this.productService.getAllStepDetails(this.workflowid, this.workflowstep).subscribe(data => {
        this.allSteps = data;
        setTimeout(() => {
          this.selectStep(this.allSteps[0].id);
          this.show_transaction_checkbox = this.allSteps[0].show_transaction_checkbox;
        }, 500);
      }, err => {
        console.log(err);
      });
    }
    if (this.workflowid && this.workflowstep) {
      this.productService.getWorkFlowStepDetails(this.workflowid, this.workflowstep).subscribe(data => {
        this.currentStepDetailsRes = data;
        console.log(this.currentStepDetailsRes);
        this.show_transaction_checkbox = this.currentStepDetailsRes.show_transaction_checkbox;
        this.workflowrole = this.currentStepDetailsRes.role;
        this.workflowname = this.currentStepDetailsRes.workflow_id;
      }, err => {
        this.router.navigate([`/workflow/${this.workflowid}`]);
      });
    }
    if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null') {
      this.teamService.getWFTeamMember(this.workflowid && this.workflowid != null ? this.workflowid : this.teamModel.workflow_db_id, this.workflowstep && this.workflowstep != null ? this.workflowstep : this.teamModel.product_step).subscribe(data => {
        this.resWFData = data;
        this.show_transaction_checkbox = this.resWFData.show_transaction_checkbox;
        this.teamModel = this.resWFData.current_content;
        this.createForm();
        this.selectsArray = [
          this.teamModel.students === true ? 1 : '',
          this.teamModel.certificate === true ? 1 : '',
          this.teamModel.issue_certificate === true ? 1 : '',
          this.teamModel.account_settings === true ? 1 : '',
          this.teamModel.add_product === true ? 1 : '',
          this.teamModel.change_password === true ? 1 : '',
          this.teamModel.allow_search === true ? 1 : '',
          this.teamModel.course === true ? 1 : ''
        ];
        const filtered = this.selectsArray.filter(function (el) {
          return el != null;
        });
        const control = <FormArray>this.teamMemberForm.controls['field_set'];
        const rdata = this.teamModel.field_set;
        for (var j = 0; j < rdata.length; j++) {
          var optvaluedata = [];
          if (rdata[j].type == 'dropdown') {
            var optdata = [];
            if (rdata[j].options) {
              optdata = rdata[j].options;
            }
            if (optdata.length > 0) {
              for (var l = 0; l < optdata.length; l++) {
                optvaluedata.push({ 'key': optdata[l].key, 'label': optdata[l].key });
              }
            }
          }
          if (optvaluedata.length > 0) {
            if (rdata[j].type != 'lnglat')
              control.push(this.initNqCoordinators(rdata[j].label, rdata[j].type, rdata[j].name, rdata[j].placeholder, rdata[j].required, rdata[j].show, optvaluedata, rdata[j].primary, rdata[j].save, rdata[j].enable_furture, rdata[j].dateformat, rdata[j].in_box, rdata[j].out_box, rdata[j].automatic, rdata[j].is_map_it, rdata[j].is_lock_it, rdata[j].field_id));
          } else {
            if (rdata[j].type != 'lnglat')
              control.push(this.initNqCoordinators(rdata[j].label, rdata[j].type, rdata[j].name, rdata[j].placeholder, rdata[j].required, rdata[j].show, [], rdata[j].primary, rdata[j].save, rdata[j].enable_furture, rdata[j].dateformat, rdata[j].in_box, rdata[j].out_box, rdata[j].automatic, rdata[j].is_map_it, rdata[j].is_lock_it, rdata[j].field_id));
          }
        }
        this.preSelectMember(this.teamModel.notification_fields);
        this.fieldData = this.teamModel.field_set;
        this.allcount = this.teamModel.field_set.length;
        if (this.apiService.userType === '3' || this.apiService.userType === '0') {
          this.teamMemberForm.controls['product_step'].setValidators([Validators.required]);
          this.teamMemberForm.controls['custom_template'].setValidators([Validators.required, this.noWhitespaceValidator]);
          // this.teamMemberForm.controls['num_sub_products'].setValidators([Validators.required, this.noWhitespaceValidator, Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)]);
        }
        // this.teamModel.isDisableField = this.resWFData.next_step_exist && this.resWFData.email_sent ? true : false;
        this.teamModel.isDisableField = this.resWFData.next_step_exist;
        this.teamMemberForm.updateValueAndValidity();
        this.getworkflowuserlist();
        this.getAllProductDetails();
        this.getParentNodeEmail();
        // this.getGraphNode();
      }, err => {
        // this.router.navigate(['teamlist']);
        // this.common.openSnackBar('Invalid member id', 'Close');
      });
    } else {
      // this.createForm();
    }
    // this.getAllStepLists();
    this.stepLists = Array(100).fill(0);

    // this.teamMemberForm.controls['is_final_step'].valueChanges.subscribe(checked => {
    //   if (checked) {
    //     this.teamMemberForm.controls['product_assigned'].setValidators([Validators.required]);
    //     this.teamMemberForm.updateValueAndValidity();
    //   } else {
    //     this.teamMemberForm.controls['product_assigned'].setValidators(null);
    //     this.teamMemberForm.updateValueAndValidity();
    //   }
    // });
  }

  selectStep(stepId) {
    jQuery('.wfClassAddLi').removeClass('highlight');
    jQuery('#' + stepId).addClass('highlight');
    const selIndivArr = this.allSteps.find(x => x.id === stepId);
    const arrIndexSelect = this.allSteps.indexOf(selIndivArr);
    this.sltStepFieldList = this.allSteps[arrIndexSelect].fieldset;
  }

  selectField(selectField) {
    if (this.selectedField === [] || !this.selectedField.includes(selectField)) {
      console.log(selectField);
      jQuery('#' + selectField).addClass('highlight');
      this.selectedField.push(selectField);
      const selectMemIndex = this.allfieldlist.find(x => x.field_id === selectField);
      const arrMemberIndex = this.allfieldlist.indexOf(selectMemIndex);
      this.selectFieldDetailsList.push(this.allfieldlist[arrMemberIndex]);
      this.teamMemberForm.controls['notification_fields'].setValue(this.selectedField);
    }
  }

  deleteField(selectField) {
    console.log(selectField);
    const originalArrSelectMem = this.selectedField;
    jQuery('#' + selectField).removeClass('highlight');
    const finalArr = originalArrSelectMem.find(x => x === selectField);
    const findMemberIndex = originalArrSelectMem.indexOf(finalArr);
    originalArrSelectMem.splice(findMemberIndex, 1);
    console.log(this.selectFieldDetailsList);
    const selectDeletedMem = this.selectFieldDetailsList.find(x => x.field_id === selectField);
    const findDeleteMemberIndex = this.selectFieldDetailsList.indexOf(selectDeletedMem);
    console.log(findDeleteMemberIndex);
    this.selectFieldDetailsList.splice(findDeleteMemberIndex, 1);

    this.selectedField = originalArrSelectMem;
    this.teamMemberForm.controls['notification_fields'].setValue(this.selectedField);
  }

  preSelectMember(fields: any) {
    let i;
    const newArrSelectedMember = [];
    console.log(fields);
    for (i = 0; i < fields.length; i++) {
      newArrSelectedMember.push(fields[i]);
      const selectMemIndex = this.allfieldlist.find(data => data.field_id === fields[i]);
      const arrMemberIndex = this.allfieldlist.indexOf(selectMemIndex);
      this.selectFieldDetailsList.push(this.allfieldlist[arrMemberIndex]);
      if (i === fields.length - 1) {
        this.teamMemberForm.controls['notification_fields'].setValue(newArrSelectedMember);
        this.selectedField = newArrSelectedMember;
      }
    }
  }

  RequireMatch(control: AbstractControl) {
    const selection: any = control.value;
    if (typeof selection === 'string') {
      return { incorrect: true };
    }
    return null;
  }

  createForm() {
    if (this.memberId && this.memberId !== 'undefined' && this.memberId !== 'null') {
      this.teamMemberForm = this.formbuilder.group({
        // 'workflow_user': [this.teamModel.email, Validators.compose([Validators.required, this.RequireMatch])],
        // 'parent_email': [this.teamModel.parent_email],
        // 'first_name': [this.teamModel.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        // 'last_name': [this.teamModel.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        // 'email': [this.teamModel.email, Validators.compose([Validators.required])],
        'email': this.formbuilder.array([]),
        // 'phone': [this.teamModel.phone, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
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
        // 'university_avatar': [this.teamModel.university_avatar],
        // 'organization': [this.teamModel.organization],
        'custom_template': [this.workflowrole && this.workflowrole != null ? this.workflowrole : this.teamModel.custom_template],
        'product_assigned': [this.teamModel.product_assigned],
        'product_step': [this.workflowstep ? this.workflowstep : this.teamModel.product_step],
        'is_final_step': [this.teamModel.is_final_step],
        'fields_select': [null],
        'activity_field_set': [this.teamModel.activity_field_set ? this.teamModel.activity_field_set.split(',') : []],
        'field_set': this.formbuilder.array([]),
        // 'num_sub_products': [this.teamModel.num_sub_products],
        'show_role': [this.teamModel.show_role],
        'graphic_show_role': [this.teamModel.graphic_show_role],
        'notification_fields': [this.teamModel.notification_fields],
        'datetimeplace': [this.teamModel.datetimeplace],
        'show_product': [this.teamModel.show_product],
        'step_content': [this.teamModel.step_content],
        'box_title': [this.teamModel.box_title],
        'show_transaction': [this.teamModel.show_transaction],
        'show_inoutbatch': [this.teamModel.show_inoutbatch]
      });
      this.access_notify = false;
      this.disablebutton = false;
    } else {
      this.teamMemberForm = this.formbuilder.group({
        // 'workflow_user': [this.teamModel.email, Validators.compose([Validators.required])],
        // 'parent_email': [this.teamModel.parent_email],
        // 'first_name': [this.teamModel.first_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        // 'last_name': [this.teamModel.last_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        // 'email': [this.teamModel.email, Validators.compose([Validators.required])],
        'email': this.formbuilder.array([]),
        // 'phone': [this.teamModel.phone, Validators.compose([Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)])],
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
        // 'university_avatar': [this.teamModel.university_avatar],
        // 'organization': [this.teamModel.organization],
        'custom_template': [this.workflowrole && this.workflowrole != null ? this.workflowrole : this.teamModel.custom_template],
        'product_assigned': [this.teamModel.product_assigned],
        'product_step': [this.workflowstep ? this.workflowstep : this.teamModel.product_step],
        'is_final_step': [this.teamModel.is_final_step],
        'fields_select': [null],
        'activity_field_set': [this.teamModel.activity_field_set ? this.teamModel.activity_field_set.split(',') : []],
        'field_set': this.formbuilder.array([this.initNqCoordinators('', '', '', '', false, false, [], false, false, false, false, true, false, false, true, false, '')]),
        // 'num_sub_products': [this.teamModel.num_sub_products],
        'show_role': [this.teamModel.show_role],
        'graphic_show_role': [this.teamModel.graphic_show_role],
        'notification_fields': [this.teamModel.notification_fields],
        'datetimeplace': [this.teamModel.datetimeplace],
        'show_product': [this.teamModel.show_product],
        'step_content': [this.teamModel.step_content],
        'box_title': [this.teamModel.box_title],
        'show_transaction': [this.teamModel.show_transaction],
        'show_inoutbatch': [this.teamModel.show_inoutbatch]
      });
      this.getworkflowuserlist();
      this.getAllProductDetails();
      this.getParentNodeEmail();
      // this.getGraphNode();
    }

  }
  /**
   * Using for select member save and prepopulate
   */
  selectmembermail(mail = '') {
    return this.formbuilder.group({
      'mail': [mail],
    });
  }

  initNqCoordinators(label = '', type = '', name = '', placeholder = '', req = false, show = false, options = [], primary = false, save = false, enable_furture = false, dateformat = false, in_box = true, out_box = false, automatic = false, is_map_it = true, is_lock_it = false, field_id = '') {
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
      'enable_furture': [enable_furture],
      'dateformat': [dateformat],
      'in_box': [in_box],
      'out_box': [out_box],
      'automatic': [automatic],
      'is_map_it': [is_map_it],
      'is_lock_it': [is_lock_it],
      'field_id': [field_id]
    });
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

  displayTypeField(fieldRow) {
    const idname = this.document.getElementById('fieldDisplay' + fieldRow);
    idname.style.display = 'block';
    const labelName = this.document.getElementById('fieldlabel' + fieldRow);
    labelName.style.display = 'none';
  }

  removeFieldSet(index, mem = '') {
    if (mem) {
      this.allcount = this.allcount - 1;
      this.fieldData.splice(index, 1);
    }
    const control = <FormArray>this.teamMemberForm.controls['field_set'];
    control.removeAt(index);
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
        // this.teamMemberForm.controls['num_sub_products'].setValidators([Validators.required, this.noWhitespaceValidator, Validators.pattern(/^[\+\d]?(?:[\d.\s()]*)$/)]);
        this.teamMemberForm.updateValueAndValidity();
      }
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submitForm(formData) {
    this.errorMsgArr = [];
    this.teamMemberForm.markAsTouched();
    var ers = '';
    this.disprimaryfield = false;
    this.disOutBoxError = false;
    this.disfield = false;
    if (formData.field_set.length > 0) {
      var i = 0;
      var j = 0;
      for (var k = 0; k < formData.field_set.length; k++) {
        formData.field_set[k].name = (formData.field_set[k].label).replace(/ /g, '_');
        formData.field_set[k].placeholder = formData.field_set[k].placeholder != '' ? formData.field_set[k].placeholder : formData.field_set[k].label;
        if (formData.field_set[k].type == '' && formData.field_set[k].label == '' || formData.field_set[k].type == '' || formData.field_set[k].type == null) {
          ers = '2';
        }
        if (formData.field_set[k].type === 'dropdown' && formData.field_set[k].hasOwnProperty('options') && formData.field_set[k].options.length === 0) {
          ers = '2';
        }
        if (formData.field_set[k].type === 'location') {
          if (!formData.field_set[k].automatic) {
            formData.field_set[k].is_lock_it = false;
          }
        }
        if (formData.field_set[k].type === 'productimage') {
          formData.field_set[k].is_description = true;
        } else {
          formData.field_set[k].is_description = false;
        }
        if (formData.field_set[k].primary) {
          i++;
          if (i > 2) {
            ers = '3';
          }
        }
        if (formData.field_set[k].out_box) {
          j++;
          if (j > 2) {
            ers = '4';
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
      } else if (ers == '4') {
        this.errorMsg = 'provide_valid_inputs';
        this.disOutBoxError = true;
        return false;
      }
      this.disfield = false;
    }
    // Multi mail link based validation and error msg display
    const emailCount = formData.email.reduce(function (count, row) {
      if (row.mail.length === 0) {
        return false;
      }
      return count + row.mail.length;
    }, 0);
    if (emailCount) {
      // if (formData.num_sub_products === '') {
      //   this.errorMsgArr['num_sub_products'] = 'enter_a_value';
      //   this.errorMsg = 'provide_valid_inputs';
      //   return false;
      // }
      if (emailCount === 0) {
        this.errorMsgArr['email'] = 'enter_a_value';
        this.errorMsg = 'provide_valid_inputs';
        return false;
      } else if (emailCount > 0) {
        // const findCount = formData.num_sub_products > this.previousOutBatchCount ? formData.num_sub_products : this.previousOutBatchCount;
        // if (formData.num_sub_products < this.previousOutBatchCount) {
        //   this.errorMsgArr['email'] = this.workflowstep == 1 ? 'please_select_email_based_on_outbatch' : 'please_select_email_based_on_parent';
        //   this.errorMsg = 'provide_valid_inputs';
        //   return false;
        // }
        if (this.workflowstep == 1 && emailCount > 1) {
          this.errorMsgArr['email'] = 'only_one_mail_address';
          this.errorMsg = 'provide_valid_inputs';
          return false;
        } else {

        }
        // if (emailCount != findCount) {
        //   this.errorMsgArr['email'] = this.workflowstep == 1 ? 'please_select_email_based_on_outbatch' : 'please_select_email_based_on_parent';
        //   this.errorMsg = 'provide_valid_inputs';
        //   return false;
        // }
      }
    } else {
      this.errorMsgArr['email'] = 'enter_a_value';
      this.errorMsg = 'provide_valid_inputs';
      return false;
    }
    this.errorMsgArr = [];
    this.errorMsg = '';
    formData.show_product = formData.is_final_step ? true : formData.show_product;
    formData.activity_field_set = formData.activity_field_set ? formData.activity_field_set.toString() : '';
    formData.workflow_id = this.workflowid;
    // formData.parent_email = this.parentEmailConv;
    if (this.teamMemberForm.valid) {
      this.editTeamMember(formData);
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  editTeamMember(formData) {
    this.process = true;
    this.teamService.editWFMember(formData).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('workflow_edited', 'Close');
        this.redirectTOWorkflow();
        // if (this.workflowid) {
        //   this.router.navigate([`/workflow/${this.workflowid}`]);
        // } else {
        //   this.router.navigate(['workflowlist']);
        // }
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else if (err.status === 400) {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              if (key === 'email') {
                this.errorMsgArr[key] = err.error[key];
              } else {
                this.errorMsgArr[key] = err.error[key][0];
              }
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
    } else if (field === 'product_assigned') {
      return this.teamMemberForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    } else {
      return this.teamMemberForm.controls[field].hasError('required')
        || this.teamMemberForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    }
    // else if (field === 'num_sub_products') {
    //   return this.teamMemberForm.controls[field].hasError('required')
    //     || this.teamMemberForm.controls[field].hasError('whitespace') ? 'enter_a_value' : this.teamMemberForm.controls[field].hasError('pattern') ? 'enter_only_number' : '';
    // }
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

  redirectTOWorkflow() {
    if (this.wfRedirectData.length !== 0) {
      this.router.navigateByUrl('/workflow', { skipLocationChange: true }).then(() =>
        this.router.navigate([`/workflowcreate/${this.wfRedirectData.profile_id}/${this.wfRedirectData.worflow_db_id}/${this.wfRedirectData.step}`]));
    } else {
      if (this.workflowid) {
        this.router.navigate([`/workflow/${this.workflowid}`]);
      } else {
        this.router.navigate(['workflowlist']);
      }
    }
  }

  onlySave() {
    this.wfRedirectData = [];
    this.workflowFormGen.ngSubmit.emit();
  }

  onPreviousStep(wfdata) {
    this.wfRedirectData = wfdata;
    this.redirectTOWorkflow();
    // this.workflowFormGen.ngSubmit.emit();
  }

  onNextStep(wfdata) {
    this.wfRedirectData = wfdata;
    this.workflowFormGen.ngSubmit.emit();
  }
}

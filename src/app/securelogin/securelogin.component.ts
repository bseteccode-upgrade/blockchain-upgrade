import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { CommonService } from '../service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment as env } from '../../environments/environment';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-securelogin',
  templateUrl: './securelogin.component.html',
  styleUrls: ['./securelogin.component.css']
})
export class SecureloginComponent implements OnInit {

  appName = env.project_name;
  siteName = env.project_site;
  loginForm: FormGroup; // initailaize
  errorMsg: string;
  pagelogo = env.white_logo;
  orgID: any;
  resLogoUrl: any;
  baseUrl = env.baseUrl;
  disableReg = false;
  resLoginData: any;
  verifyId: any;
  verifyResData: any;
  getReturnData: any;
  initialUserType = '2';
  qr_code: any = '';
  option: any = '';
  register_list = {
    '0': 'sc_sub_admin',
    '1': 'student',
    '2': 'publisher_signup',
    '3': 'supply chain',
    '4': 'team member',
    '5': 'supply chain team member',
    '6': 'translator',
    '7': 'super user',
    '8': 'API',
    '9': 'reviewer'
  };
  fromAdmin = false;
  token: any;
  regtype: any;
  constructor(
    public formbuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public common: CommonService,
    public ngxSmartModalService: NgxSmartModalService,
  ) {
    console.log(this.route.snapshot.paramMap.get('token'));
    this.token = this.route.snapshot.paramMap.get('token');
    this.regtype = this.route.snapshot.paramMap.get('regtype');
    this.clearLocalStorage();
    this.displayLogo();
  }

  ngOnInit() {
    this.userAutoLogin();
  }

  clearLocalStorage() {
    localStorage.removeItem('workflow_db_id');
    localStorage.removeItem('redirectwhichcert');
    localStorage.removeItem('redirectWhich');
    localStorage.removeItem('redirectFrom');
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
    localStorage.removeItem('searchworkflowid');
    localStorage.removeItem('searchoutbatchid');
    localStorage.removeItem('token');
  }

  displayLogo() {
    if (localStorage.getItem('stud_org_logo')) {
      this.pagelogo = localStorage.getItem('stud_org_logo');
    } else {
      this.pagelogo = env.white_logo;
    }
  }

  /**
   *@function onCheckWho
   *@description multiple user login, we used this function
   *@param userType user register type
   */
  onCheckWho(userType) {
    localStorage.setItem('user_reg_type', userType);
    // this.ngxSmartModalService.getModal('myModal').close();
    this.apiService.getUser();
    if (userType == '1') {
      this.apiService.shareUpdate(0).subscribe(
        returndata => { });
    }
  }

  userAutoLogin() {
    if (localStorage.getItem('token')) {
      this.apiService.getUser();
    } else {
      this.disableReg = true;
      this.apiService.showTooltip = true;
      localStorage.setItem('token', 'Token ' + this.token);
      this.apiService.getUserPub().subscribe(data => {
        this.getReturnData = data;
        this.onCheckWho(this.regtype);
        // if (this.getReturnData.register_list.length > 1) {
        //   this.ngxSmartModalService.setModalData(this.getReturnData.register_list, 'myModal');
        //   this.ngxSmartModalService.getModal('myModal').open();
        // } else {
        //   this.disableReg = false;
        //   localStorage.setItem('user_reg_type', this.getReturnData.register_list[0]);
        //   if (this.getReturnData.register_list[0] == '1') {
        //     this.apiService.shareUpdate(0).subscribe(
        //       returndata => { });
        //   }
        //   this.apiService.getUser();
        // }
      });
    }
  }

}

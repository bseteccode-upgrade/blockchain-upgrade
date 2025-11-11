import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../service/team.service';
import { ISlimScrollOptions } from '../../ngx-slimscroll/classes/slimscroll-options.class';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-createcompanyuser',
  templateUrl: './createcompanyuser.component.html',
  styleUrls: ['./createcompanyuser.component.css']
})
export class CreatecompanyuserComponent implements OnInit {
  options: ISlimScrollOptions;
  workflowId: any;
  workflowStep: any;
  cmpymemlist: any = [];
  rescmpymemlist: any = [];
  selectedMember: any = [];
  selectmemberDetailsList: any = [];
  balanceMemList: any = [];
  reassignForm: FormGroup;
  assignOutbatchForm: FormGroup;
  checkSubmit = false;
  outbatchSubmit = false;
  reassignErrorMsg = '';
  resPreselectMem: any = [];
  reassignMemberID: any;
  resSubmittedData: any;
  loading = false;
  errorMsg = false;
  no_member = false;
  blockmemberId = '';
  resOutbatchDetails: any;
  selectedMemberData: any;
  outbatchListData: any = [];
  resendMember: any;
  checkMailSubmit = false;
  resendErr: any = [];
  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    public ngxSmartModalService: NgxSmartModalService,
    public formbuilder: FormBuilder,
    public common: CommonService,
    private router: Router
  ) {
    this.workflowId = this.route.snapshot.paramMap.get('workflow_id');
    this.workflowStep = this.route.snapshot.paramMap.get('step');
    this.reassignForm = this.formbuilder.group({
      'reassign_member': [null, Validators.compose([Validators.required])],
    });

    this.assignOutbatchForm = this.formbuilder.group({
      'workflow_db_id': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.getWFUserListAssigned();
  }

  getCompanyMemberList() {
    this.teamService.getWFUserListAssigned(this.workflowId, this.workflowStep).subscribe(
      data => {
        this.resPreselectMem = data;
        if (this.resPreselectMem.length != 0) {
          if (this.resPreselectMem.members.length > 0) {
            this.loading = false;
            var i;
            for (i = 0; i < this.resPreselectMem.members.length; i++) {
              this.selectMember(this.resPreselectMem.members[i].id, this.resPreselectMem.members[i].activity_posted);
            }
          }
        } else {
          this.loading = false;
        }
      });
  }

  getWFUserListAssigned() {
    this.loading = true;
    this.teamService.getMemberList('page=1&list=all').subscribe(
      data => {
        this.balanceMemList = data;
        this.rescmpymemlist = data;
        if (this.rescmpymemlist.length > 0) {
          this.no_member = false;
          this.cmpymemlist = data;
          this.getCompanyMemberList();
        } else {
          this.loading = false;
          this.no_member = true;
        }
      });
  }

  selectMember(memberId, postedActvity = false, fromFrontEnd = false) {
    this.selectedMemberData = memberId;
    if (this.workflowStep == 1 || !fromFrontEnd) {
      if (this.selectedMember === [] || !this.selectedMember.includes(memberId)) {
        jQuery('#' + memberId).parent().addClass('highlight');
        this.selectedMember.push(memberId);
        const selectMemIndex = this.cmpymemlist.find(x => x.id === memberId);
        const arrMemberIndex = this.cmpymemlist.indexOf(selectMemIndex);
        this.cmpymemlist[arrMemberIndex].member_id = memberId;
        this.cmpymemlist[arrMemberIndex].blocked_or_reassigned = false;
        this.selectmemberDetailsList.push(this.cmpymemlist[arrMemberIndex]);
        var key = this.selectmemberDetailsList.length === 1 ? 0 : this.selectmemberDetailsList.length - 1;
        this.selectmemberDetailsList[key].activity_posted = postedActvity;

        // this.teamService.getOutbatchMemberList(this.workflowId, this.workflowStep == 1 ? 1 : this.workflowStep - 1).subscribe(
        //   data => {
        //     this.resOutbatchDetails = data;
        //     if (this.resOutbatchDetails.ststus) {
        //       this.outbatchListData = this.resOutbatchDetails.posted_activity;
        //       if (this.resOutbatchDetails.posted_activity.length > 1) {
        //         this.ngxSmartModalService.getModal('outbatchModal').open();
        //       } else {
        //         jQuery('#' + memberId).parent().addClass('highlight');
        //         this.selectedMember.push(memberId);
        //         const selectMemIndex = this.cmpymemlist.find(x => x.id === memberId);
        //         const arrMemberIndex = this.cmpymemlist.indexOf(selectMemIndex);
        //         this.cmpymemlist[arrMemberIndex].member_id = memberId;
        //         this.cmpymemlist[arrMemberIndex].blocked_or_reassigned = false;
        //         const selectOutbatchIndex = this.outbatchListData[0];
        //         console.log(selectOutbatchIndex);
        //         console.log(selectOutbatchIndex.product_certificate_id);
        //         this.cmpymemlist[arrMemberIndex].product_certificate_id = selectOutbatchIndex.product_certificate_id;
        //         this.cmpymemlist[arrMemberIndex].workflow_db_id = selectOutbatchIndex.workflow_db_id;
        //         this.selectmemberDetailsList.push(this.cmpymemlist[arrMemberIndex]);
        //         var key = this.selectmemberDetailsList.length === 1 ? 0 : this.selectmemberDetailsList.length - 1;
        //         this.selectmemberDetailsList[key].activity_posted = postedActvity;
        //         /**balance member - start */
        //         this.balanceMemList.splice(arrMemberIndex, 1);
        //         /**balance member - end */
        //       }
        //     }
        //   });

        /**balance member - start */
        this.balanceMemList.splice(arrMemberIndex, 1);
        /**balance member - end */
      }
    } else {
      if (fromFrontEnd) {
        this.teamService.getOutbatchMemberList(this.workflowId, this.workflowStep - 1).subscribe(
          data => {
            this.resOutbatchDetails = data;
            if (this.resOutbatchDetails.ststus) {
              this.outbatchListData = this.resOutbatchDetails.posted_activity;
              if (this.resOutbatchDetails.posted_activity.length > 1) {
                this.ngxSmartModalService.getModal('outbatchModal').open();
              } else {
                jQuery('#' + memberId).parent().addClass('highlight');
                this.selectedMember.push(memberId);
                const selectMemIndex = this.cmpymemlist.find(x => x.id === memberId);
                const arrMemberIndex = this.cmpymemlist.indexOf(selectMemIndex);
                this.cmpymemlist[arrMemberIndex].member_id = memberId;
                this.cmpymemlist[arrMemberIndex].blocked_or_reassigned = false;
                const selectOutbatchIndex = this.outbatchListData[0];
                console.log(selectOutbatchIndex);
                console.log(selectOutbatchIndex.product_certificate_id);
                this.cmpymemlist[arrMemberIndex].product_certificate_id = selectOutbatchIndex.product_certificate_id;
                this.cmpymemlist[arrMemberIndex].workflow_db_id = selectOutbatchIndex.workflow_db_id;
                this.selectmemberDetailsList.push(this.cmpymemlist[arrMemberIndex]);
                var key = this.selectmemberDetailsList.length === 1 ? 0 : this.selectmemberDetailsList.length - 1;
                this.selectmemberDetailsList[key].activity_posted = postedActvity;
                /**balance member - start */
                this.balanceMemList.splice(arrMemberIndex, 1);
                /**balance member - end */
              }
            }
          });
      }
    }
  }

  onResendMember(memberId) {
    this.resendMember = memberId;
    this.ngxSmartModalService.getModal('resenduser').open();
  }

  onConfirmResend() {
    console.log(this.resendMember);
    console.log(this.workflowId);
    console.log(this.workflowStep);
    this.checkMailSubmit = true;
    this.teamService.resendMailtoCMPMem({
      'workflow_id': this.workflowId,
      'step': this.workflowStep,
      'user_id': this.resendMember
    }).subscribe(
      data => {
        this.checkMailSubmit = false;
        const resData: any = data;
        if (resData.status) {
          this.common.openSnackBar(resData.msg, 'Close');
          this.ngxSmartModalService.getModal('resenduser').close();
        } else {
          this.common.openSnackBar(resData.msg, 'Close');
        }
      }, err => {
        this.checkMailSubmit = false;
        this.resendErr = err;
        console.log(this.resendErr.error.status);
        if (this.resendErr.error.status == "0") {
          this.common.openSnackBar(this.resendErr.error.msg, 'Close');
        } else {
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      });
  }

  onOutbatchSubmit(formData) {
    const selectOutbatchIndex = this.outbatchListData.find(x => x.out_batch_id == formData.workflow_db_id);
    this.selectedMember.push(this.selectedMemberData);
    const selectMemIndex = this.cmpymemlist.find(x => x.id === this.selectedMemberData);
    const arrMemberIndex = this.cmpymemlist.indexOf(selectMemIndex);
    this.cmpymemlist[arrMemberIndex].member_id = this.selectedMemberData;
    this.cmpymemlist[arrMemberIndex].blocked_or_reassigned = false;
    this.cmpymemlist[arrMemberIndex].product_certificate_id = selectOutbatchIndex.product_certificate_id;
    this.selectmemberDetailsList.push(this.cmpymemlist[arrMemberIndex]);
    var key = this.selectmemberDetailsList.length === 1 ? 0 : this.selectmemberDetailsList.length - 1;
    this.selectmemberDetailsList[key].activity_posted = false;
    this.selectmemberDetailsList[key].workflow_db_id = selectOutbatchIndex.workflow_db_id;
    this.balanceMemList.splice(arrMemberIndex, 1);
    this.ngxSmartModalService.getModal('outbatchModal').close();
  }

  preSelectMember(members: any) {
    let i;
    const newArrSelectedMember = [];
    for (i = 0; i < members.length; i++) {

      newArrSelectedMember.push(members[i]);
      const selectMemIndex = this.cmpymemlist.find(data => data.id === members[i]);
      const arrMemberIndex = this.cmpymemlist.indexOf(selectMemIndex);
      this.selectmemberDetailsList.push(this.cmpymemlist[arrMemberIndex]);
      if (i === members.length - 1) {
        this.selectedMember = newArrSelectedMember;
      }
    }
  }

  deleteMember(memberId, fromReassign = false) {
    this.blockmemberId = memberId;
    if (fromReassign) {
      this.onBlockMember(fromReassign);
    }
  }

  onBlockMember(fromReassign = false) {
    const originalArrSelectMem = this.selectedMember;
    const finalArr = originalArrSelectMem.find(x => x === this.blockmemberId);
    const findMemberIndex = originalArrSelectMem.indexOf(finalArr);
    originalArrSelectMem.splice(findMemberIndex, 1);

    const selectDeletedMem = this.selectmemberDetailsList.find(x => x.id === this.blockmemberId);
    const findDeleteMemberIndex = this.selectmemberDetailsList.indexOf(selectDeletedMem);
    this.balanceMemList.push(this.selectmemberDetailsList[findDeleteMemberIndex]); // balance users
    this.selectmemberDetailsList.splice(findDeleteMemberIndex, 1);
    this.selectedMember = originalArrSelectMem;
    this.saveSelectedMember(false);
    if (!fromReassign) {
      this.ngxSmartModalService.getModal('blockuser').close();
    }
  }

  saveSelectedMember(redirect = true) {
    this.errorMsg = false;
    if (this.selectmemberDetailsList.length > 0) {
      this.teamService.saveSelectedMem({
        'workflow_id': this.workflowId,
        'step': this.workflowStep,
        'members': this.selectmemberDetailsList
      }).subscribe(
        data => {
          this.resSubmittedData = data;
          if (this.resSubmittedData.status) {
            if (redirect) {
              this.common.openSnackBar(this.resSubmittedData.msg, 'Close');
              this.router.navigate([`/membersassign`]);
            }
          } else {
            this.common.openSnackBar(this.resSubmittedData.msg, 'Close');
          }
        }, err => {
          this.common.openSnackBar('some_error_occurred', 'Close');
        });
    } else {
      this.errorMsg = true;
    }
  }

  reassignMemberIDSelect(id) {
    this.reassignMemberID = id;
  }

  reassignSubmit(formdata) {
    this.checkSubmit = true;
    if (!this.reassignForm.invalid) {
      this.selectedMember.push(formdata.reassign_member);
      const selectMemIndex = this.cmpymemlist.find(x => x.id === formdata.reassign_member);
      const arrMemberIndex = this.cmpymemlist.indexOf(selectMemIndex);
      this.cmpymemlist[arrMemberIndex].member_id = formdata.reassign_member;
      this.cmpymemlist[arrMemberIndex].blocked_or_reassigned = formdata;
      this.cmpymemlist[arrMemberIndex].reassigned_by = this.reassignMemberID;
      this.selectmemberDetailsList.push(this.cmpymemlist[arrMemberIndex]);
      /**balance member - start */
      this.balanceMemList.splice(arrMemberIndex, 1);
      this.checkSubmit = false;
      this.deleteMember(this.reassignMemberID, true);
      this.ngxSmartModalService.getModal('myModal').close();
    } else {
      this.checkSubmit = false;
      this.reassignErrorMsg = 'error';
    }
  }

  getassignErrorMsg(field) {
    return this.reassignForm.controls[field].hasError('required') ? 'enter_a_value' : '';
  }

  getOutbatchErrorMsg(field) {
    return this.assignOutbatchForm.controls[field].hasError('required') ? 'enter_a_value' : '';
  }

}

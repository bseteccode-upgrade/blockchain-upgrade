import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../service/auth.guard';

import { AccountSettingComponent } from '../shared/account-setting/account-setting.component';
import { ChangePwdComponent } from '../shared/change-pwd/change-pwd.component';
import { TeamListComponent } from '../shared/team-list/team-list.component';
import { TeamComponent } from '../shared/team/team.component';
import { ProductCertificateComponent } from './product-certificate/product-certificate.component';
import { ProductCertificateAssignComponent } from './product-certificate-assign/product-certificate-assign.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductsComponent } from './products/products.component';
import { ViewactivityComponent } from './viewactivity/viewactivity.component';
import { ProductComponent } from './product.component';
import { UploadCertificateComponent } from './upload-certificate/upload-certificate.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { PaymentComponent } from '../shared/payment/payment.component';
import { DynamicAppComponent } from './dynamic-app/dynamic-app.component';
import { ReportComponent } from './report/report.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { NewgraphicComponent } from './newgraphic/newgraphic.component';
import { ReviewerlistComponent } from './reviewerlist/reviewerlist.component';
import { CreatereviewerComponent } from './createreviewer/createreviewer.component';
import { ReviewerdetailsComponent } from './reviewerdetails/reviewerdetails.component';
import { ProductlocComponent } from './productloc/productloc.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MembersComponent } from './members/members.component';
import { MembersFormComponent } from './members-form/members-form.component';
import { MemberassignstatusComponent } from './memberassignstatus/memberassignstatus.component';
import { MemberinboxComponent } from './memberinbox/memberinbox.component';
import { WorkflowlistComponent } from './workflowlist/workflowlist.component';
import { WorkflowcreateComponent } from './workflowcreate/workflowcreate.component';
import { ProactivityreportComponent } from './proactivityreport/proactivityreport.component';
import { ProactivitytraceComponent } from './proactivitytrace/proactivitytrace.component';
import { ProactivitytrackComponent } from './proactivitytrack/proactivitytrack.component';
import { DownloaddataComponent } from './downloaddata/downloaddata.component';
import { CreatecompanyuserComponent } from './createcompanyuser/createcompanyuser.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'product/dashboard', component: DashboardComponent },
      { path: 'members', component: MembersComponent },
      { path: 'membersassign', component: MemberassignstatusComponent },
      { path: 'createcompanyuser/:workflow_id/:step', component: CreatecompanyuserComponent },
      { path: 'membersinbox', component: MemberinboxComponent },
      { path: 'createmember', component: MembersFormComponent },
      { path: 'createmember/:id', component: MembersFormComponent },
      { path: 'accountsetting', component: AccountSettingComponent },
      { path: 'changepwd', component: ChangePwdComponent},
      { path: 'teamlist', component: TeamListComponent },
      { path: 'workflowlist', component: WorkflowlistComponent },
      { path: 'team', component: TeamComponent },
      { path: 'team/:id', component: TeamComponent },
      { path: 'team/:id/:wfname/:userid/:step/:role', component: TeamComponent },
      { path: 'product', component: ProductsComponent},
      { path: 'product/:id', component: ProductsComponent},
      { path: 'activity/:batchid', component: ViewactivityComponent},
      { path: 'activity/:wfid/:outbatch/:unikey/:step/:actid', component: DynamicAppComponent},
      { path: 'productlist', component: ProductListComponent},
      { path: 'productcertificate', component: ProductCertificateComponent},
      { path: 'productcertificateassign', component: ProductCertificateAssignComponent},
      { path: 'productcertificateassign/:id', component: ProductCertificateAssignComponent},
      // { path: 'upload', component: UploadCertificateComponent },
      { path: 'detail/:batchid', component: ProductDetailsComponent},
      { path: 'payment', component: PaymentComponent },
      { path: 'activity', component: DynamicAppComponent },
      { path: 'report/:id', component: ReportComponent },
      { path: 'workflow', component: WorkflowComponent },
      { path: 'newgraphic/:batchid', component: NewgraphicComponent },
      { path: 'workflow/:userid', component: WorkflowComponent },
      { path: 'reviewerlist', component: ReviewerlistComponent },
      { path: 'createreviewer', component: CreatereviewerComponent },
      { path: 'createreviewer/:userid', component: CreatereviewerComponent },
      { path: 'reviewerdetail', component: ReviewerdetailsComponent },
      { path: 'reviewerdetail/:id', component: ReviewerdetailsComponent },
      { path: 'reviewerdetail/:id/:wfname/:userid/:step/:role', component: ReviewerdetailsComponent },
      { path: 'productlocation/:id/:workflow', component: ProductlocComponent },
      { path: 'workflowcreate', component: WorkflowcreateComponent },
      { path: 'workflowcreate/:id', component: WorkflowcreateComponent },
      // { path: 'workflowcreate/:id/:wfname/:userid/:step/:role', component: WorkflowcreateComponent },
      { path: 'workflowcreate/:id/:userid/:step', component: WorkflowcreateComponent },
      { path: 'activityreport', component: ProactivityreportComponent },
      { path: 'activitytrace', component: ProactivitytraceComponent },
      { path: 'activitytrack', component: ProactivitytrackComponent },
      { path: 'downloadactivitydata', component: DownloaddataComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

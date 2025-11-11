import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IssuerComponent } from './issuer.component';
import { AccountSettingComponent } from '../shared/account-setting/account-setting.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { CertificateUploadComponent } from './certificate-upload/certificate-upload.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { StudentUploadComponent } from './student-upload/student-upload.component';
import { AuthGuard } from '../service/auth.guard';
import { ChangePwdComponent } from '../shared/change-pwd/change-pwd.component';
import { StudentsComponent } from './students/students.component';
import { NewAssignComponent } from './new-assign/new-assign.component';
import { BlockchainComponent } from './blockchain/blockchain.component';
import { TeamComponent } from '../shared/team/team.component';
import { CannedMessageComponent } from './canned-message/canned-message.component';
import { TeamListComponent } from '../shared/team-list/team-list.component';
import { PaymentComponent } from '../shared/payment/payment.component';
import { UsercoursesComponent } from './usercourses/usercourses.component';
import { LogsComponent } from './logs/logs.component';
import { FaqComponent } from './faq/faq.component';
import { MandrilComponent } from './mandril/mandril.component';
import { ExsitingstudentComponent } from './exsitingstudent/exsitingstudent.component';
import { AchievementExportComponent } from './achievement-export/achievement-export.component';
import { CustomFeatureComponent } from './custom-feature/custom-feature.component';
import { RequestComponent } from './request/request.component';
import { MultipleEmailComponent } from './multiple-email/multiple-email.component';
import { PlanapiComponent } from './planapi/planapi.component';

import { CourseFormComponent } from './course-form/course-form.component';
import { CertificateFormComponent } from './certificate-form/certificate-form.component';
import { ContractapiComponent } from './contractapi/contractapi.component';
import { CustomapiComponent } from './customapi/customapi.component';
import { SupplychainapiComponent } from './supplychainapi/supplychainapi.component';
import { SupplychainlogsComponent } from './supplychainlogs/supplychainlogs.component';
import { MatricgraphComponent } from './matricgraph/matricgraph.component';
import { CertcreationComponent } from './certcreation/certcreation.component';
import { StudentNewComponent } from './student-new/student-new.component';

import { EmailLogsComponent } from './email-logs/email-logs.component';
import { PubdashboardComponent } from './pubdashboard/pubdashboard.component';
import { NewCannedmessageComponent } from './new-cannedmessage/new-cannedmessage.component';
import { CannedaddeditComponent } from './cannedaddedit/cannedaddedit.component';
import { MarketingToolComponent } from './marketing-tool/marketing-tool.component';
import { MarketingToolAddEditComponent } from './marketing-tool-add-edit/marketing-tool-add-edit.component';

const issuer_routes: Routes = [
  {
    path: '',
    component: IssuerComponent,
    canActivate: [AuthGuard],
    children: [
      // { path: 'students', component: StudentsComponent },
      { path: 'students', component: StudentNewComponent },
      { path: 'accountsetting', component: AccountSettingComponent },
      { path: 'addstudent', component: AddStudentComponent },
      { path: 'addstudent/:id', component: AddStudentComponent },
      { path: 'certificateissuer', component: CertificateUploadComponent },
      { path: 'issuecertificate', component: BlockchainComponent },
      { path: 'issuecertificate/:email/:firstname/:lastname', component: BlockchainComponent },
      { path: 'usercourse', component: UsercoursesComponent },
      { path: 'usercertificate', component: CertificatesComponent },
      { path: 'bulkupload', component: StudentUploadComponent },
      { path: 'changepwd', component: ChangePwdComponent },
      { path: 'newassign', component: NewAssignComponent },
      { path: 'teamlist', component: TeamListComponent },
      { path: 'canned', component: CannedMessageComponent },
      { path: 'cannedlist', component: NewCannedmessageComponent },
      { path: 'add-canned', component: CannedaddeditComponent },
      { path: 'edit-canned/:id', component: CannedaddeditComponent },
      { path: 'team', component: TeamComponent },
      { path: 'team/:id', component: TeamComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'existingstudent', component: ExsitingstudentComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'mandril', component: MandrilComponent },
      { path: 'achievement-export', component: AchievementExportComponent },
      { path: 'custom-feature', component: CustomFeatureComponent },
      { path: 'request', component: RequestComponent },
      { path: 'multipleemail', component: MultipleEmailComponent },
      { path: 'courseadd', component: CourseFormComponent },
      { path: 'courseadd/:id', component: CourseFormComponent },
      { path: 'certificateadd', component: CertificateFormComponent },
      { path: 'certificateadd/:id', component: CertificateFormComponent },
      { path: 'customcertificate', component: CertcreationComponent },
      { path: 'customcertificateedit/:id', component: CertcreationComponent },
      { path: 'planapi', component: PlanapiComponent },
      { path: 'contractapi', component: ContractapiComponent },
      { path: 'customapi', component: CustomapiComponent },
      { path: 'supplychainapi', component: SupplychainapiComponent },
      { path: 'supplychainlogs', component: SupplychainlogsComponent },
      { path: 'matricgraph', component: MatricgraphComponent },
      { path: 'emaillogs', component: EmailLogsComponent },
      { path: 'publisherdash', component: PubdashboardComponent },
      { path: 'marketingtool', component: MarketingToolComponent },
      { path: 'marketingtool-addedit/:title/:id', component: MarketingToolAddEditComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(issuer_routes)
  ],
  exports: [
    RouterModule
  ]
})
export class IssuerRoutingModule { }

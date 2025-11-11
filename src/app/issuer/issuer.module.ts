import { NgModule } from '@angular/core';

import { ShareModule } from '../share.module';
import { IssuerComponent } from './issuer.component';
import { IssuerRoutingModule } from './issuer-routing.module';

import { AddStudentComponent } from './add-student/add-student.component';
import { CertificateUploadComponent } from './certificate-upload/certificate-upload.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { StudentUploadComponent } from './student-upload/student-upload.component';
import { CertificateService } from './services/certificate.service';
import { StudentsComponent } from './students/students.component';
import { StudentService } from './services/student.service';
import { NewAssignComponent } from './new-assign/new-assign.component';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from '../../slimscroll_api';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgSelectModule } from '@ng-select/ng-select';

import { BlockchainComponent } from './blockchain/blockchain.component';
import { UsercoursesComponent } from './usercourses/usercourses.component';
import { CannedMessageComponent } from './canned-message/canned-message.component';
import { LogsComponent } from './logs/logs.component';
import { ExsitingstudentComponent } from './exsitingstudent/exsitingstudent.component';
import { AchievementExportComponent } from './achievement-export/achievement-export.component';
import { CustomFeatureComponent } from './custom-feature/custom-feature.component';
import { MandrilComponent } from './mandril/mandril.component';
import { RequestComponent } from './request/request.component';
import { MultipleEmailComponent } from './multiple-email/multiple-email.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { CertificateFormComponent } from './certificate-form/certificate-form.component';

import { FileDropModule } from 'ngx-file-drop';
import { ZohopopupembaedComponent } from './zohopopupembaed/zohopopupembaed.component';
import { CommonplanalertComponent } from './commonplanalert/commonplanalert.component';
import { PlanapiComponent } from './planapi/planapi.component';
import { UserVerifyPopupComponent } from './user-verify-popup/user-verify-popup.component';
import { ContractapiComponent } from './contractapi/contractapi.component';
import { SwaggerComponent } from './swagger/swagger.component';
import { CustomapiComponent } from './customapi/customapi.component';
import { SupplychainapiComponent } from './supplychainapi/supplychainapi.component';
import { MatricgraphComponent } from './matricgraph/matricgraph.component';
import { ChartsModule } from 'ng2-charts';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DragulaModule } from 'ng2-dragula';
import { CertcreationComponent } from './certcreation/certcreation.component';
import { FaqComponent } from './faq/faq.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SupplychainlogsComponent } from './supplychainlogs/supplychainlogs.component';
import { StudentNewComponent } from './student-new/student-new.component';
import { PostConfirmationComponent } from './post-confirmation/post-confirmation.component';
import { EmailLogsComponent } from './email-logs/email-logs.component';
import { PubdashboardComponent } from './pubdashboard/pubdashboard.component';
import { NewCannedmessageComponent } from './new-cannedmessage/new-cannedmessage.component';
import { CannedaddeditComponent } from './cannedaddedit/cannedaddedit.component';
import { CanneddeleteComponent } from './canneddelete/canneddelete.component';

import { MarketingToolComponent } from './marketing-tool/marketing-tool.component';
import { MarketingToolAddEditComponent } from './marketing-tool-add-edit/marketing-tool-add-edit.component';
import { SkillsDialogComponent } from './skills-dialog/skills-dialog.component';
import { PreviewDetailsComponent } from './preview-details/preview-details.component';

@NgModule({
  declarations: [
    IssuerComponent,
    AddStudentComponent,
    CertificateUploadComponent,
    CertificatesComponent,
    StudentUploadComponent,
    StudentsComponent,
    NewAssignComponent,
    BlockchainComponent,
    UsercoursesComponent,
    CannedMessageComponent,
    LogsComponent,
    FaqComponent,
    ExsitingstudentComponent,
    AchievementExportComponent,
    CustomFeatureComponent,
    MandrilComponent,
    RequestComponent,
    MultipleEmailComponent,
    CourseFormComponent,
    CertificateFormComponent,
    ZohopopupembaedComponent,
    CommonplanalertComponent,
    PlanapiComponent,
    UserVerifyPopupComponent,
    ContractapiComponent,
    SwaggerComponent,
    CustomapiComponent,
    SupplychainapiComponent,
    MatricgraphComponent,
    CertcreationComponent,
    FaqComponent,
    SupplychainlogsComponent,
    StudentNewComponent,
    PostConfirmationComponent,
    CanneddeleteComponent,
    EmailLogsComponent,
    PubdashboardComponent,
    NewCannedmessageComponent,
    CannedaddeditComponent,
    CanneddeleteComponent,
    MarketingToolComponent,
    MarketingToolAddEditComponent,
    SkillsDialogComponent,
    PreviewDetailsComponent
  ],
  imports: [
    IssuerRoutingModule,
    ShareModule,
    InfiniteScrollModule,
    NgSelectModule,
    FileDropModule,
    ColorPickerModule,
    ChartsModule,
    Daterangepicker,
    DragulaModule.forRoot(),
    AngularEditorModule,
    NgSlimScrollModule
  ],
  providers: [
    CertificateService,
    StudentService,
    {
      provide: SLIMSCROLL_DEFAULTS,
      useValue: {
        alwaysVisible : true,
        gridOpacity: '0.2', barOpacity: '0.5',
        gridBackground: '#c2c2c2',
        gridWidth: '6',
        gridMargin: '2px 2px',
        barBackground: '#2C3E50',
        barWidth: '6',
        barMargin: '2px 2px'
      }
    }
  ],
  entryComponents: [
    PostConfirmationComponent,
    CanneddeleteComponent,
    SkillsDialogComponent,
    PreviewDetailsComponent
  ]
})
export class IssuerModule { }



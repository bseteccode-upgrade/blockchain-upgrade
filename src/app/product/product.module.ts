import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../share.module';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductService } from './services/product.service';
import { CertificateService } from './services/certificate.service';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductsComponent } from './products/products.component';
import { UploadCertificateComponent } from './upload-certificate/upload-certificate.component';
import { ProductCertificateComponent } from './product-certificate/product-certificate.component';
import { ProductCertificateAssignComponent } from './product-certificate-assign/product-certificate-assign.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewactivityComponent } from './viewactivity/viewactivity.component';

import { DynamicFormBuilderModule } from './dynamic-app/dynamic-form-builder/dynamic-form-builder.module';
import { DynamicAppComponent } from './dynamic-app/dynamic-app.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ReportComponent } from './report/report.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { WorkflowComponent } from './workflow/workflow.component';
import { DragulaModule } from 'ng2-dragula';
import { NgxPrintModule } from 'ngx-print';
import { NewgraphicComponent } from './newgraphic/newgraphic.component';
import { ConverterPipe } from './newgraphic/converter.pipe';
import { ReviewerlistComponent } from './reviewerlist/reviewerlist.component';
import { CreatereviewerComponent } from './createreviewer/createreviewer.component';
import { ReviewerdetailsComponent } from './reviewerdetails/reviewerdetails.component';
import { ProductlocComponent } from './productloc/productloc.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MembersComponent } from './members/members.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MembersFormComponent } from './members-form/members-form.component';
import { WorkflowlistComponent } from './workflowlist/workflowlist.component';
import { WorkflowcreateComponent } from './workflowcreate/workflowcreate.component';
import { MemberinboxComponent } from './memberinbox/memberinbox.component';
import { ProactivityreportComponent } from './proactivityreport/proactivityreport.component';
import { ProactivitytraceComponent } from './proactivitytrace/proactivitytrace.component';
import { ProactivitytrackComponent } from './proactivitytrack/proactivitytrack.component';
import { DownloaddataComponent } from './downloaddata/downloaddata.component';
import { MomentModule } from 'ngx-moment';
import { ActivityhistoryComponent } from './activityhistory/activityhistory.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LogactivityhistoryComponent } from './logactivityhistory/logactivityhistory.component';
import { MemberassignstatusComponent } from './memberassignstatus/memberassignstatus.component';
import { CreatecompanyuserComponent } from './createcompanyuser/createcompanyuser.component';
import { ProdcertactivemodalComponent } from './prodcertactivemodal/prodcertactivemodal.component';
import { ActivitydetailComponent } from './activitydetail/activitydetail.component';

@NgModule({
  imports: [
    CommonModule,
    ProductRoutingModule,
    ShareModule,
    NgSelectModule,
    DynamicFormBuilderModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDN8Ry21DGvGAEX-0cwUlsT_6UjpAJzzZM',
    }),
    AgmDirectionModule,
    DragulaModule.forRoot(),
    NgxPrintModule,
    InfiniteScrollModule,
    MomentModule,
    AngularEditorModule
  ],
  declarations: [
    ProductsComponent,
    ProductComponent,
    ProductListComponent,
    ProductCertificateComponent,
    ProductCertificateAssignComponent,
    UploadCertificateComponent,
    ProductDetailsComponent,
    ViewactivityComponent,
    DynamicAppComponent,
    ReportComponent,
    WorkflowComponent,
    NewgraphicComponent,
    ConverterPipe,
    ReviewerlistComponent,
    CreatereviewerComponent,
    ReviewerdetailsComponent,
    ProductlocComponent,
    DashboardComponent,
    MembersComponent,
    MembersFormComponent,
    WorkflowlistComponent,
    WorkflowcreateComponent,
    MemberinboxComponent,
    ProactivityreportComponent,
    ProactivitytraceComponent,
    ProactivitytrackComponent,
    DownloaddataComponent,
    ActivityhistoryComponent,
    ActivitydetailComponent,
    LogactivityhistoryComponent,
    MemberassignstatusComponent,
    CreatecompanyuserComponent,
    ProdcertactivemodalComponent,
    ActivitydetailComponent
  ],
  providers: [
    ProductService,
    CertificateService
  ],
  entryComponents: [
    ActivityhistoryComponent,
    ActivitydetailComponent,
    LogactivityhistoryComponent,
    ProdcertactivemodalComponent
  ]
})
export class ProductModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { CertificatesComponent } from './certificates/certificates.component';
import { MoocListComponent } from './mooc-list/mooc-list.component';
import { MoocCertificateComponent } from './mooc-certificate/mooc-certificate.component';
import { StudentComponent } from './student.component';
import { MoocService } from './services/mooc.service';
import { ShareModule } from '../share.module';
import { EductionExperienceComponent } from './eduction-experience/eduction-experience.component';
import { PostConfirmationComponent } from './post-confirmation/post-confirmation.component';
import { YourcredentialComponent } from './yourcredential/yourcredential.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    StudentRoutingModule,
    AngularEditorModule
  ],
  declarations: [
    MoocCertificateComponent,
    CertificatesComponent,
    MoocListComponent,
    StudentComponent,
    EductionExperienceComponent,
    PostConfirmationComponent,
    YourcredentialComponent
  ],
  providers: [
    MoocService
  ],
  entryComponents: [
    EductionExperienceComponent,
    PostConfirmationComponent
  ]
})
export class StudentModule { }

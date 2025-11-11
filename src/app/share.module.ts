import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatMenuModule } from '@angular/material';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChartsModule } from 'ng2-charts';
import { ShareButtonModule } from '@ngx-share/button';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxSmartModalModule } from 'ngx-smart-modal';
// import { NgxDynamicTemplateModule } from 'ngx-dynamic-template';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { HeaderComponent } from './shared/header/header.component';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { TeamListComponent } from './shared/team-list/team-list.component';
import { TeamComponent } from './shared/team/team.component';
import { NgSlimScrollModule } from './ngx-slimscroll/module/ngx-slimscroll.module';
import { FooterComponent } from './shared/footer/footer.component';
import { PaymentComponent } from './shared/payment/payment.component';
import { NgxPrintModule } from 'ngx-print';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSnackBarModule,
    NgSlimScrollModule,
    MatPaginatorModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatExpansionModule,
    NgxSmartModalModule.forRoot(),
    ShareButtonModule.forRoot(),
    CKEditorModule,
    TranslateModule.forRoot(),
    // NgxDynamicTemplateModule.forRoot({}),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    QuillModule,
    NgxPrintModule,
    NgSelectModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    SideNavComponent,
    TeamListComponent,
    TeamComponent,
    PaymentComponent
  ],
  exports: [
    TeamListComponent,
    TeamComponent,
    FooterComponent,
    HeaderComponent,
    SideNavComponent,
    PaymentComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    NgSlimScrollModule,
    MatPaginatorModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatExpansionModule,
    NgxSmartModalModule,
    ShareButtonModule,
    CKEditorModule,
    // NgxDynamicTemplateModule,
    TranslateModule,
    FroalaEditorModule,
    FroalaViewModule,
    QuillModule
  ]
})
export class ShareModule { }

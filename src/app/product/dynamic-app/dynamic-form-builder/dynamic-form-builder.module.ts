import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';

// components
import { DynamicFormBuilderComponent } from './dynamic-form-builder.component';
import { FieldBuilderComponent } from './field-builder/field-builder.component';
import { TextBoxComponent } from './atoms/textbox';
import { DropDownComponent } from './atoms/dropdown';
import { CheckBoxComponent } from './atoms/checkbox';
import { FileComponent } from './atoms/file';
import { RadioComponent } from './atoms/radio';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ShareModule } from '../../../share.module';
import { DpDatePickerModule } from 'ng2-date-picker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    ShareModule,
    DpDatePickerModule,
    NgSelectModule
  ],
  declarations: [
    DynamicFormBuilderComponent,
    FieldBuilderComponent,
    TextBoxComponent,
    DropDownComponent,
    CheckBoxComponent,
    FileComponent,
    RadioComponent
  ],
  exports: [DynamicFormBuilderComponent],
  providers: [],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
})
export class DynamicFormBuilderModule { }

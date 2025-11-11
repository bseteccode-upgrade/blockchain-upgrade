/*
 * File : DynamicAppModule
 * Use: Module using for activity form create dynamically and validation and submission
 * Copyright : vottun 2019
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ShareModule } from './../../share.module';
import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  imports: [BrowserModule,
    FormsModule,
    ShareModule,
    ReactiveFormsModule,
    DynamicFormBuilderModule,
    GooglePlaceModule,
    NgSelectModule],
  exports: [GooglePlaceModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
]
})
export class DynamicAppModule { }

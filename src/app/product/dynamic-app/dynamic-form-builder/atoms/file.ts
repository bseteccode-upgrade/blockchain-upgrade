import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ApiService } from '../../../../service/api.service';
import { CommonService } from '../../../../service/common.service';
import { CertificateService } from '../../../services/certificate.service';
declare var jQuery;

// text,email,tel,textarea,password, 
@Component({
  selector: 'file',
  template: `
      <div [formGroup]="form">
      <div>
      <!--  <div *ngIf="!field.value" class="drop-container dropzone" dropZone (hovered)="toggleHover($event)"
          (dropped)="field.onUpload($event)" [class.hovering]="isHovering">
          <p class="m-0">
            Drag a file here or-->

<div style="display:inline-block" class="{{field.name}}">
            <label class="upload-button" for="{{field.name}}">
            {{'browse_file' | translate}}
            </label>
            <input style="display:none;" type="file" id="{{field.name}}" (change)="onFileUpload($event, field.name, field.save)" class="custom-file-input">        
            {{ fileName }}
</div>
            <div class="edit{{field.name}}" style="display:none">

              <a href="javascript:;" target="_blank" class="click_link">click to View</a>
              <button type="button" (click)="onAddNewImages(field.name)" class="add-new">{{'add_new_file' | translate}}</button>

            </div>
            <!-- </label>
            to upload.
          </p> -->


          <!-- <button class="{{field.name}} save-btn" type="button" *ngIf="showSaveButton && field.name !== 'product' && !field.primary && field.save" (click)="savePrimaryValue(field.name, field.type)">
          <i class="material-icons">save</i></button> -->
        </div>


      
        <!-- <div *ngIf="field.value"> -->
          <!-- <button type="button" class="btn btn-primary">Change</button> -->
          <!-- <div class="card">
            <img class="card-img-top" [src]="field.value">
          </div>
        </div> -->
 
      </div>
    `,
  styles: [
    `

    a.click_link {text-transform:capitalize;color:#2196F3;text-decoration:underline; display:inline-block; font-size:16px; padding:0 10px 0 0; margin:5px 5px 5px 0; }
    .save-btn {background-color: transparent;color: #262d37;vertical-align: middle;box-shadow: none;border-radius: 4px;border: none;margin: 10px 0;display: inline-block;padding:5px 10px 0 10px;}
    .save-btn span { position:relative; bottom:5px;font-size:14px;}

    .add-new {background-color: #262d37;color: #fff;vertical-align: middle;box-shadow: none;border-radius: 4px;border: none;margin: 10px 0;display: inline-block;padding:10px;font-size:14px;}

      .drop-container {
        background: #fff;
        border-radius: 6px;
        height: 150px;
        width: 100%;
        box-shadow: 1px 2px 20px hsla(0,0%,4%,.1);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed #c0c4c7;
      }
      p {
        font-size: 16px;
        font-weight: 400;
        color: #c0c4c7; 
      }

      
.custom-container { margin-left:40px }
.custom-file-input::-webkit-file-upload-button {visibility: hidden;}

.custom-file-input::before {
  content: 'Browse';
  display: inline-block;
  background-color: #1e232b;
  color:#fff;
  border-radius: 3px;
  padding: 10px 15px;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  cursor: pointer;
  margin:0 0px;
  font-size: 14px;
  font-weight: normal;
}

.custom-file-input:hover::before {border-color: black;}
.custom-file-input:active::before {background-color: #1e232b;color:#fff;}
input[type=file]:focus { outline:none;}
.upload-button {display: inline-block;border: none;outline: none;cursor: pointer;color: #ffffff;background-color: #1e232b;padding: 10px 10px;font-size: 14px;font-weight: normal;border-radius: 4px;}
.upload-button input {display: none;}

      .dropzone { 
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column; 
        border-radius: 5px;
        background: white;
        margin: 10px 0;
      }
      .dropzone.hovering {
          border: 2px solid #f16624;
          color: #dadada !important;
      }
      progress::-webkit-progress-value {
        transition: width 0.1s ease;
      }
      `
  ]
})
export class FileComponent {
  @Input() field: any = {};
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  showSaveButton = false;
  summaryDetails: any = [];
  selectedFiles: FileList;
  fileName: string;

  constructor(
    public apiService: ApiService,
    public common: CommonService,
    public certiService: CertificateService,
  ) {

  }

  ngOnChange() {
    // this.field.value.
  }

  onFileUpload(e, fieldName, fieldSave) {
    jQuery('body').addClass('imageprocess');
    this.showSaveButton = fieldSave ? true : false;
    let fileData = new FormData();
    const target = e.target || e.srcElement;
    if (target.value.length != 0) {
      const file: File = e.target.files[0];
      this.selectedFiles = e.target.files;
      this.fileName = this.selectedFiles[0].name;
      //console.log('selectedFiles: ' + this.fileName );
      // const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileName = file.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
      // if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 10000000) {
        fileData.append('file', file, file.name);
        fileData.append('user', this.apiService.user.id);
        this.apiService.uploadFile(fileData).subscribe(
          data => {
            this.form.controls[fieldName].setValue(data['file_url']);
            jQuery('body').removeClass('imageprocess');
            this.common.openSnackBar('value_stored', 'Close');
            fileData = new FormData();
            this.showSaveButton = fieldSave ? true : false;
          },
          err => {
            this.showSaveButton = false;
            jQuery('body').removeClass('imageprocess');
            this.common.openSnackBar('error_in_file_upload', 'Close');
            this.form.controls[fieldName].setValue('');
            e.target.value = '';
          }
        );
      } else {
        jQuery('body').removeClass('imageprocess');
        this.showSaveButton = false;
        this.common.openSnackBar('file_size_more', 'Close');
        this.form.controls[fieldName].setValue('');
        e.target.value = '';
      }
    } else {
      jQuery('body').removeClass('imageprocess');
      this.showSaveButton = false;
      // this.common.openSnackBar('file_not_selected', 'Close');
    }
  }

  onAddNewImages(fieldName) {
    this.form.controls[fieldName].setValue('');
    jQuery('.' + fieldName).css('display', 'block');
    jQuery('.edit' + fieldName).css('display', 'none');
  }

  savePrimaryValue(fieldName, fieldType) {
    let primaryKey = [];
    let primaryValue = [];
    if (this.userDetails.profile_details.product_step === 1) {
      this.userDetails.profile_details.field_set.map((element) => {
        if (element.primary === true) {
          primaryKey.push(element.name);
          primaryValue.push(this.form.controls[element.name].value ? this.form.controls[element.name].value : '');
        }
      });
    } else {
      primaryKey = this.summaryDetails.primary_key;
      primaryValue = this.summaryDetails.primary_variable;
    }
    if (this.form.controls[fieldName].value && this.form.controls[fieldName].value.trim() !== '') {
      this.certiService.defaultValueStore(
        {
          step: this.userDetails.profile_details.product_step,
          key: fieldName,
          value: this.form.controls[fieldName].value,
          type: fieldType,
          workflow_id: this.userDetails.profile_details.workflow_id,
          primary_key: primaryKey,
          primary_value: primaryValue,
        }).subscribe(res => {
          this.common.openSnackBar('value_stored', 'Close');
        }, err => {
          // console.log(err);
        });
    } else {
      this.common.openSnackBar('field_should_not_be_empty', 'Close');
      this.form.controls[fieldName].markAsDirty();
    }
  }
}
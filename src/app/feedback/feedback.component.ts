import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from './../service/api.service';
import { CommonService } from './../service/common.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  feedbackData: any = {
    name: '',
    email: '',
    subject: '',
    message: '',
    attachment: null
  };
  attachmentFile = new FormData();
  errorMsgArr: any = [];
  errorMsg = '';
  errorMsgFeedback = '';
  process = false;
  fileName = '';
  constructor(
    private formbuilder: FormBuilder,
    public apiService: ApiService,
    public common: CommonService,
    public dialogRef: MatDialogRef<FeedbackComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.formbuilder.group({
      'name': [this.feedbackData.name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'email': [this.feedbackData.email, [Validators.required, Validators.email, this.noWhitespaceValidator]],
      'subject': [this.feedbackData.subject, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'message': [this.feedbackData.message, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'attachment': [this.feedbackData.attachment]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    if (control.value != null) {
      const isWhitespace = control.value.trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    } else {
      return null;
    }
  }

  geterrorMsgFeedback(field) {
    return this.feedbackForm.controls[field].hasError('required')
      || this.feedbackForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.feedbackForm.controls[field].hasError('email') ? 'not_valid_email' : '';
  }

  submitFeedback(formData) {
    this.errorMsgFeedback = '';
    if (this.feedbackForm.valid) {
      this.process = true;
      formData.page_url = window.location.href;
      formData.website = location.origin;
      this.attachmentFile.append('name', formData.name);
      this.attachmentFile.append('email', formData.email);
      this.attachmentFile.append('subject', formData.subject);
      this.attachmentFile.append('message', formData.message);
      this.attachmentFile.append('page_url', formData.page_url);
      this.attachmentFile.append('website', formData.website);
      this.apiService.feedbacksend(this.attachmentFile).subscribe(
        data => {
          this.process = false;
          this.errorMsgFeedback = '';
          this.dialogRef.close({result: 'yes'});
        },
        err => {
          this.process = false;
          if (err.error && err.error.detail) {
            this.errorMsgFeedback = err.error.detail;
          } else {
            const errArr = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
                this.errorMsgArr[key] = err.error[key][0];
              }
            }
            this.errorMsgFeedback = (errArr.length !== 0) ? errArr[0][0] : err.error;
          }
        }
      );
    } else {
      this.errorMsgFeedback = 'provide_valid_inputs';
    }
  }

  uploadFile(e) {
    this.errorMsg = '';
    this.errorMsgArr['attachment'] = '';
    const file: File = e.target.files[0];
    this.feedbackForm.patchValue({
      attachment: file
    });
    const fileName = file.name;
    if (file.size <= 3072000) {
      this.fileName = file.name;
      // this.attachmentFile = new FormData();
      this.attachmentFile.append('attachment', file, fileName);
    } else {
      this.fileName = '';
      this.feedbackData.attachment = '';
      this.errorMsgArr['attachment'] = 'file_size_more';
    }
  }

  onClose() {
    this.dialogRef.close({result: 'no'});
  }

}

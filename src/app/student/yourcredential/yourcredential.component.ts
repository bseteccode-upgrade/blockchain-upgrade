import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-yourcredential',
  templateUrl: './yourcredential.component.html',
  styleUrls: ['./yourcredential.component.css']
})
export class YourcredentialComponent implements OnInit {
  contactForm: FormGroup;
  errorMsg = '';
  successMsg = '';
  errorMsgArr = [];
  process = false;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    sanitize: false,
    toolbarPosition: 'top'
  };
  constructor(
    formbuilder: FormBuilder,
    private apiService: ApiService,
    public common: CommonService,
    private router: Router
  ) {
    this.contactForm = formbuilder.group({
      'training_center': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'description': [null, Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(8)])],
    });
  }

  ngOnInit() {
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submitForm(formData) {
    this.errorMsg = '';
    if (this.contactForm.valid) {
      this.process = true;
      this.apiService.contactFrom(formData).subscribe(
        data => {
          this.process = false;
          this.successMsg = 'mail_send_sucessfully';
          this.contactForm.reset();
        },
        err => {
          this.errorMsg = 'provide_valid_inputs';
          this.process = false;
          this.successMsg = '';
        }
      );
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  getErrorMessage(field) {
    return this.contactForm.controls[field].hasError('required')
      || this.contactForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

}

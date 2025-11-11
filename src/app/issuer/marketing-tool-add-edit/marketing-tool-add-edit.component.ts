import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;

import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);

const font = Quill.import('formats/font');
// We do not add Aref Ruqaa since it is the default
font.whitelist = ['certificate', 'play', 'helveticabold', 'helveticastd', 'opensans', 'opensans-semi', 'opensans-bold', 'roboto-bold', 'roboto-medium', 'alegreyasc-regular', 'ptserif-regular', 'nyala', 'alex', 'alex-regular', 'ovo', 'calibri', 'museoslab', 'kadwa-regular', 'kron-regular', 'poly-regular', 'poppins-regular', 'allura-regular', 'archivo-regular', 'cinzel-regular', 'raleway-light', 'raleway-bold', 'italianno-regular', 'verdana', 'verdana-bold', 'montserrat-regular', 'vollkorn-italic', 'montserrat-semibold', 'cormor-regular', 'mirza', 'roboto', 'aref', 'acme', 'archivo', 'cantarell', 'comfortaa', 'courgette', 'fredoka', 'great', 'hind', 'jomhuria', 'kanit', 'kaushan', 'manuale', 'maven', 'monda', 'orbitron', 'overpass', 'quat', 'satisfy', 'signika', 'serif', 'sansserif', 'monospace']
Quill.register(font, true);

const size = Quill.import('formats/size');
size.whitelist = ['8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60'];
Quill.register(size, true);

declare var jQuery;

@Component({
  selector: 'app-marketing-tool-add-edit',
  templateUrl: './marketing-tool-add-edit.component.html',
  styleUrls: ['./marketing-tool-add-edit.component.css']
})
export class MarketingToolAddEditComponent implements OnInit, AfterViewInit {
  marketingModel: any = {
    'email_share_mail_content': null,
    'email_share_mail_subject': null,
    'facebook_content': null,
    'linkedin_content': null,
    'twitter_content': null,
    'whatsapp_content': null,
  };
  marketingform: FormGroup;

  marketUserId: any;
  socialTitle: any;

  quillEditorRef: any;
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
  modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        [{
          'placeholder': [
            '{home_page}',
            '{email}',
            '{passw}',
            '{cert_title}',
            '{student_name}',
            '{organization}',
            '{start_date}',
            '{end_date}',
            '{expire_date}',
            '{issue_date}',
            '{student_lastname}']
        }]
      ]
    }
  };

  errorMsg = '';
  errorMsgArr: any = [];
  resData: any = [];
  edu_keywords = [
    { 'key': 'home_page' },
    { 'key': 'email' },
    { 'key': 'passw' },
    { 'key': 'cert_title' },
    { 'key': 'student_name' },
    { 'key': 'organization' },
    { 'key': 'start_date' },
    { 'key': 'end_date' },
    { 'key': 'expire_date' },
    { 'key': 'issue_date' },
    { 'key': 'student_lastname' }
  ];
  mailContentWords: any;
  keywordWithType: any;
  constructor(
    private formbuilder: FormBuilder,
    public certService: CertificateService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  getEditorInstance(editorInstance: any) {
    this.quillEditorRef = editorInstance;
  }

  ngAfterViewInit() {
    var self = this;
    jQuery(document).on('click', '.ql-picker-options', function (e) {
      jQuery('.ql-picker-item').removeClass('ql-selected');
    });

    jQuery(document).on('click', '.ql-placeholder .ql-picker-item', function (e) {
      jQuery(this).parents('.ql-expanded').removeClass('ql-expanded');
      self.quillEditorRef.focus();
      e.preventDefault();
      const cursorPosition = self.quillEditorRef.selection.savedRange;
      self.quillEditorRef.insertText(cursorPosition.index, jQuery(this).attr('data-value'));
      self.quillEditorRef.setSelection(cursorPosition.index + jQuery(this).attr('data-value').length);
    });
    /* Display drop-down content */
    const placeholderPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-placeholder .ql-picker-item'));
    placeholderPickerItems.forEach(item => item.textContent = item.dataset.value);
    document.querySelector('.ql-placeholder .ql-picker-label').innerHTML
      = 'Insert content' + document.querySelector('.ql-placeholder .ql-picker-label').innerHTML;
  }


  createForm() {
    this.marketingform = this.formbuilder.group({
      'email_share_mail_content': [this.marketingModel.email_share_mail_content],
      'email_share_mail_subject': [this.marketingModel.email_share_mail_subject],
      'facebook_content': [this.marketingModel.facebook_content],
      'linkedin_content': [this.marketingModel.linkedin_content],
      'twitter_content': [this.marketingModel.twitter_content],
      'whatsapp_content': [this.marketingModel.whatsapp_content],
    });
  }

  ngOnInit() {
    this.socialTitle = this.route.snapshot.paramMap.get('title');
    this.marketUserId = this.route.snapshot.paramMap.get('id');
    this.getCannedMsgList();
  }

  getCannedMsgList() {
    this.certService.getMarketingMsg().subscribe(res => {
      this.marketingModel = res;
      this.createForm();
      if (this.socialTitle != 'email_share') {
        this.marketingform.controls[this.socialTitle + '_content'].setValidators(Validators.compose([Validators.required, this.noWhitespaceValidator]));
        this.marketingform.controls[this.socialTitle + '_content'].updateValueAndValidity();
      } else {
        this.marketingform.controls[this.socialTitle + '_mail_content'].setValidators(Validators.compose([Validators.required, this.noWhitespaceValidator]));
        this.marketingform.controls[this.socialTitle + '_mail_subject'].setValidators(Validators.compose([Validators.required, this.noWhitespaceValidator]));
        this.marketingform.controls[this.socialTitle + '_mail_content'].updateValueAndValidity();
        this.marketingform.controls[this.socialTitle + '_mail_subject'].updateValueAndValidity();
      }
    });
  }

  checkDifferentKeyWord(subStr) {
    if (this.edu_keywords.length > 0) {
      const index = this.edu_keywords.findIndex(e => e.key === subStr);
      if (index == -1) {
        this.errorMsg = 'provide_valid_inputs';
        this.errorMsgArr['email_share_mail_content'] = 'you_are_used_invaild_keywords';
        this.common.openSnackBar('you_are_used_invaild_keywords', 'Close');
        return false;
      }
    }
  }

  submit(formData) {
    this.errorMsgArr = [];
    this.errorMsg = '';
    
    if (this.marketingform.valid) {
      if (this.socialTitle == 'email_share') {
        const mailcontent = formData.email_share_mail_content.replace(/\n/g, ' ');
        this.mailContentWords = mailcontent.split(' ');
        this.mailContentWords.filter(x => {
          if (x != '' && x.indexOf('{') > -1) {
            const mySubString = x.substring(
              x.lastIndexOf('{') + 1,
              x.lastIndexOf('}')
            );
            this.checkDifferentKeyWord(mySubString);
          }
        });
      }
      if (this.errorMsg == '') {
        this.saveDatas(formData);
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  saveDatas(formData) {
    this.certService.editMarketingTool(this.marketUserId, formData).subscribe(
      data => {
        this.resData = data;
        if (this.resData !== '') {
          this.common.openSnackBar('social_share_content_updated', 'Close');
          this.router.navigate(['marketingtool']);
        }
      },
      err => {
      }
    );
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  geterrorMsg(field) {
    return this.marketingform.controls[field].hasError('required')
      || this.marketingform.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

}

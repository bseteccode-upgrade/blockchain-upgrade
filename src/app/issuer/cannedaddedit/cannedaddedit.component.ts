import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-cannedaddedit',
  templateUrl: './cannedaddedit.component.html',
  styleUrls: ['./cannedaddedit.component.css']
})
export class CannedaddeditComponent implements OnInit, AfterViewInit {
  mailModel: any = {
    'mail_type': '1',
    'title': null,
    'subject': null,
    'message': null,
    'linkedin': false,
    'wallet_login': false,
    'view_credentials': false
  };
  errorMsg: string;
  mailform: FormGroup;
  profilePic = new FormData();
  errorMsgArr: any = [];
  studentId: string;
  process = false;
  selectedCannedOption = 1;
  keywordWithType: any = [
    { type: '1', keywords: ['home_page', 'email', 'passw'], error: 'team_member_invite_mail_required_key' },
    { type: '2', keywords: ['home_page'], error: 'email_share_mail_required_key' },
    { type: '3', keywords: ['home_page', 'email', 'passw'], error: 'team_member_invite_mail_required_key' },
    { type: '4', keywords: ['home_page'], error: 'email_share_mail_required_key' },
    { type: '5', keywords: ['home_page', 'email', 'passw'], error: 'team_member_invite_mail_required_key' },
    { type: '6', keywords: ['home_page'], error: 'email_share_mail_required_key' },
  ];
  messageContentError = this.keywordWithType[0].error;

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
  cannedMsdId: any = '';
  keyword_collect: any = [];
  mailContentWords: any;
  edu_keywords: any = [];

  quillEditorRef: any;

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
      ],
      handlers: {
        image: (image) => {
          this.customImageUpload(image);
        }
      }
    },
    // imageResize: true
  };
  @ViewChild('quillFile') quillFileRef: ElementRef;
  imageFile = new FormData();
  quillFile: any;
  keyword_collect_subject = [];
  mailSubjectWords = [];

  constructor(
    private formbuilder: FormBuilder,
    private stdService: StudentService,
    public apiService: ApiService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getMailKeywords();
    this.cannedMsdId = this.route.snapshot.paramMap.get('id');
    if (this.cannedMsdId != '') {
      this.stdService.getCannedMsgDetails(this.cannedMsdId).subscribe(data => {
        this.mailModel = data;
        this.createForm();
        this.optionChanges(this.mailModel.mail_type);
      });
    }
  }

  getEditorInstance(editorInstance: any) {
    this.quillEditorRef = editorInstance;
  }

  customImageUpload(image: any) {
    console.log(image);
    /* Here we trigger a click action on the file input field, this will open a file chooser on a client computer */
    this.quillFileRef.nativeElement.click();
  }

  quillFileSelected(ev: any) {
    /* After the file is selected from the file chooser, we handle the upload process */
    this.quillFile = ev.target.files[0];
    console.log(ev.target.files[0]);
    this.imageFile.append('file', this.quillFile, this.quillFile.name);
    this.imageFile.append('user', this.apiService.user.id);
    this.apiService.uploadFile(this.imageFile).subscribe(
      data => {
        let range: any;
        const img = '<img src="' + data["file_url"] + '"></img>';
        range = this.quillEditorRef.getSelection();
        this.quillEditorRef.clipboard.dangerouslyPasteHTML(range.index, img);
        this.imageFile = new FormData();
      },
      err => {
        this.common.openSnackBar('error_in_file_upload', 'Close');
      }
    );
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
    if (this.cannedMsdId) {
    } else {
      jQuery('#dynamiccontent').last().append(this.mailModel.message);
      jQuery('.placeholderAddContent').css('display', 'none');
    }
  }

  getMailKeywords() {
    this.stdService.getMailKeywords().subscribe(data => {
      this.edu_keywords = data;
    });
  }

  optionChanges(value) {
    this.selectedCannedOption = value;
    const index = this.keywordWithType.findIndex(e => e.type === value);
    if (index != -1) {
      this.messageContentError = this.keywordWithType[index].error;
    }
  }

  createForm() {
    this.mailform = this.formbuilder.group({
      'mail_type': [this.mailModel.mail_type],
      'title': [this.mailModel.title, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'subject': [this.mailModel.subject, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'message': [this.mailModel.message, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'linkedin': [this.mailModel.linkedin],
      'wallet_login': [this.mailModel.wallet_login],
      'view_credentials': [this.mailModel.view_credentials],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  checkDifferentKeyWord(subStr) {
    if (this.edu_keywords.length > 0) {
      const index = this.edu_keywords.findIndex(e => e.key === subStr);
      if (index == -1) {
        this.errorMsg = 'provide_valid_inputs';
        this.common.openSnackBar('you_are_used_invaild_keywords', 'Close');
      }
    }
  }

  submit(formData) {
    this.errorMsgArr = [];
    this.errorMsg = '';
    if (this.mailform.valid) {
      console.log(formData.mail_type);
      const index = this.keywordWithType.findIndex(e => e.type === formData.mail_type);
      if (index != -1) {
        console.log(this.keywordWithType[index].keywords);
      }
      // mail content
      const originalContent = formData.message;
      const removePTag = originalContent.replace(/<\/?[^>]+(>|$)/g, ' ');
      const mailcontentSpace = removePTag.replace(/ /g, '&nbsp;');
      const mailcontent = mailcontentSpace.replace(/\n/g, '&nbsp;');
      this.mailContentWords = mailcontent.split('&nbsp;');
      this.keyword_collect = [];
      this.mailContentWords.filter(x => {
        if (x != '' && x.indexOf('{') > -1) {
          const mySubString = x.substring(
            x.lastIndexOf('{') + 1,
            x.lastIndexOf('}')
          );
          if (this.keywordWithType[index].keywords.includes(mySubString)) {
            if (!this.keyword_collect.includes(mySubString)) {
              this.keyword_collect.push(mySubString);
            }
          }
          this.checkDifferentKeyWord(mySubString);
        }
      });

      // mail subject
      const originalSubject = formData.subject;
      const removePTagSubject = originalSubject.replace(/<\/?[^>]+(>|$)/g, ' ');
      const mailSubjectSpace = removePTagSubject.replace(/ /g, '&nbsp;');
      const mailSubject = mailSubjectSpace.replace(/\n/g, '&nbsp;');
      this.mailSubjectWords = mailSubject.split('&nbsp;');
      this.keyword_collect_subject = [];
      this.mailSubjectWords.filter(x => {
        if (x != '' && x.indexOf('{') > -1) {
          const mySubString = x.substring(
            x.lastIndexOf('{') + 1,
            x.lastIndexOf('}')
          );
          this.checkDifferentKeyWord(mySubString);
        }
      });

      if (this.keyword_collect.length < this.keywordWithType[index].keywords.length) {
        this.errorMsg = 'provide_valid_inputs';
        this.common.openSnackBar(this.keywordWithType[index].error, 'Close');
        return false;
      }
      if (this.errorMsg == '') {
        if (this.cannedMsdId != '' && this.cannedMsdId && this.cannedMsdId != null) {
          this.updateMail(formData);
        } else {
          this.newMail(formData);
        }
      } else {
        this.errorMsg = 'provide_valid_inputs';
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  newMail(formData) {
    this.stdService.saveNewMailContent(formData).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('mail_content_added', 'Close');
        this.router.navigate(['cannedlist']);
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = 'provide_valid_inputs';
        }
      }
    );
  }

  updateMail(formData) {
    this.stdService.updateCannedMsgMailContent(formData, this.cannedMsdId).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('mail_content_updated', 'Close');
        this.router.navigate(['cannedlist']);
      },
      err => {
        this.process = false;
        if (err.error && err.error.detail) {
          this.errorMsg = err.error.detail;
        } else {
          const errArr = [];
          for (const key in err.error) {
            if (err.error.hasOwnProperty(key)) {
              errArr.push(err.error[key]);
              this.errorMsgArr[key] = err.error[key][0];
            }
          }
          this.errorMsg = 'provide_valid_inputs';
        }
      }
    );
  }

  geterrorMsg(field) {
    return this.mailform.controls[field].hasError('required')
      || this.mailform.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }
}


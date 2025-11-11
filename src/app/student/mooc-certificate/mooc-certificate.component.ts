import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, DefaultValueAccessor } from '@angular/forms';
import { StudentService } from '../../issuer/services/student.service';
import { MoocService } from '../services/mooc.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-mooc-certificate',
  templateUrl: './mooc-certificate.component.html',
})
export class MoocCertificateComponent implements OnInit {
  moocModel: any = {
    expiry_date: null,
    issue_date: null,
    upload: '',
    mooc_name: '',
    course_name: '',
    certificate_number: '',
    mooc_website: '',
  };
  errorMsg: string;
  minendDate: any;
  moocForm: FormGroup;
  moocCertificate = new FormData();
  errorMsgArr: any = [];
  certificateId: string;
  process = false;
  constructor(
    private formbuilder: FormBuilder,
    private moocService: MoocService,
    private stdService: StudentService,
    public apiService: ApiService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.certificateId = this.route.snapshot.paramMap.get('id');
    if (this.certificateId) {
      this.moocService.getCertificate(this.certificateId).subscribe(data => {
        this.moocModel = data;
        this.createForm();
      });
    }
  }

  onStartDateChange(date) {
    this.minendDate = moment(date).add(1, 'day').format('YYYY-MM-DD');
  }

  createForm() {
    this.moocForm = this.formbuilder.group({
      'upload': [this.moocModel.upload, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'mooc_name': [this.moocModel.mooc_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'course_name': [this.moocModel.course_name, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'expiry_date': [this.moocModel.expiry_date],
      'issue_date': [this.moocModel.issue_date, Validators.required],
      'certificate_number': [this.moocModel.certificate_number, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'mooc_website': [this.moocModel.mooc_website, Validators.compose([Validators.required, this.noWhitespaceValidator])],
    });
  }

  changeDateEvent(e) {
    this.moocForm.controls['issue_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  changeendDateEvent(e) {
    this.moocForm.controls['expiry_date'].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit(formData) {
    this.errorMsgArr = [];
    if (this.moocForm.valid) {
      if (this.certificateId) {
        this.editStudent(formData, this.certificateId);
      } else {
        this.addStudent(formData);
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  addStudent(formData) {
    this.process = true;
    this.moocService.addCertificate(formData).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('certificate_added_successfully', 'Close');
        this.router.navigate(['mooc-list']);
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

  editStudent(formData, id) {
    this.process = true;
    this.moocService.editCertificate(formData, id).subscribe(
      data => {
        this.process = false;
        this.common.openSnackBar('certificate_detail_edit', 'Close');
        this.router.navigate(['mooc-list']);
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

  uploadFile(e) {
    this.errorMsg = '';
    this.errorMsgArr['avatar'] = '';
    this.moocCertificate = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = ['pdf'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.moocCertificate.append('file', file, file.name);
        this.moocCertificate.append('user', this.apiService.user.id);
        this.apiService.uploadFile(this.moocCertificate).subscribe(
          data => {
            this.moocModel.upload = data['file_url'];
            this.moocForm.controls['upload'].setValue(data['file_url']);
            this.moocCertificate = new FormData();
          },
          err => {
            this.common.openSnackBar('error_in_file_upload', 'Close');
          }
        );
      } else {
        this.moocModel.avatar = '';
        this.errorMsgArr['avatar'] = 'file_size_more';
      }
    } else {
      this.moocModel.avatar = '';
      this.errorMsgArr['avatar'] = 'invalid_file_type';
    }
  }

  geterrorMsg(field) {
    return this.moocForm.controls[field].hasError('required')
      || this.moocForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.moocForm.controls[field].hasError('email') ? 'not_valid_email' :
        '';
  }
}

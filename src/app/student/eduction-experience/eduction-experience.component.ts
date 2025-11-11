import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApiService } from '../../service/api.service';
import { CertificateService } from '../../issuer/services/certificate.service';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-eduction-experience',
  templateUrl: './eduction-experience.component.html',
  styleUrls: ['./eduction-experience.component.css']
})
export class EductionExperienceComponent implements OnInit {
  expForm: FormGroup;
  errorMsg: any = '';
  errorMsgArr: any = [];
  certPic = new FormData();
  resUserCertList: any;
  certificates: any;
  editEduData: any = {
    'badge_image': null,
    'certificate': null,
    'experience_title': null,
    'external_certificate': false,
    'external_url': null,
    'from_month': null,
    'from_year': null,
    'organization': null,
    'to_month': null,
    'to_year': null
  };
  externalImage: any;
  monthArr: any = [
    { index: '01', month: 'January' },
    { index: '02', month: 'February' },
    { index: '03', month: 'March' },
    { index: '04', month: 'April' },
    { index: '05', month: 'May' },
    { index: '06', month: 'June' },
    { index: '07', month: 'July' },
    { index: '08', month: 'August' },
    { index: '09', month: 'September' },
    { index: '10', month: 'October' },
    { index: '11', month: 'November' },
    { index: '12', month: 'December' },
  ];
  process = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EductionExperienceComponent>,
    private certiService: CertificateService,
    public common: CommonService,
  ) {
    this.getCertificate();
  }

  ngOnInit() {
    this.createForm();
    if (this.data.edu_id != '') {
      this.getEduDetails(this.data.edu_id);
    }
  }

  createForm() {
    this.expForm = this.formbuilder.group({
      'certificate': [this.editEduData.certificate],
      'experience_title': [this.editEduData.experience_title],
      'from_month': [this.editEduData.from_month],
      'from_year': [this.editEduData.from_year, Validators.compose([Validators.pattern(/^-?([0-9]\d*)?$/)])],
      'to_month': [this.editEduData.to_month],
      'to_year': [this.editEduData.to_year, Validators.compose([Validators.pattern(/^-?([0-9]\d*)?$/)])],
      'organization': [this.editEduData.organization],
      'external_url': [this.editEduData.external_url],
      'external_certificate': [this.editEduData.external_certificate],
      'badge_image': [this.editEduData.badge_image],
    });
    if (this.data.edu_id == '') {
      this.selectExternal(false);
    }
  }

  getCertificate(searchData?: any) {
    this.process = true;
    this.certiService.getCertificates(searchData).subscribe(
      data => {
        this.process = false;
        this.resUserCertList = data;
        this.certificates = this.resUserCertList.user_cert_list;
      },
      err => {
        this.process = false;
      }
    );
  }

  getEduDetails(id) {
    this.certiService.getEduDetail(id).subscribe(
      data => {
        this.editEduData = data;
        if (this.editEduData.external_certificate) {
          this.selectExternal(this.editEduData.external_certificate);
          this.externalImage = this.editEduData.badge_image;
          this.createForm();
        } else {
          this.selectExternal(this.editEduData.external_certificate);
          this.createForm();
        }
      }
    );
  }

  getcertificateId(certID) {
    this.expForm.controls['certificate'].setValue(certID);
    const index = this.certificates.findIndex(e => e.id === certID);
    if (index != -1) {
      this.expForm.controls['experience_title'].setValue(this.certificates[index].title);
      this.expForm.controls['organization'].setValue(this.certificates[index].organization);
      const issueDate = this.certificates[index].issue_date.split('-');
      this.expForm.controls['from_year'].setValue(issueDate[0]);
      this.expForm.controls['from_month'].setValue(issueDate[1]);
      if (this.certificates[index].end_date != 'None') {
        const endDate = this.certificates[index].issue_date.split('-');
        this.expForm.controls['to_year'].setValue(endDate[0]);
        this.expForm.controls['to_month'].setValue(endDate[1]);
      } else {
        this.expForm.controls['to_year'].setValue('');
        this.expForm.controls['to_month'].setValue('');
      }
    }
    this.expForm.markAsTouched();
  }

  selectExternal(checked) {
    if (checked) {
      this.expForm.controls['certificate'].setValue('');
      this.expForm.controls['experience_title'].setValue('');
      this.expForm.controls['organization'].setValue('');
      this.expForm.controls['from_year'].setValue('');
      this.expForm.controls['from_month'].setValue('');
      this.expForm.controls['to_year'].setValue('');
      this.expForm.controls['to_month'].setValue('');

      this.expForm.controls['certificate'].clearValidators();
      this.expForm.controls['experience_title'].setValidators([Validators.required]);
      this.expForm.controls['organization'].setValidators([Validators.required]);
      this.expForm.controls['from_year'].setValidators([Validators.required]);
      this.expForm.controls['from_month'].setValidators([Validators.required]);
      // this.expForm.controls['to_month'].setValidators([Validators.required]);
      // this.expForm.controls['to_year'].setValidators([Validators.required]);
      this.expForm.controls['external_url'].setValidators([Validators.required]);
      this.expForm.controls['badge_image'].setValidators([Validators.required]);

      this.expForm.controls['certificate'].updateValueAndValidity();
      this.expForm.controls['experience_title'].updateValueAndValidity();
      this.expForm.controls['organization'].updateValueAndValidity();
      this.expForm.controls['from_year'].updateValueAndValidity();
      this.expForm.controls['from_month'].updateValueAndValidity();
      // this.expForm.controls['to_month'].updateValueAndValidity();
      // this.expForm.controls['to_year'].updateValueAndValidity();
      this.expForm.controls['external_url'].updateValueAndValidity();
      this.expForm.controls['badge_image'].updateValueAndValidity();
      this.expForm.updateValueAndValidity();
    } else {
      this.expForm.controls['certificate'].setValidators([Validators.required]);
      this.expForm.controls['experience_title'].clearValidators();
      this.expForm.controls['organization'].clearValidators();
      this.expForm.controls['from_year'].clearValidators();
      this.expForm.controls['from_month'].clearValidators();
      this.expForm.controls['to_year'].clearValidators();
      this.expForm.controls['to_month'].clearValidators();
      this.expForm.controls['external_url'].clearValidators();
      this.expForm.controls['badge_image'].clearValidators();

      this.expForm.controls['badge_image'].setValue('');
      this.expForm.controls['external_certificate'].setValue(false);
      this.expForm.controls['external_url'].setValue('');
      this.expForm.updateValueAndValidity();
    }
  }

  onlyNumber(event) {
    var key = event.charCode || event.keyCode || 0;
    // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
    // home, end, period, and numpad decimal
    if (event.shiftKey) {
      event.preventDefault();
    } else {
      return (
        key == 8 ||
        key == 9 ||
        key == 13 ||
        key == 46 ||
        key == 110 ||
        (key >= 35 && key <= 40) ||
        (key >= 48 && key <= 57) ||
        (key >= 96 && key <= 105));
    }
  }

  deleteImage() {
    this.externalImage = '';
    this.expForm.controls['badge_image'].setValue('');
    this.expForm.controls['badge_image'].setValidators([Validators.required]);
    this.expForm.controls['badge_image'].updateValueAndValidity();
    this.expForm.updateValueAndValidity();
    this.expForm.markAsTouched();
  }

  uploadImage(e) {
    this.errorMsg = '';
    this.errorMsgArr['badge_image'] = '';
    this.certPic = new FormData();
    const file: File = e.target.files[0];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (allowedExtensions.indexOf(fileExtension.toLowerCase()) > -1) {
      if (file.size <= 3072000) {
        this.certPic.append('file', file, file.name);
        this.apiService.uploadFile(this.certPic).subscribe(data => {
          this.externalImage = data['file_url'];
          this.expForm.controls['badge_image'].setValue(data['file_url']);
          this.expForm.markAsTouched();
          this.certPic = new FormData();
        });
      } else {
        this.expForm.controls['badge_image'].setValue(null);
        this.errorMsgArr['badge_image'] = 'file_size_more';
      }
    } else {
      this.expForm.controls['badge_image'].setValue(null);
      this.errorMsgArr['badge_image'] = 'invalid_file_format';
    }
    e.target.value = '';
  }

  formSubmit(formData) {
    this.errorMsg = false;
    this.errorMsgArr = [];
    if (!this.expForm.invalid) {
      if (this.data.edu_id != '') {
        this.certiService.updateEducDetails(formData, this.data.edu_id).subscribe(
          data => {
            this.dialogRef.close('success');
            this.common.openSnackBar('education_details_updated', 'Close');
          });
      } else {
        this.certiService.addEducationDetails(formData).subscribe(
          data => {
            this.dialogRef.close('success');
            this.common.openSnackBar('education_details_added', 'Close');
          });
      }
    } else {
      this.errorMsg = true;
    }
  }

  getErrorMessage(field, err?: string) {
    if (field === 'external_url') {
      return this.expForm.controls[field].hasError('required') ? 'enter_a_value' : this.expForm.controls[field].hasError('pattern') ? 'invalid_url' : '';
    } else if (field == 'from_month' && field == 'from_year' && field == 'to_month' && field == 'to_year') {
      return this.expForm.controls[field].hasError('pattern') ? 'enter_only_number' : '';
    } else if (field == 'badge_image') {
      return this.expForm.controls[field].hasError('required') ? 'field_should_not_be_empty' : '';
    } else {
      return this.expForm.controls[field].hasError('required')
        || this.expForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    }
  }

  closePopup() {
    this.dialogRef.close('cancel');
  }
}

/*
 * File : certificate-upload.component.ts
 * Use: Certificate issue based on the csv file student list
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../../service/api.service';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-certificate-upload',
  templateUrl: './certificate-upload.component.html',
  styleUrls: ['./certificate-upload.component.css']
})
export class CertificateUploadComponent implements OnInit {
  fileName: any;
  csvdata: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = false;
  studentUpload = new FormData();
  certificatesList: any = [];
  percentDone = 0;
  process = false;
  secondFormProcess = false;
  uploadedFileName = '';
  resBulkData: any = [];
  checkBalance: any;
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  testMode: any = this.userDetails.profile_details.test_mode;
  fail_count = 0;
  errorDetails: any = [];
  finalArrayCons: any = [{
    'bth_issued_suc': [],
    'isu_dt_not_valid': [],
    'exp_dt_not_valid': [],
    'email_not_valid': [],
    'cet_code_not_valid': [],
    'crs_code_not_valid': [],
    'stu_not_exist': [],
    'stu_alien': [],
    'cert_with_block': [],
    'bal_low': [],
    'cert_exist': [],
    'start_dt_not_valid': [],
    'end_dt_not_valid': [],
    'block_not_valid': []
  }
  ];
  arrayOfKeys;
  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private certiService: CertificateService,
    private common: CommonService,
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
  ) { }

  // displayedColumns = ['EMAIL', 'CERTIFICATE CODE', 'COURSE CODE', 'ISSUE DATE', 'EXPIRE DATE', 'Action'];
  displayedColumns = ['EMAIL', 'CERTIFICATE CODE', 'ISSUE DATE', 'EXPIRE DATE', 'Action'];
  dataSource = new MatTableDataSource<Element>(this.certificatesList);
  selection = new SelectionModel<Element>(true, []);

  ngOnInit() {
    setTimeout(() => {
      if (this.apiService.userType === '4' && !this.apiService.pages.issue_certificate) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
      if (this.apiService.remaining_wallet < 10 && !this.testMode) {
        this.ngxSmartModalService.getModal('planPopupInfo').open();
      }
    }, 1500);
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  upload(e) {
    this.reset();
    this.studentUpload = new FormData();
    this.certificatesList = [];
    this.percentDone = 0;
    this.firstFormGroup.controls['firstCtrl'].reset();
    const file: File = e.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (fileExtension === 'csv') {
      this.studentUpload.append('file', file, file.name);
      this.studentUpload.append('user', this.apiService.user.id);
      this.certiService.certificatesUploadFile(this.studentUpload).subscribe(event => {
        e.target.value = '';
        this.firstFormGroup.controls['firstCtrl'].setValue(fileName);
        this.uploadedFileName = fileName;
        this.certificatesList = event['body'];
        this.dataSource = new MatTableDataSource(this.certificatesList);
        this.studentUpload = new FormData();
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          if (typeof this.certificatesList === 'object') {
            if (this.certificatesList.length > 0) {
              this.firstFormGroup.controls['firstCtrl'].setValue(this.uploadedFileName);
              this.common.openSnackBar('file_upload_successful', 'Close');
            } else {
              this.firstFormGroup.controls['firstCtrl'].setValue('');
              this.common.openSnackBar('file_have_no_data', 'Close');
              return false;
            }
          } else {
            this.firstFormGroup.controls['firstCtrl'].setValue('');
            this.common.openSnackBar('file_have_no_data', 'Close');
            return false;
          }
        }
      },
        err => {
          this.firstFormGroup.controls['firstCtrl'].setValue('');
          this.percentDone = 0;
          this.common.openSnackBar('invalid_file_format', 'Close');
          return false;
        });
    } else {
      this.common.openSnackBar('invalid_file_format', 'Close');
    }
    return false;
  }

  secondButton(stepper) {
    this.secondFormProcess = true;
    this.certiService.checkBeforeCertPost(this.certificatesList).subscribe(data => {
      this.checkBalance = data;
      this.secondFormProcess = false;
      if (this.checkBalance.proced_postin) {
        this.ngxSmartModalService.getModal('bulkUploadInfo').open();
        this.ngxSmartModalService.setModalData(stepper, 'bulkUploadInfo');
      } else {
        this.ngxSmartModalService.getModal('bulkUploadInfoError').open();
      }
    });
  }

  chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
      var myChunk = myArray.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return tempArray;
  }


  submitBulkUpload(stepper) {
    this.process = true;
    this.finalArrayCons = [{
      'bth_issued_suc': [],
      'isu_dt_not_valid': [],
      'exp_dt_not_valid': [],
      'email_not_valid': [],
      'cet_code_not_valid': [],
      'crs_code_not_valid': [],
      'stu_not_exist': [],
      'stu_alien': [],
      'cert_with_block': [],
      'bal_low': [],
      'cert_exist': [],
      'start_dt_not_valid': [],
      'end_dt_not_valid': [],
      'block_not_valid': []
    }
    ];
    this.errorDetails = [];
    this.fail_count = 0;
    var result = this.chunkArray(this.certificatesList, 200);

    Promise.all(result).then(() => {
      for (let i = 0; i < result.length; i++) {
        this.certiService.bulkCertificateCreate(result[i]).subscribe(
          data => {
            this.resBulkData = data;
            for (let j = 0; j < this.resBulkData['new_err_list'].length; j++) {
              this.errorDetails.push(this.resBulkData['new_err_list'][j]);
            }
            this.fail_count = this.fail_count + this.resBulkData.fail_count;
            if (i === result.length - 1) {
              var checkErrArray = [
                'bth_issued_suc',
                'isu_dt_not_valid',
                'exp_dt_not_valid',
                'email_not_valid',
                'cet_code_not_valid',
                'crs_code_not_valid',
                'stu_not_exist',
                'stu_alien',
                'cert_with_block',
                'bal_low',
                'cert_exist',
                'start_dt_not_valid',
                'end_dt_not_valid',
                'block_not_valid',
              ];
              for (var errorKey = 0; errorKey < this.errorDetails.length; errorKey++) {
                if (checkErrArray.indexOf(this.errorDetails[errorKey][2])) {
                  this.finalArrayCons[0][this.errorDetails[errorKey][2]].push({ 'email': this.errorDetails[errorKey][0], 'cert_code': this.errorDetails[errorKey][1] });
                }
              }
              this.arrayOfKeys = Object.keys(this.finalArrayCons[0]);
              this.process = false;
              this.secondFormGroup.controls['secondCtrl'].setValue('true');
              this.ngxSmartModalService.getModal('bulkUploadInfo').close();
              stepper.next();
            }
            if (this.fail_count == 0) {
              this.process = false;
              this.thirdFormGroup.controls['thirdCtrl'].setValue('true');
              this.common.openSnackBar('certificate_added_successfully', 'Close');
            }
          }
        );
      }
    });
    // this.certiService.bulkCertificateCreate(this.certificatesList).subscribe(
    //   data => {
    //     this.resBulkData = data;
    //     this.process = false;
    //     this.secondFormGroup.controls['secondCtrl'].setValue('true');
    //     this.ngxSmartModalService.getModal('bulkUploadInfo').close();
    //     stepper.next();
    //     if (this.resBulkData.status === 'Completed') {
    //       this.thirdFormGroup.controls['thirdCtrl'].setValue('true');
    //       this.common.openSnackBar('certificate_added_successfully', 'Close');
    //     }
    //   },
    //   err => {
    //     this.process = false;
    //     this.common.openSnackBar('some_error_occurred', 'Close');
    //   }
    // );
  }

  downloadSampleExcel() {
    this.csvdata = [
      'EMAIL (REQUIRED) (Enter the student email)',
      'CERTIFICATE /COURSE CODE (REQUIRED) (Enter the code generated automatically by the system when the Certificate/ Course was created. It can be found in the Edit page of the Certificate/ Course)',
      'ACHIEVEMENT CERTIFICATE NUMBER (Enter the achievement certificate number and it should unique)',
      'EXPIRE DATE (YYYY-MM-DD)',
      'TESTIMONIAL (Enter your feedbacks without using comma symbol)',
      'ISSUE DATE (REQUIRED) (YYYY-MM-DD)',
      'START DATE (YYYY-MM-DD)',
      'END DATE (YYYY-MM-DD)',
      'RELATED CERTIFICATE CODE (If you want to relate the Course with a Certificate then please enter the code generated automatically by the system when the Certificate was created. It can be found in the Edit page of the Certificate)',
      'SOCIAL MEDIA SHARING (yes/no)',
      'POST IN BLOCKCHAIN (REQUIRED) (yes/no)',
      'BLOCKCHAIN (REQUIRED) (Enter blockchain number) (0-EthereumTest / 1-Ethereum / 2-Hyperledger / 3-Alastria / 4-Oracle)',
      'EVIDENCE (You can enter multiple evidence separated by single space)',
      'EVIDENCE LABEL(You can enter multiple evidence labels respective to evidence)',
      'CANNED MESSAGE ID (REQUIRED)'
    ];
    const parsedResponse = this.csvdata;
    const blob = new Blob([parsedResponse], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const filename = 'Certificate_' + Date.now() + '.csv';
    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

  reset() {
    this.studentUpload = new FormData();
    this.certificatesList = [];
    this.dataSource = new MatTableDataSource<Element>(this.certificatesList);
    this.percentDone = 0;
    this.fileName = '';
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
  }

  delete(index, stepper) {
    this.certificatesList.splice(index, 1);
    this.common.openSnackBar('certificate_deletion_successfully', 'Close');
    this.dataSource = new MatTableDataSource<Element>(this.certificatesList);
    if (this.certificatesList.length === 0) {
      stepper.selectedIndex = 0;
      this.reset();
    }
  }

  deleteAll() {
    this.certificatesList = [];
    this.dataSource = new MatTableDataSource<Element>(this.certificatesList);
    this.common.openSnackBar('certificate_deletion_successfully', 'Close');
    this.reset();
  }
}

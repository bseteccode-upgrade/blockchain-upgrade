/*
 * File : student-upload.component.ts
 * Use: Bulk Student details upload
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { StudentService } from '../services/student.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { async } from 'q';
@Component({
  selector: 'app-student-upload',
  templateUrl: './student-upload.component.html',
  styleUrls: ['./student-upload.component.css']
})

export class StudentUploadComponent implements OnInit {
  fileName: any;
  csvdata: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = false;
  studentUpload = new FormData();
  percentDone = 0;
  displayedColumns = ['Name', 'Courses', 'Certificate', 'EmailAddress', 'Action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  studentList: any = [];
  dataSource = new MatTableDataSource<Element>(this.studentList);
  selection = new SelectionModel<any>(true, []);
  process = false;
  uploadedFileName = '';
  resBulkData: any = [];
  fail_count = 0;
  errorDetails: any = [];
  finalArrayCons: any = [{
    'email_not_valid': [],
    'student_exist': [],
    'f_name_required': [],
    'stuid_uniqe': [],
    'enter_valid_phonenumber': [],
    'dob_not_valid': [],
    'l_name_required': [],
    'zip_numeric': [],
    'unkown_err': []
  }];
  arrayOfKeys;
  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private stdServide: StudentService,
    private common: CommonService
  ) { }

  ngOnInit() {
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
    this.studentList = [];
    this.percentDone = 0;
    this.firstFormGroup.controls['firstCtrl'].reset();
    const file: File = e.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (fileExtension === 'csv' || fileExtension === 'CSV') {
      if (file.size < 3072000) {
        this.studentUpload.append('file', file, file.name);
        this.studentUpload.append('user', this.apiService.user.id);
        this.stdServide.bulkUpload(this.studentUpload).subscribe(event => {
          e.target.value = '';
          this.firstFormGroup.controls['firstCtrl'].setValue(fileName);
          this.uploadedFileName = fileName;
          this.studentList = event['body'];
          this.dataSource = new MatTableDataSource<Element>(this.studentList);
          this.studentUpload = new FormData();
          if (event.type === HttpEventType.UploadProgress) {
            this.percentDone = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            if (typeof this.studentList === 'object') {
              if (this.studentList.length > 0) {
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
        }, err => {
          this.firstFormGroup.controls['firstCtrl'].setValue('');
          this.common.openSnackBar('file_have_no_data', 'Close');
          return false;
        });
      } else {
        this.common.openSnackBar('file_size_more', 'Close');
      }
    } else {
      this.common.openSnackBar('invalid_file_format', 'Close');
    }
  }

  reset() {
    this.studentUpload = new FormData();
    this.studentList = [];
    this.dataSource = new MatTableDataSource<Element>(this.studentList);
    this.percentDone = 0;
    this.uploadedFileName = '';
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
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

  bulkCreate(stepper) {
    this.process = true;
    var result = this.chunkArray(this.studentList, 200);
    this.finalArrayCons = [{
      'email_not_valid': [],
      'student_exist': [],
      'f_name_required': [],
      'stuid_uniqe': [],
      'enter_valid_phonenumber': [],
      'dob_not_valid': [],
      'l_name_required': [],
      'zip_numeric': [],
      'unkown_err': []
    }];
    this.errorDetails = [];
    this.fail_count = 0;

    Promise.all(result).then(() => {
      for (let i = 0; i < result.length; i++) {
        this.stdServide.bulkCreateWait(result[i]).then(
          data => {
            this.resBulkData = data;
            setTimeout(() => {
              for (let j = 0; j < this.resBulkData['new_err_list'].length; j++) {
                this.errorDetails.push(this.resBulkData['new_err_list'][j]);
              }
            }, 1);
            this.fail_count = this.fail_count + this.resBulkData.fail_count;
            if (i === result.length - 1) {
              var checkErrArray = [
                'email_not_valid',
                'student_exist',
                'f_name_required',
                'stuid_uniqe',
                'enter_valid_phonenumber',
                'dob_not_valid',
                'l_name_required',
                'zip_numeric',
                'unkown_err'
              ];
              setTimeout(() => {
                for (var errorKey = 0; errorKey < this.errorDetails.length; errorKey++) {
                  this.finalArrayCons[0][this.errorDetails[errorKey][1]].push({ 'email': this.errorDetails[errorKey][0], 'cert_code': this.errorDetails[errorKey][1] });
                }
                this.arrayOfKeys = Object.keys(this.finalArrayCons[0]);
                this.process = false;
                this.secondFormGroup.controls['secondCtrl'].setValue('true');
                stepper.next();
              }, 1000);
            }
            if (this.fail_count == 0) {
              this.thirdFormGroup.controls['thirdCtrl'].setValue('true');
              this.common.openSnackBar('student_add_successful', 'Close');
            }
          }
        );
      }
    });
    // this.stdServide.bulkCreate(this.studentList).subscribe(
    //   data => {
    //     this.resBulkData = data;
    //     if (this.resBulkData.status === 'Completed') {
    //       this.process = false;
    //       this.secondFormGroup.controls['secondCtrl'].setValue('true');
    //       this.thirdFormGroup.controls['thirdCtrl'].setValue('true');
    //       stepper.next();
    //       this.common.openSnackBar('student_add_successful', 'Close');
    //     } else {
    //       this.process = false;
    //       this.secondFormGroup.controls['secondCtrl'].setValue('true');
    //       stepper.next();
    //       this.common.openSnackBar('some_error_occurred', 'Close');
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
      'FIRST NAME (REQUIRED) (Enter the student first name)',
      'LAST NAME (REQUIRED) (Enter the student last name)',
      'EMAIL (REQUIRED) (Enter the student email)',
      'GENDER (M/F)',
      'PHONE',
      'DATE OF BIRTH (YYYY-MM-DD)',
      // 'ADDRESS',
      // 'CITY',
      // 'STATE',
      // 'ZIPCODE',
      // 'COUNTRY',
      'STUDENT ID (REQUIRED) (Enter the student ID and it should unique)',
      'IMAGE URL (Enter the valid image url)',
      'Group Name (Enter new or existing group name)'
    ];
    const parsedResponse = this.csvdata;
    const blob = new Blob([parsedResponse], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const filename = 'Student_' + Date.now() + '.csv';
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

  delete(email, stepper) {
    const index = this.studentList.findIndex(e => e.email === email);
    if (index !== -1) {
      this.studentList.splice(index, 1);
      this.common.openSnackBar('deletion_successful', 'Close');
      this.dataSource = new MatTableDataSource<Element>(this.studentList);
      if (this.studentList.length === 0) {
        stepper.selectedIndex = 0;
        this.reset();
      }
    }
  }
}

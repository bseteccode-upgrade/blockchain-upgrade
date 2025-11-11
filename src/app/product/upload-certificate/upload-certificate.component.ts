import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { CertificateService } from '../services/certificate.service';
import { ProductService } from '../../product/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-certificate',
  templateUrl: './upload-certificate.component.html',
  styleUrls: ['./upload-certificate.component.css']
})
export class UploadCertificateComponent implements OnInit {
  fileName: any;
  csvdata: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;
  certificateUpload = new FormData();
  certificatesList: any = [];
  percentDone = 0;
  process = false;
  resBulkData: any = [];
  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    private common: CommonService,
    private certiService: CertificateService,
    private productService: ProductService,
    private router: Router
  ) {
    this.productService.productMatrix();
  }

  displayedColumns = ['batchid', 'certiNumber', 'designation', 'name', 'country', 'expDate', 'issueDate', 'transport', 'Action'];
  // dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<Element>(this.certificatesList);
  selection = new SelectionModel<Element>(true, []);

  ngOnInit() {
    // setTimeout(() => {
    //   if (this.productService.matrixCount.wallet < 10) {
    //     this.common.openSnackBar('dont_have_privillege', 'Close');
    //     this.router.navigate(['/signin']);
    //   }
    // }, 1000);
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
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
    const file: File = e.target.files[0];
    this.reset();
    // get file name from uploaded file
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

    if (fileExtension === 'csv') {
      this.certificateUpload.append('file', file, file.name);
      this.certificateUpload.append('user', this.apiService.user.id);
      this.certiService.uploadCSV(this.certificateUpload).subscribe(event => {
        e.target.value = '';
        this.firstFormGroup.controls['firstCtrl'].setValue(file.name);
        this.certificatesList = event['body'];
        this.dataSource = new MatTableDataSource(this.certificatesList);
        this.certificateUpload = new FormData();
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.common.openSnackBar('file_upload_successful', 'Close');
        }
      });
    } else {
      this.common.openSnackBar('invalid_file_format', 'Close');
    }
    return false;
  }

  secondButton(stepper) {
    this.process = true;
    this.certiService.bulkCreate(this.certificatesList).subscribe(
      data => {
        this.resBulkData = data;
        if (this.resBulkData.status === 'Completed') {
          this.process = false;
          this.secondFormGroup.controls['secondCtrl'].setValue('true');
          stepper.next();
          this.common.openSnackBar('certificate_added_successfully', 'Close');
        } else {
          this.process = false;
          this.secondFormGroup.controls['secondCtrl'].setValue('true');
          stepper.next();
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      },
      err => {
        this.process = false;
        this.common.openSnackBar('some_error_occurred', 'Close');
      }
    );
  }

  downloadSampleExcel() {
    this.csvdata = [
      'CERTIFIER NAME',
      'CERTIFIER DESIGNATION',
      'CERTIFIED COUNTRY (REQUIRED)',
      'CERTIFICATE NUMBER',
      'DESCRIPTION',
      'CERTIFIED DATE (YYYY-MM-DD) (REQUIRED)',
      'EXPIRY DATE (YYYY-MM-DD)',
      'IN BATCH ID (REQUIRED) - (Enter multiple In Batch ID with comma separated)',
      'OUT BATCH ID - (Enter multiple Out Batch ID with comma separated)',
      'SHIPPING',
      'TRANSPORT',
      'MANUFACTURE DATE (YYYY-MM-DD) (REQUIRED)',
      'WEIGHT',
      'CATEGORY',
      'GRADE',
      'TYPE OF PACKING',
      'MINIMUM SHELL LIFE',
      'STORAGE CONDITION',
      'PROCESSING PLANT'
    ];
    const parsedResponse = this.csvdata;
    const blob = new Blob([parsedResponse], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const filename = 'Activity_' + Date.now() + '.csv';
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
    this.certificateUpload = new FormData();
    this.certificatesList = [];
    this.dataSource = new MatTableDataSource<Element>(this.certificatesList);
    this.percentDone = 0;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
  }

  delete(index) {
    this.certificatesList.splice(index, 1);
    this.common.openSnackBar('certificate_deletion_successfully', 'Close');
    this.dataSource = new MatTableDataSource<Element>(this.certificatesList);
  }

  deleteAll() {
    this.certificatesList = [];
    this.dataSource = new MatTableDataSource<Element>(this.certificatesList);
    this.common.openSnackBar('certificate_deletion_successfully', 'Close');
  }
}

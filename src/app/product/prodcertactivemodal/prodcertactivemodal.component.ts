import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-prodcertactivemodal',
  templateUrl: './prodcertactivemodal.component.html',
  styleUrls: ['./prodcertactivemodal.component.css']
})
export class ProdcertactivemodalComponent implements OnInit {
  reasonForm: FormGroup;
  errorMsg: string;
  errorMsgArr = [];
  resActive: any;
  isDisable = false;
  constructor(
    public formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProdcertactivemodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private certiService: CertificateService,
    public common: CommonService
  ) {
    this.reasonForm = this.formbuilder.group({
      'reason': [null]
    });
  }

  ngOnInit() {
  }

  reasonFormSubmit(formData: any) {
    this.isDisable =  true;
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.reasonForm.valid) {
      formData['reason'] = formData.reason;
      formData['product_certificate_id'] = this.data.id;
      formData['status'] = this.data.status;
      this.certiService.updateDeactiveProduct(formData).subscribe(data => {
        this.resActive = data;
        if (this.resActive.msg) {
          this.common.openSnackBar(this.resActive.msg, 'Close');
        } else {
          this.common.openSnackBar(this.resActive.msg, 'Close');
        }
        this.isDisable =  false;
        this.dialogRef.close(true);
      });
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

}

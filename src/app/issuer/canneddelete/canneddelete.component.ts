import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { StudentService } from '../services/student.service';
import { CommonService } from '../../service/common.service';

@Component({
  selector: 'app-canneddelete',
  templateUrl: './canneddelete.component.html',
  styleUrls: ['./canneddelete.component.css']
})
export class CanneddeleteComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CanneddeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public stdService: StudentService,
    public common: CommonService
  ) {
  }

  ngOnInit() {
    console.log(this.data);
  }

  onSure() {
    this.stdService.deleteCannedMsg(this.data.id).subscribe(data => {
      this.dialogRef.close({result: 'yes', id: this.data.id});
    });
  }

  onCancel() {
    this.dialogRef.close({result: 'no', id: this.data.id});
  }

}

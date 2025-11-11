import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CertificateService } from '../services/certificate.service';
import { CanneddeleteComponent } from '../canneddelete/canneddelete.component';

@Component({
  selector: 'app-new-cannedmessage',
  templateUrl: './new-cannedmessage.component.html',
  styleUrls: ['./new-cannedmessage.component.css']
})
export class NewCannedmessageComponent implements OnInit {
  cannedDatas: any = [];
  resDeleteData: any;
  process = false;
  constructor(
    public certService: CertificateService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.process = true;
    this.getCannedMsgList();
  }

  getCannedMsgList() {
    this.certService.getCannedMessageAll().subscribe(res => {
      this.process = false;
      this.cannedDatas = res;
    });
  }

  onDelete(id) {
    const dialogRef = this.dialog.open(CanneddeleteComponent, {
      data: {
        id: id
      }
    });
    dialogRef.afterClosed().subscribe(resResult => {
      this.resDeleteData = resResult;
      if (this.resDeleteData.result == 'yes') {
        this.process = true;
        this.getCannedMsgList();
      }
    });
  }

}

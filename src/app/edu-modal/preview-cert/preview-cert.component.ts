import { Component, OnInit, Inject } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-preview-cert',
  templateUrl: './preview-cert.component.html',
  styleUrls: ['./preview-cert.component.css']
})
export class PreviewCertComponent implements OnInit {
  appName = env.project_name;
  badgeDetail: any = [];
  progressGif = env.progressGif;

  constructor(
    public dialogRef: MatDialogRef<PreviewCertComponent>,
    public domSanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.badgeDetail = this.data.details;
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }

  onCancel() {
    this.dialogRef.close({ result: true, is_Deleted: false });
  }

}

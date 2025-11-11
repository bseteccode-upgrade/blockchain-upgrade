import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-badge',
  templateUrl: './preview-badge.component.html',
  styleUrls: ['./preview-badge.component.css']
})
export class PreviewBadgeComponent implements OnInit {
  badgeDetail: any = [];
  userDetails = JSON.parse(localStorage.getItem('user_details'));

  constructor(
    public dialogRef: MatDialogRef<PreviewBadgeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    console.log(this.userDetails);
    this.badgeDetail = this.data.details;
  }

  onCancel() {
    this.dialogRef.close({ result: true, is_Deleted: false });
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }

}

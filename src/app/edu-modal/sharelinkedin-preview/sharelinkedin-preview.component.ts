import { Component, OnInit, Inject } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-sharelinkedin-preview',
  templateUrl: './sharelinkedin-preview.component.html',
  styleUrls: ['./sharelinkedin-preview.component.css']
})
export class SharelinkedinPreviewComponent implements OnInit {
  appName = env.project_name;
  appSite = env.baseUrl;
  badgeDetail: any = [];

  constructor(
    public dialogRef: MatDialogRef<SharelinkedinPreviewComponent>,
    public domSanitizer: DomSanitizer,
    public apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.badgeDetail = this.data.details;
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }

  onCancel() {
    this.dialogRef.close({ result: true, is_Deleted: false });
  }

  socialShare(url) {
    localStorage.setItem('firstTimeShare', 'true')
    this.apiService.updateStudentShare().subscribe(
      res => {
      console.log(res)
    })
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank');
  }

}

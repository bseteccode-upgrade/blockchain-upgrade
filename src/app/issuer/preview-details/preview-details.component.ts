import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-preview-details',
  templateUrl: './preview-details.component.html',
  styleUrls: ['./preview-details.component.css']
})
export class PreviewDetailsComponent implements OnInit {
  details: any = [];
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  orgImage = this.userDetails.university_avatar;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public domSanitizer: DomSanitizer,
    public ngxSmartModalService: NgxSmartModalService,
  ) { }

  ngOnInit() {
    this.details = this.data.details;
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public actDetail: any,
    public domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
  }

  convertStyle(content) {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }

}

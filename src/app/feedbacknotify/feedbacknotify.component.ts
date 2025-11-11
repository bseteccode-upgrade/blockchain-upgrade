import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedbacknotify',
  templateUrl: './feedbacknotify.component.html',
  styleUrls: ['./feedbacknotify.component.css']
})
export class FeedbacknotifyComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FeedbacknotifyComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close({result: 'no'});
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-post-confirmation',
  templateUrl: './post-confirmation.component.html',
  styleUrls: ['./post-confirmation.component.css']
})
export class PostConfirmationComponent implements OnInit {
  totalAmount: any = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PostConfirmationComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log(this.data);
  }

}

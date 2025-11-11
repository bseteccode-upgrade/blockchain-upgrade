import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CommonService {
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) { }

  openSnackBar(message: string, action?: string) {
    this.translate.get(message).subscribe((res: string) => {
      this.snackBar.open(res, action, {
        duration: 2000,
      });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { environment as env } from '../../../environments/environment';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-planapi',
  templateUrl: './planapi.component.html',
  styleUrls: ['./planapi.component.css']
})
export class PlanapiComponent implements OnInit {
  apiUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://certtun.vottun.com:8081/vottun-api/vottun-api?domain=' + env.baseUrl);
  constructor(
    public apiService: ApiService,
    private common: CommonService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if (!this.apiService.user.profile_details.allow_api) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
    }, 1500);
  }

}

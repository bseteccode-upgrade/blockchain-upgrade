/*
 * File : commonplanalert.component.ts
 * Use: Component creating for plan purchase option
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-commonplanalert',
  templateUrl: './commonplanalert.component.html',
  styleUrls: ['./commonplanalert.component.css']
})
export class CommonplanalertComponent implements OnInit {
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private router: Router,
    public apiService: ApiService
  ) { }

  ngOnInit() {
  }

  onClosePopup() {
    this.ngxSmartModalService.getModal('planPopupInfo').close();
    this.router.navigate(['students']);
  }

  onClose() {
    this.ngxSmartModalService.getModal('planPopupInfo').close();
  }

}

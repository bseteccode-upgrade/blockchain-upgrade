/*
 * File : user-verify-popup.component.ts
 * Use: Common User verification popup from mail redirect
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-verify-popup',
  templateUrl: './user-verify-popup.component.html',
  styleUrls: ['./user-verify-popup.component.css']
})
export class UserVerifyPopupComponent implements OnInit {

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onClosePopup() {
    this.ngxSmartModalService.getModal('planPopupInfo').close();
    this.router.navigate(['students']);
  }

}

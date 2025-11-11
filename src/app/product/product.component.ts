import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../service/api.service';

import { ISlimScrollOptions } from './../ngx-slimscroll/classes/slimscroll-options.class';
import { SlimScrollState, ISlimScrollState } from './../ngx-slimscroll/classes/slimscroll-state.class';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  options: ISlimScrollOptions;
  secondOptions: ISlimScrollOptions;
  slimScrollState = new SlimScrollState();
  hideSideNav: any = false;
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    this.options = {
      barBackground: '#fcfcfc',
      gridBackground: '#f8f8f8',
      barBorderRadius: '10',
      barWidth: '6',
      gridWidth: '0',
      alwaysVisible: true
    };
    this.apiService.displaySideNav.subscribe(updated => {
      this.hideSideNav = updated;
      this.cdr.detectChanges();
    });
   }

  ngOnInit() {
  }

  scrollChanged($event: ISlimScrollState) {
    this.slimScrollState = $event;
  }

  onActivate(e) {
    window.scroll(0, 0);
  }

}

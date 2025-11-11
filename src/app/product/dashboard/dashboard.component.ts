/*
 * File : dashboard.component.ts
 * Use: dashboard page for supply chain user
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public productService: ProductService
  ) {
  }

  ngOnInit() {
    this.productService.productMatrix();
  }

}

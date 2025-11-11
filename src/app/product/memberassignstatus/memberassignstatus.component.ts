import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import { ProductService } from '../services/product.service';
import * as moment from 'moment';

@Component({
  selector: 'app-memberassignstatus',
  templateUrl: './memberassignstatus.component.html',
  styleUrls: ['./memberassignstatus.component.css']
})
export class MemberassignstatusComponent implements OnInit {
  process = false;
  productList: any = [];
  dataSource = new MatTableDataSource<Element>(this.productList);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageEvent: PageEvent;
  displayedColumns = ['created_date', 'workflow', 'step', 'step_name', 'actions'];
  searchForm: FormGroup;
  minendDate: any;
  constructor(
    public productService: ProductService,
    public formbuilder: FormBuilder,
    private common: CommonService,
    public apiService: ApiService,
    private certiService: CertificateService,
  ) {
    this.searchForm = this.formbuilder.group({
      'workflow_id': [null],
      'start_date': [null],
      'end_date': [null],
      'step': [null]
    });
  }

  ngOnInit() {
    this.getProductList();
  }

  submitSearchForm(searchData) {
    this.getProductList(searchData, false, true, 1);
  }

  getProductList(searchData: any = {}, reset = false, search = false, page = 1) {
    this.process = true;
    const params = new URLSearchParams();
    searchData['page'] = page;
    if (searchData !== []) {
      for (const key in searchData) {
        if (searchData[key]) {
          params.set(key, searchData[key]);
        }
      }
    }
    this.certiService.getWFAssingedList(params.toString()).subscribe(data => {
      this.process = false;
      this.productList = data;
      this.dataSource = new MatTableDataSource<Element>(this.productList.results);
      if (search) {
        this.paginator.pageIndex = 0;
      }
    }, err => {
      this.process = false;
    });
  }
  /**
   * @description product actvity data get based on the formdate and page event
   * @param formData - enetered form data
   * @param event - page event
   */
  onPageChange(formData, event) {
    this.pageEvent = event;
    this.getProductList(formData, false, false, event.pageIndex + 1);
  }

  changeDateEvent(e, field) {
    this.searchForm.controls[field].setValue(moment(e.value, 'L', true).format('YYYY-MM-DD'));
    if (field === 'start_date') {
      this.minendDate = moment(moment(e.value, 'L', true).format('YYYY-MM-DD')).add(1, 'day').format('YYYY-MM-DD');
      this.refreshToDate();
    }
  }

  refreshFromDate() {
    this.searchForm.controls['start_date'].setValue(null);
    this.searchForm.markAsTouched();
    this.minendDate = '';
    return false;
  }

  refreshToDate() {
    this.searchForm.controls['end_date'].setValue(null);
    this.searchForm.markAsTouched();
    return false;
  }

}

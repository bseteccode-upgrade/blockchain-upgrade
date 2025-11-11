import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { environment as env } from '../../../environments/environment';
import { MoocService } from '../services/mooc.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-mooc-list',
  templateUrl: './mooc-list.component.html',
})
export class MoocListComponent implements OnInit {
  displayedColumns = ['mooc_name', 'course_name', 'certi_number', 'issue_date', 'expire_date', 'website', 'certificate', 'actions'];
  certificates: any = [];
  baseUrl = env.baseUrl;
  searchData: any = '';
  dataSource = new MatTableDataSource<Element>(this.certificates);
  searchForm: FormGroup;
  process: boolean;
  advanceSearch = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private moocService: MoocService,
    private apiService: ApiService,
    private common: CommonService,
    public ngxSmartModalService: NgxSmartModalService,
    public formbuilder: FormBuilder
  ) {
    this.searchForm = this.formbuilder.group({
      'title': [null],
      'degree': [null],
      'code': [null],
      'search': [null]
    });
  }

  ngOnInit() {
    this.getCertificate(this.searchData);
  }

  getCertificate(searchData?: any) {
    this.process = true;
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key]) {
        params.set(key, searchData[key]);
      }
    }
    this.moocService.getCertificateList(params.toString()).subscribe(
      data => {
        this.process = false;
        this.certificates = data;
        this.dataSource = new MatTableDataSource<Element>(this.certificates);
        this.dataSource.paginator = this.paginator;
      },
      err => {
        this.process = false;
      }
    );
  }

  delete(id) {
    this.moocService.delete(id).subscribe(
      data => {
        this.common.openSnackBar('certificate_deletion_successfully', 'Close');
        this.ngxSmartModalService.getModal('myModal').close();
        this.getCertificate();
      },
      err => {
        this.common.openSnackBar('some_error_occurred', 'Close');
        this.ngxSmartModalService.getModal('myModal').close();
      }
    );
  }
}

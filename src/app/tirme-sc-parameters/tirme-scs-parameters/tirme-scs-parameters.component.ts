/*
 * File : product.component.ts
 * Use: add. edit product details
 * Copyright : vottun 2019
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TirmeSCParametersService } from '../services/tirme-sc-parameters.service';
import { CommonService } from '../../service/common.service';
import { ApiService } from '../../service/api.service';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment as env } from '../../../environments/environment';
import { resolve } from 'url';

@Component({
  selector: 'app-products',
  templateUrl: './tirme-scs-parameters.component.html',
  styleUrls: ['./tirme-scs-parameters.component.css']
})
export class TirmeSCSParametersComponent implements OnInit {
  items2: any;
  params_ids = [];
  process = false;
  userDetails = JSON.parse(localStorage.getItem('user_details'));

  constructor(
    public formbuilder: FormBuilder,
    private common: CommonService,
    private tirmeService: TirmeSCParametersService,
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService,
  ) {
  }

  ngOnInit() {
    if (this.userDetails.userType === '5' && !this.userDetails.pages.add_product) {
      this.common.openSnackBar('dont_have_privillege', 'Close');
      this.router.navigate(['/signin']);
    }
    this.getProduct();

    
    console.log(this.params_ids);

  }

  getProduct() {
    this.tirmeService.getCalculations(this.userDetails.profile_details["auth_key"]).subscribe(data => {
      // console.log(JSON.parse(JSON.stringify(data)).results);
      this.items2 = data;
      console.log(JSON.parse(JSON.stringify(data)).results);
      this.items2 = JSON.parse(JSON.stringify(data)).results;
      for (let i of this.items2) {
        this.params_ids.push(i.smart_contract_parameter);
      }
     });     
  }


  updateSCParameters = function() {
    this.process = true;
    for (let i of this.params_ids) {
     
      let my = document.getElementById(i);
      console.log(document.getElementById(i));
      console.log(my["defaultValue"]);
      let apik = this.userDetails.profile_details["auth_key"];
      apik = String(apik);
      console.log(apik);
      this.tirmeService.updateSCParameters(my["defaultValue"] , apik , {
      "smart_contract_parameter": my.id,
      "value_smart_contract_parameter": my["value"]
      }).subscribe(data => {
      this.process = false;
      console.log(data);
      })
    }
  }

}

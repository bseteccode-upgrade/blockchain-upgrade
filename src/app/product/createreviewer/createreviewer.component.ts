/*
 * File : createreviewer.component.ts
 * Use: create/edit reviewer user
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { TeamService } from '../../service/team.service';
import { CommonService } from '../../service/common.service';
import { ProductService } from '../../product/services/product.service';
import { dragula, DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-createreviewer',
  templateUrl: './createreviewer.component.html',
  styleUrls: ['./createreviewer.component.css']
})
export class CreatereviewerComponent implements OnInit {

  workflowForm: FormGroup;
  allcount: any = 0;
  fieldData: any = [];
  findStep: any;
  responseData: any = [];
  resWFData: any = [];
  redirectToConfigure: any;
  workflowid: any;
  subs = new Subscription();

  errorMsg: string;
  errorMsgArr: any = [];
  disfield = false;

  MANY_ITEMS = 'dragContainer';

  @ViewChild('workflowFormGen') workflowFormGen: FormGroupDirective;
  constructor(
    private formbuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private dragulaService: DragulaService,
  ) {
    this.workflowid = this.route.snapshot.paramMap.get('userid');
    this.createForm();

    this.dragulaService.createGroup(this.MANY_ITEMS, {
      revertOnSpill: true,
    });
  }

  ngOnInit() {
    if (this.workflowid) {
      this.productService.getWorkFlowDetail(this.workflowid).subscribe(data => {
        this.resWFData = data;
        this.createForm();
        const control = <FormArray>this.workflowForm.controls['steps'];
        const rdata = this.resWFData.steps;
        for (let j = 0; j < rdata.length; j++) {
          control.push(this.initNqCoordinators(rdata[j].step, rdata[j].role, rdata[j].user_id, rdata[j].profile_id));
        }
        this.fieldData = this.resWFData.steps;
      });
    }
  }

  createForm() {
    if (this.workflowid) {
      this.workflowForm = this.formbuilder.group({
        'workflow_id': [this.resWFData.workflow_id, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'steps': this.formbuilder.array([]),
        'type': 2
      });
    } else {
      this.workflowForm = this.formbuilder.group({
        'workflow_id': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'steps': this.formbuilder.array([this.initNqCoordinators('', '', '')]),
        'type': 2
      });
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  addFields() {
    const control = <FormArray>this.workflowForm.controls['steps'];
    control.push(this.initNqCoordinators());
  }

  removeFieldSet(index, mem = '') {
    if (mem) {
      this.allcount = this.allcount - 1;
      this.fieldData.splice(index, 1);
    }
    const control = <FormArray>this.workflowForm.controls['steps'];
    control.removeAt(index);
  }

  initNqCoordinators(step = '', role = '', user_id = '', profile_id = '') {
    return this.formbuilder.group({
      'step': [step],
      'role': [role],
      'user_id': [user_id],
      'profile_id': [profile_id]
    });
  }

  submitForm(formData) {
    let ers = '';
    if (formData.steps.length > 0) {
      for (let k = 0; k < formData.steps.length; k++) {
        formData.steps[k].user_id = formData.steps[k].user_id ? formData.steps[k].user_id : null;
        formData.steps[k].profile_id = formData.steps[k].profile_id ? formData.steps[k].profile_id : null;
        if (formData.steps[k].role.trim() === '' || formData.steps[k].role === null) {
          // ers = '2';
          formData.steps.splice(k, 1);
        }
      }
    } else {
      ers = '2';
    }
    if (ers === '2') {
      this.disfield = true;
      return false;
    } else {
      this.disfield = false;
    }
    this.errorMsgArr = [];
    this.errorMsg = '';
    if (this.workflowFormGen.form.valid) {
      if (this.workflowid) {
        this.productService.updateWorkFlow(this.workflowid, formData).subscribe(data => {
          this.responseData = data;
          if (this.findStep !== '' && this.responseData !== []) {
            this.redirectToConfigure = this.responseData.steps.find(x => x.step === this.findStep);
            this.router.navigate([`/reviewerdetail/${this.redirectToConfigure.profile_id}/${this.responseData.workflow_id}/${this.responseData.id}/${this.redirectToConfigure.step}/${this.redirectToConfigure.role}`]);
          }
        });
      } else {
        this.productService.saveWorkFlow(formData).subscribe(data => {
          this.responseData = data;
          if (this.findStep !== '' && this.responseData !== []) {
            this.redirectToConfigure = this.responseData.steps.find(x => x.step === this.findStep);
            this.router.navigate([`/reviewerdetail/${this.responseData.profile_id}/${this.responseData.workflow_id}/${this.responseData.id}/${this.redirectToConfigure.step}/${this.redirectToConfigure.role}`]);
          }
        });
      }
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  getErrorMsg(field) {
    return this.workflowForm.controls[field].hasError('required')
      || this.workflowForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

  configureStep(step, formData) {
    this.findStep = step;
    let ers = '';
    if (formData.steps[step === 0 ? step : step - 1].role.trim() === '' || formData.steps[step === 0 ? step : step - 1].role === null) {
      ers = '2';
    }
    if (ers === '2') {
      this.disfield = true;
      return false;
    } else {
      this.disfield = false;
      this.workflowFormGen.ngSubmit.emit();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.dragulaService.destroy(this.MANY_ITEMS);
  }

}


/*
 * File : workflow.component.ts
 * Use: create and edit functionality
 * Copyright : vottun 2019
 */
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../product/services/product.service';
import { dragula, DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit, OnDestroy {
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

  MANY_ITEMS = 'dragContainerwf';
  saveOnly = false;
  buttonDisabled = false;

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
    // if (this.workflowid === null || this.workflowid === '') {
      dragulaService.createGroup('HANDLES', {
        revertOnSpill: true,
        moves: (el, container, handle) => {
          return handle.classList.contains('handle');
        }
      });
    // }
  }

  ngOnInit() {
    if (this.workflowid) {
      this.productService.getWorkFlowDetail(this.workflowid).subscribe(data => {
        this.resWFData = data;
        this.createForm();
        const control = <FormArray>this.workflowForm.controls['steps'];
        const rdata = this.resWFData.steps;
        for (let j = 0; j < rdata.length; j++) {
          control.push(this.initNqCoordinators(rdata[j].step, rdata[j].role, rdata[j].is_qc, rdata[j].user_id, rdata[j].profile_id, rdata[j].parent, rdata[j].step_id));
        }
        this.fieldData = this.resWFData.steps;
      });
    }
  }

  createForm() {
    if (this.workflowid) {
      this.workflowForm = this.formbuilder.group({
        'workflow_id': [this.resWFData.workflow_id, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'multiple_workflow_flag': [this.resWFData.multiple_workflow_flag],
        'steps': this.formbuilder.array([]),
      });
    } else {
      this.workflowForm = this.formbuilder.group({
        'workflow_id': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
        'multiple_workflow_flag': [false],
        'steps': this.formbuilder.array([this.initNqCoordinators('', '', false, '')]),
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

  initNqCoordinators(step = '', role = '', is_qc = false, user_id = '', profile_id = '', parent = null, step_id = null) {
    return this.formbuilder.group({
      'step': [step],
      'role': [role],
      'is_qc': [is_qc],
      'user_id': [user_id],
      'profile_id': [profile_id],
      'parent': [parent],
      'step_id': [step_id]
    });
  }

  submitForm(formData) {
    this.buttonDisabled = true;
    let ers = '';
    if (formData.steps.length > 0) {
      var stepsArr = [];
      for (let k = 0; k < formData.steps.length; k++) {
        formData.steps[k].user_id = formData.steps[k].user_id ? formData.steps[k].user_id : null;
        formData.steps[k].profile_id = formData.steps[k].profile_id ? formData.steps[k].profile_id : null;
        if (formData.steps[k].role.trim() != "" && formData.steps[k].role !== null) {
          // ers = '2';
          stepsArr.push(formData.steps[k]);
          // formData.steps.splice(k, 1);
        }
      }
      formData.steps = stepsArr.length >= 1 ? stepsArr : formData.steps;
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
          this.buttonDisabled = false;
          this.responseData = data;
          if (this.findStep != 0 && this.findStep !== '' && this.responseData !== []) {
            this.redirectToConfigure = this.responseData.steps.find(x => x.step === this.findStep);
            this.router.navigate([`/workflowcreate/${this.redirectToConfigure.profile_id}/${this.responseData.id}/${this.redirectToConfigure.step}`]);
          } else {
            if (this.saveOnly) {
              this.router.navigate([`workflowlist`]);
            }
          }
        });
      } else {
        this.productService.saveWorkFlow(formData).subscribe(data => {
          this.buttonDisabled = false;
          this.responseData = data;
          if (this.findStep != 0 && this.findStep !== '' && this.responseData !== []) {
            this.redirectToConfigure = this.responseData.steps.find(x => x.step === this.findStep);
            this.router.navigate([`/workflowcreate/${this.responseData.profile_id}/${this.responseData.id}/${this.redirectToConfigure.step}`]);
          } else {
            if (this.saveOnly) {
              this.router.navigate([`workflowlist`]);
            }
          }
        });
      }
    } else {
      this.buttonDisabled = false;
      this.errorMsg = 'provide_valid_inputs';
    }
  }

  getErrorMsg(field) {
    return this.workflowForm.controls[field].hasError('required')
      || this.workflowForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
  }

  configureStep(step, formData, save = false) {
    this.saveOnly = save;
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
    // this.subs.unsubscribe();
    this.dragulaService.destroy('HANDLES');
  }

}

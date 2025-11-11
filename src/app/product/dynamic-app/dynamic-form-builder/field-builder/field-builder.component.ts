import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';

@Component({
  selector: 'field-builder',
  template: `
  <div class="col-sm-12" [formGroup]="form">
  <div class="form-group" *ngIf="field.name !== 'barcode' && field.type !== 'lnglat'">
    <h4 class="col-md-12 control-label" [attr.for]="field.label">
      {{field.label | translate}}
      <span class="text-danger" *ngIf="field.required"> *</span>
      <span *ngIf="field.type !== 'dropdownproduct' && field.type !== 'dropdownmember' && field.name === 'out_batch_0' && !field.multiline && field.type !== 'date' && field.type !== 'location' && !field.primary && field.type !== 'timestamp'" matTooltip="{{'info_about_special_character_avoid' | translate}}"
                    class="headTooltip"><i class="material-icons"> help_outline</i></span>
    </h4>
    <div class="col-md-12" [ngSwitch]="field.type">
      <textbox *ngSwitchCase="'text'" [field]="field" [form]="form"></textbox>
      <textbox *ngSwitchCase="'timestamp'" [field]="field" [form]="form"></textbox>
      <textbox *ngSwitchCase="'location'" [field]="field" [form]="form"></textbox>
      <dropdown *ngSwitchCase="'dropdown'" [field]="field" [form]="form"></dropdown>
      <textbox *ngSwitchCase="'dropdowninbatchid'" [field]="field" [form]="form"></textbox>
      <textbox *ngSwitchCase="'companyadminuser'" [field]="field" [form]="form"></textbox>
      <textbox *ngSwitchCase="'dropdownmember'" [field]="field" [form]="form"></textbox>
      <textbox *ngSwitchCase="'dropdownproduct'" [field]="field" [form]="form"></textbox>
      <textbox *ngSwitchCase="'date'" type="date" [field]="field" [form]="form"></textbox>
      <textbox *ngSwitchCase="'number'" type="number" [field]="field" [form]="form"></textbox>
      <textbox *ngSwitchCase="'mapaddress'" type="text" [field]="field" [form]="form"></textbox>
      <file *ngSwitchCase="'document'" type="file" [field]="field" [form]="form"></file>
      <file *ngSwitchCase="'productimage'" type="file" [field]="field" [form]="form"></file>
      <div class="text-danger text-left small" *ngIf="!isValid && isTouched && field.required">{{field.label | translate}} is required</div>
    </div>
  </div>
  </div>
  `,
  styleUrls: ['./field-builder.component.css']
})
export class FieldBuilderComponent implements OnInit {
  @Input() field: any;
  @Input() form: any;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  get isValid() {
    if (this.field.required) {
      return this.form.controls[this.field.name].valid;
    }
  }
  get isTouched() {
    if (this.field.required) {
      return this.form.controls[this.field.name].touched;
    }
  }

  constructor() { }

  ngOnInit() {
  }

}

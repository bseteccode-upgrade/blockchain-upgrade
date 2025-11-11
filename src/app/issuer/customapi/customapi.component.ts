/*
 * File : customapi.component.ts
 * Use: display the swagger api document
 * Copyright : vottun 2019
 */
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-customapi',
  templateUrl: './customapi.component.html',
  styleUrls: ['./customapi.component.css']
})
export class CustomapiComponent implements OnInit, AfterViewInit {

  constructor(
    private el: ElementRef
  ) {
  }

  ngAfterViewInit() {
    const ui = SwaggerUI({
      url: env.baseUrl + '/media/doc_custom.json',
      domNode: this.el.nativeElement.querySelector('.swagger-container'),
      deepLinking: true,
      presets: [
        SwaggerUI.presets.apis
      ],
    });
  }

  ngOnInit() {
  }

}

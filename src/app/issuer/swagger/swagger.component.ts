import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

import SwaggerUI from 'swagger-ui';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.css']
})
export class SwaggerComponent implements OnInit, AfterViewInit {

  constructor(
    private el: ElementRef
  ) {
  }

  ngAfterViewInit() {
    const ui = SwaggerUI({
      url: env.baseUrl + '/media/doc_credential.json',
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

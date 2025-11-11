import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-supplychainapi',
  templateUrl: './supplychainapi.component.html',
  styleUrls: ['./supplychainapi.component.css']
})
export class SupplychainapiComponent implements OnInit, AfterViewInit {

  constructor(private el: ElementRef) {  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const ui = SwaggerUI({
      url: env.baseUrl + '/media/doc_supply.json',
      domNode: this.el.nativeElement.querySelector('.swagger-container'),
      deepLinking: true,
      presets: [
        SwaggerUI.presets.apis
      ],
    });
  }

}

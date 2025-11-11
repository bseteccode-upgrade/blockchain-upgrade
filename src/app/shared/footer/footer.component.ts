import { Component, OnInit } from '@angular/core';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  appName = env.project_name;
  siteUrl = env.project_site;

  constructor() { }

  ngOnInit() {
  }

}

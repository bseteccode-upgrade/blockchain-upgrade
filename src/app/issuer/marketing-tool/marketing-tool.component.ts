import { Component, OnInit } from '@angular/core';

import { CertificateService } from '../services/certificate.service';

@Component({
  selector: 'app-marketing-tool',
  templateUrl: './marketing-tool.component.html',
  styleUrls: ['./marketing-tool.component.css']
})
export class MarketingToolComponent implements OnInit {

  marketShareContent: any = [];
  resDeleteData: any;
  process = false;
  marketShareDatas = [
    {title: 'facebook'},
    {title: 'twitter'},
    {title: 'linkedin'},
    {title: 'whatsapp'},
    {title: 'email_share'},
  ];
  constructor(
    public certService: CertificateService
  ) { }

  ngOnInit() {
    this.process = true;
    this.getCannedMsgList();
  }

  getCannedMsgList() {
    this.certService.getMarketingMsg().subscribe(res => {
      this.process = false;
      this.marketShareContent = res;
      console.log(this.marketShareContent);
    });
  }

}

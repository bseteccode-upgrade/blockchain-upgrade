import { Component, OnInit, DoCheck, Inject } from '@angular/core';
import { ApiService } from './service/api.service';
import { Location, PlatformLocation } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonService } from './service/common.service';
import { Meta, Title } from '@angular/platform-browser';
import { environment as env } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbacknotifyComponent } from './feedbacknotify/feedbacknotify.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'app';
  location: Location;
  loadAPI: Promise<any>;
  batchId = '';
  appName = env.project_name;
  resProjectData: any;
  feedbackRes: any = [];
  is_display_feedback = true;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private common: CommonService,
    location: PlatformLocation,
    private route: ActivatedRoute,
    private metaService: Meta,
    public titleService: Title,
    @Inject(DOCUMENT) private document: HTMLDocument,
    public dialog: MatDialog
  ) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        // if (ev.url === '/signin') {
        var res = ev.url.split('/');
        if (res[1] === '/signin' && (localStorage.getItem('fromqrscanned') !== null && typeof localStorage.getItem('fromqrscanned') !== 'undefined')) {
          // if (res[2] && res[2] != null && typeof res[2] !== 'undefined') {
          // localStorage.setItem('fromqrscanned', localStorage.getItem('fromqrscanned'));
          window.location.href = '/viewproduct/' + localStorage.getItem('fromqrscanned');
          // this.router.navigate(['/viewproduct', id]);
          // }
        }
      }
      if (ev instanceof NavigationEnd) {
        var resURL = ev.url.split('/');
        console.log(resURL[1]);
        if (resURL[1] !== 'securelog' && resURL[1] !== 'autologin' && resURL[1] !== 'embed' && resURL[1] !== 'viewproduct' && resURL[1] !== 'badgedetail') {
          if (localStorage.getItem('token') && localStorage.getItem('token') != null) {
            this.apiService.getOrgDocFile().subscribe(res => {
              // console.log(res);
            }, err => {
              if (localStorage.getItem('token')) {
                localStorage.clear();
                this.router.navigate(['signin']);
              }
            });
          }
        }
      }
    });
    location.onPopState(() => {
      var classes = document.body.getAttribute('class').split(' ');
      var contains = classes.indexOf('dialog-open') > -1;
      if (contains) {
        document.getElementById('bodyId').classList.remove('dialog-open');
      }
    });
    this.apiService.getLanguage().subscribe(data => {
      let languages: any = [];
      languages = data;
      const language_code = (localStorage.getItem('language_code')) ? localStorage.getItem('language_code').toLowerCase() : 'en';
      const selLang = languages.find(e => e.language_code.toLowerCase() === language_code);
      this.apiService.setLanguage(selLang);
    });
    // Load external third party js file include
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });
  }

  loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; ++i) {
      if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes('loader')) {
        isFound = true;
      }
    }

    if (!isFound) {
      this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationStart) {
          var res = ev.url.split('/');
          let dynamicScripts = [];
          if (res[1] === 'embed') {
            dynamicScripts = [
            ];
          }
          // else {
          //   dynamicScripts = [
          //     'https://desk.zoho.com/portal/api/feedbackwidget/361568000000105649?orgId=682985484&displayType=popout',
          //   ];
          // }
          for (var i = 0; i < dynamicScripts.length; i++) {
            let node = document.createElement('script');
            node.src = dynamicScripts[i];
            node.type = 'text/javascript';
            node.async = false;
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
          }
        }
      });
    }
  }

  ngOnInit() {
    const userLang = navigator.language;
    console.log(userLang);
  
    this.addMetaTag();
    this.updatePageInfo();
    // Https redirect only for demo site (demo.vottun.com)
    if (location.protocol === 'http:') {
      if (location.origin === 'http://demo.vottun.com' || location.origin === 'http://demo.vottun.com/') {
        window.location.href = location.href.replace('http', 'https');
      }
      if (location.origin === 'http://test.vottun.com' || location.origin === 'http://test.vottun.com/') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
    if (location.protocol === 'https:') {
      if (location.origin === 'https://blockeducate.vottun.com' || location.origin === 'https://blockeducate.vottun.com/') {
        window.location.href = location.href.replace('https://blockeducate.vottun.com', 'https://certtun.vottun.com');
      }
    }
    if (location.pathname === '/barcode') {
      window.location.href = location.href.replace('/barcode', '/batches');
    }

    console.log(this.is_display_feedback);
    console.log(location.pathname);
    if (location.pathname === '/badgedetail') {
      this.is_display_feedback = false;
    } else {
      this.is_display_feedback = true;
    }
  }

  addMetaTag() {
    this.titleService.setTitle(this.appName);
  }

  updatePageInfo() {
    this.apiService.initmeta().subscribe(
      (row) => {
        this.resProjectData = row;
        this.document.getElementById('appFavicon').setAttribute('href', this.resProjectData.favicon_icon);
      }
    );
  }

  ngDoCheck() {
    // Reset when storage is more than 3hours
    var hours = 3;
    var now: any = new Date().getTime();
    var setupTime: any = localStorage.getItem('setupTime');
    if (setupTime == null) {
      localStorage.setItem('setupTime', now);
    } else {
      if (now - setupTime > hours * 60 * 60 * 1000) {
        // localStorage.clear();
        localStorage.setItem('setupTime', now);
        this.apiService.logout();
      }
    }
  }


  onActivate(e) {
    window.scroll(0, 0);
    /**
     * Not upload university logo, redirect to account setting
     * */
    // setTimeout(() => {
    //   if (localStorage.getItem('token') && !this.apiService.user.university_avatar && ( this.apiService.user.register_type === '2' || this.apiService.user.register_type === '8' ) ) {
    //     this.router.navigate(['/accountsetting']);
    //     this.common.openSnackBar('please_fill_mendatory_field', 'Close');
    //     return false;
    //   }
    // }, 1000);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (localStorage.getItem('token') && !this.apiService.user.university_avatar && (this.apiService.user.register_type === '2' || this.apiService.user.register_type === '8')) {
          if (event.url !== '/accountsetting') {
            this.router.navigate(['/accountsetting']);
            this.common.openSnackBar('please_fill_mendatory_field', 'Close');
            return false;
          }
        }
        if (!event.url.includes('/productcertificate')) {
          localStorage.removeItem('activitySearchData');
        }
      }
    });
  }

  onFeedback() {
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.feedbackRes = result;
      if (this.feedbackRes.result == 'yes') {
        const dialogNotify = this.dialog.open(FeedbacknotifyComponent, {
          data: {
          }
        });
      }
    });
  }
}

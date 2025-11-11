import { Component, OnInit, Inject, DoCheck } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { DOCUMENT } from '@angular/platform-browser';
import { environment as env } from '../../../environments/environment';

declare var jQuery;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {
  user: any;
  showSidebar = true;
  currentTheme = 'dark';
  languages: any = [];
  selectedLang = 'EN';
  param = { value: 'world' };
  profileExist = false;
  hideSideNav: any = false;
  pagelogo = env.white_logo;
  constructor(public apiService: ApiService, @Inject(DOCUMENT) private document) {
    this.apiService.displaySideNav.subscribe(updated => {
      this.hideSideNav = updated;
    });
  }

  ngOnInit() {
    this.getLanguages();
  }

  ngDoCheck() {
    if (!this.profileExist) {
      if (this.apiService.user && this.apiService.user.language_id) {
        this.profileExist = true;
        this.selectedLang = this.apiService.user.language_code;
      } else {
        this.selectedLang = localStorage.getItem('language_code');
      }
    }
  }

  toggleSidebar(e) {
    // e.preventDefault();
    if (jQuery(window).width() < 991) {
      if (jQuery('body').hasClass('togglesidebar')) {
        jQuery('body').removeClass('togglesidebar');
        jQuery('body').removeClass('dynamic');
      } else {
        jQuery('body').addClass('togglesidebar');
        jQuery('body').removeClass('dynamic');
      }
    } else {
      if (jQuery('body').hasClass('togglesidebar')) {
        jQuery('body').removeClass('togglesidebar');
        jQuery('body').removeClass('dynamic');
      } else {
        jQuery('body').addClass('togglesidebar');
        jQuery('body').removeClass('dynamic');
      }
    }
  }

  handelChangeTheme(theme) {
    if (theme === 'dark') {
      this.document.getElementById('theme').href = '../assets/styles/theme-dark.css';
    } else {
      this.document.getElementById('theme').href = '../assets/styles/theme-light.css';
    }
  }

  getLanguages() {
    this.apiService.getLanguage().subscribe(data => {
      this.languages = data;
      if (this.hideSideNav) {
        jQuery('body').removeClass('togglesidebar');
        jQuery('body').addClass('dynamic');
      } else {
        jQuery('body').addClass('togglesidebar');
        jQuery('body').removeClass('dynamic');
      }
    });
  }

  selectLang(lang) {
    this.selectedLang = lang.language_code;
    this.apiService.selectLanguage(lang);
  }
}

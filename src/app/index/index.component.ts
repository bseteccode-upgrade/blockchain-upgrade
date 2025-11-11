/*
 * File : index.component.ts
 * Use: index page content and contact-us form submission
 * Copyright : vottun 2019
 */
import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ApiService } from '../service/api.service';
declare var particlesJS: any;
declare var WOW: any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', '../../assets/landing/css/bootstrap.min.css']
})
export class IndexComponent implements OnInit, AfterViewInit {
  contactUsForm: FormGroup; // initailaize
  errorMsg: string;
  successMsg: string;
  errorMsgArr = [];
  constructor(
    public formbuilder: FormBuilder,
    public apiService: ApiService) {
    this.contactUsForm = formbuilder.group({
      'first_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'last_name': [null, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'email': [null, [Validators.required, Validators.email, this.noWhitespaceValidator]],
      'phone': [null, [
        Validators.required,
        Validators.pattern('[0-9]+')  // validates input is digit
      ]],
      'message': [null, Validators.compose([Validators.required])]
    });

  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.getElementById('myHeader');
    const sticky = header.offsetTop;
    if (window.pageYOffset > sticky) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }

  ngAfterViewInit() {
    particlesJS('particles-js', {
      'particles': {
        'number': {
          'value': 150,
          'density': {
            'enable': true,
            'value_area': 700
          }
        },
        'color': {
          'value': '#ffffff',
          'opacity': 0.10
        },
        'shape': {
          'type': 'circle',
          'stroke': {
            'width': 0,
            'color': '#fff'
          },
          'polygon': {
            'nb_sides': 5
          },
        },
        'opacity': {
          'value': 0.10,
          'random': false,
          'anim': {
            'enable': false,
            'speed': 1,
            'opacity_min': 0.1,
            'sync': false
          }
        },
        'size': {
          'value': 8,
          'random': true,
          'anim': {
            'enable': false,
            'speed': 40,
            'size_min': 0.1,
            'sync': false
          }
        },
        'line_linked': {
          'enable': true,
          'distance': 150,
          'color': '#ffffff',
          'opacity': 0.2,
          'width': 1
        },
        'move': {
          'enable': true,
          'speed': 6,
          'direction': 'none',
          'random': false,
          'straight': false,
          'out_mode': 'out',
          'bounce': false,
          'attract': {
            'enable': false,
            'rotateX': 600,
            'rotateY': 1200
          }
        }
      },
      'interactivity': {
        'detect_on': 'canvas',
        'events': {
          'onhover': {
            'enable': true,
            'mode': 'grab'
          },
          'onclick': {
            'enable': true,
            'mode': 'push'
          },
          'resize': true
        },
        'modes': {
          'grab': {
            'distance': 140,
            'line_linked': {
              'opacity': 1
            }
          },
          'bubble': {
            'distance': 400,
            'size': 40,
            'duration': 2,
            'opacity': 8,
            'speed': 3
          },
          'repulse': {
            'distance': 200,
            'duration': 0.4
          },
          'push': {
            'particles_nb': 4
          },
          'remove': {
            'particles_nb': 2
          }
        }
      },
      'retina_detect': true
    });
    new WOW().init();
  }

  geterrorMsg(field) {
    return this.contactUsForm.controls[field].hasError('required')
      || this.contactUsForm.controls[field].hasError('whitespace') ? 'enter_a_value' :
      this.contactUsForm.controls[field].hasError('email') ? 'not_valid_email' :
        '';
  }
  /**
   * @function saveContactUs
   * @description submit contact-us form details
   * @param contactData - form data
   */
  saveContactUs(contactData) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.contactUsForm.valid) {
      this.apiService.contactUs(contactData).subscribe(
        response => {
          this.successMsg = 'Your message has been successfully sent!!!.';
          this.contactUsForm.reset();
          setInterval(() => {
            this.successMsg = '';
          }, 5000);
        },
        err => {
          if (err.error && err.error.detail) {
            this.errorMsg = err.error.detail;
          } else if (err.status === 400) {
            const errArr = [];
            for (const key in err.error) {
              if (err.error.hasOwnProperty(key)) {
                errArr.push(err.error[key]);
                this.errorMsgArr[key] = err.error[key][0];
              }
            }
            this.errorMsg = (errArr.length !== 0) ? errArr[0][0] : err.error;
          } else {
            this.errorMsg = 'some_error_occurred';
          }
        }
      );
    } else {
      this.errorMsg = 'provide_valid_inputs';
    }
  }

}

/*
 * File : course-form.component.ts
 * Use: Dyanmically create the course and issued the created course
 * Copyright : vottun 2019
 */
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, DOCUMENT } from '@angular/platform-browser';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { environment as env } from '../../../environments/environment';
import { ApiService } from '../../service/api.service';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
// import { Slider } from 'ngx-slider';
import CircleType from 'circletype';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SkillsDialogComponent } from '../skills-dialog/skills-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  addCertificateForm: FormGroup;
  baseUrl = env.baseUrl;
  certificateModel: any = {
    is_certificate: false,
    title: '',
    degree: '',
    code: '',
    description: '',
    criteria: '',
    logo: '',
    selectImageOption: '1',
    is_active: true,
    business_unit: '',
    badges: '',
    is_designed: false,
    company_name: '',
    color_scheme: '',
    company_logo: '',
    identifier: '',
    skills: '',
    collaborate: '',
    others_collaborate: '',
    cert_type: '',
    collaborate_img_1: '',
    collaborate_img_2: ''
  };

  imageObject: Array<object> = [{
    image: 'assets/images/theme1.jpg',
    thumbImage: 'assets/images/theme1.jpg'
  }, {
    image: 'assets/images/theme2.jpg',
    thumbImage: 'assets/images/theme2.jpg'
  }, {
    image: 'assets/images/theme3.jpg',
    thumbImage: 'assets/images/theme3.jpg'
  }, {
    image: 'assets/images/theme2.jpg',
    thumbImage: 'assets/images/theme2.jpg'
  }];

  selectedColor: any;

  // public slider = new Slider();
  // File upload
  file: File;
  compfile: File;
  certificateLogo = new FormData();
  findFile: any;
  percentDone = 0;
  // Error msg
  errorMsg = '';
  errorMsgArr: any = [];
  // common
  process = false;
  resAddCourse: any;
  resBadgeImages: any = [];
  schemaOfBadges: any = [];
  badgeBgImage: '';
  badgeTemplate = '';
  // edit form variable
  certificateID: any;
  arrayColors: any = [];
  resClrScmCreation: any;
  imageCreateProcess = false;
  compDedegree = 0;
  badgeDedegree = 0;
  curvedNumber: any;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    uploadUrl: env.url + 'files/new/upload/',
    sanitize: false,
    toolbarPosition: 'top'
  };

  userDetails = JSON.parse(localStorage.getItem('user_details'));
  testMode: any = this.userDetails.profile_details.test_mode;
  resSkillDatas: any = [];
  skillsData: any = [];
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private formbuilder: FormBuilder,
    public apiService: ApiService,
    private certificateService: CertificateService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public domSanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private cdRef: ChangeDetectorRef,
    private cpService: ColorPickerService,
    public dialog: MatDialog
  ) {
    this.certificateForm();
    this.getSkills();
    // this.slider.config.loop = false;
    // this.slider.config.showDots = false;
    // this.slider.config.showPreview = true;
    // this.slider.config.numberOfPreview = 3;
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.apiService.userType === '4' && !this.apiService.pages.course) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
    }, 1500);
    this.certificateID = this.route.snapshot.paramMap.get('id');
    if (this.certificateID) {
      this.certificateService.getIssuerCertificateDetail(this.certificateID).subscribe(data => {
        this.certificateModel = data;
        this.certificateModel.selectImageOption = (this.certificateModel.badges === '') ? '1' : '2';
        this.certificateForm();
      }, err => {
        this.router.navigate(['usercourse']);
        this.common.openSnackBar('Invalid certificate', 'Close');
      });
    }
    this.getBadgeImages();

    // const slideItems = [
    //   { src: 'assets/images/theme1.jpg' },
    //   { src: 'assets/images/theme2.jpg' },
    //   { src: 'assets/images/theme1.jpg' }
    // ];

    // this.slider.items = slideItems;
  }

  getSkills(search = '') {
    this.skillsData = [];
    this.certificateService.getAllSkills(search).subscribe(resData => {
      this.resSkillDatas = resData;
      this.resSkillDatas.skills.map(item => {
        return item;
      }).forEach(item => {
        if (!this.skillsData.includes(item)) {
          this.skillsData.push(item);
        }
      });
    });
  }

  addNewSkill(val) {
    return val;
  }

  addskill() {
    const dialogRef = this.dialog.open(SkillsDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        console.log('hi');
      }
    });
  }

  certificateForm() {
    this.addCertificateForm = this.formbuilder.group({
      'is_designed': [this.certificateModel.is_designed],
      'company_name': [this.certificateModel.company_name],
      'title': [this.certificateModel.title, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'identifier': [this.certificateModel.identifier],
      'degree': [this.certificateModel.degree],
      'code': [this.certificateModel.code],
      'description': [this.certificateModel.description],
      'criteria': [this.certificateModel.criteria],
      'selectImageOption': '',
      'logo': [null],
      'badges': [this.certificateModel.badges],
      'is_active': [this.certificateModel.is_active],
      'business_unit': [this.certificateModel.business_unit],
      'company_logo': [null],
      'skills': [this.certificateModel.skills],
      'collaborate': [this.certificateModel.collaborate, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'others_collaborate': [this.certificateModel.others_collaborate, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'cert_type': [this.certificateModel.cert_type, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'collaborate_img_1': [null],
      'collaborate_img_2': [null]
    });
  }

  onAvoidComma(event) {
    const re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    if (re.test(event.key)) {
      event.preventDefault();
    }
  }

  searchSkill(txt) {
    this.getSkills(txt);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.toLocaleLowerCase().indexOf(term) > -1;
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  geterrorMsg(field) {
    if (field === 'title') {
      return this.addCertificateForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    } else if (field === 'code') {
      return this.addCertificateForm.controls[field].hasError('required')
        || this.addCertificateForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    } else if (field === 'collaborate') {
      return this.addCertificateForm.controls[field].hasError('required')
        || this.addCertificateForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    } else if (field === 'others_collaborate') {
      return this.addCertificateForm.controls[field].hasError('required')
        || this.addCertificateForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    } else if (field === 'cert_type') {
      return this.addCertificateForm.controls[field].hasError('required')
        || this.addCertificateForm.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    }
  }

  uploadImageTrigger() {
    const clickToBrowse: HTMLElement = document.getElementsByClassName('browselink')[0] as HTMLElement;
    clickToBrowse.click();
  }

  openColorPicker() {
    const indexBadgeVal = this.resBadgeImages.find(x => x.template_number === this.certificateModel.badges);
    const selectBadgeIndex = this.resBadgeImages.indexOf(indexBadgeVal);
    this.arrayColors = this.resBadgeImages[selectBadgeIndex].color_code;
    this.arrayColors['tid'] = this.certificateModel.badges;
    this.ngxSmartModalService.getModal('colorPickPopup').open();
  }

  onChangeColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    this.arrayColors['tid'] = this.certificateModel.badges;
    return this.cpService.rgbaToCmyk(rgba);
  }

  onColorPickImgCreate() {
    this.certificateService.createColorScheme(this.arrayColors).subscribe(event => {
      this.resClrScmCreation = event['body'];
      this.imageCreateProcess = true;
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event instanceof HttpResponse) {
        if (this.document.getElementById('badgeImageDyn') !== null) {
          this.document.getElementById('badgeImageDyn').setAttribute('src', this.resClrScmCreation.image_path);
        }
        this.certificateModel.color_scheme = this.resClrScmCreation.sch_id;
        this.imageCreateProcess = false;
        this.ngxSmartModalService.getModal('colorPickPopup').close();
      }
    });
  }

  getBadgeImages() {
    this.certificateService.getBadgeLists().subscribe(data => {
      if (data.type === HttpEventType.UploadProgress) {
      } else if (data instanceof HttpResponse) {
        this.resBadgeImages = data['body'];
        if (this.certificateID) {
          if (this.certificateModel.is_designed) {
            this.onSelectedBadge(this.certificateModel.badges, 'no');
          }

        } else {
          // setTimeout(() => {
          if (this.certificateModel.is_designed) {
            this.clickFirstBadgeLi();
          }
          // }, 300);
        }
      }
    });
  }

  clickFirstBadgeLi() {
    if (document.getElementsByClassName('findFirstBadge')[0] && document.getElementsByClassName('findFirstBadge')[0] !== null) {
      const firstLi = document.getElementsByClassName('findFirstBadge')[0].id;
      this.onSelectedBadge(firstLi);
    }
  }

  onDesignerChecked(checked) {
    this.certificateModel.is_designed = checked;
    if (!checked) {
      this.addCertificateForm.controls['title'].setValidators([Validators.required, this.noWhitespaceValidator]);
      this.badgeTemplate = '';
      this.document.getElementById('dynBadgeTemplate').innerHTML = '';
      this.certificateModel.logo = '';
      this.certificateModel.badges = this.certificateID ? this.certificateModel.badges : '';
      this.certificateModel.color_scheme = this.certificateID ? this.certificateModel.color_scheme : '';
    } else {
      this.certificateModel.logo = '';
      this.certificateModel.company_name = '';
      this.clickFirstBadgeLi();
    }
    this.addCertificateForm.updateValueAndValidity();
  }

  onSelectedBadge(badgeNum, schema = 'default') {
    this.certificateModel.badges = badgeNum;
    const indexBadgeVal = this.resBadgeImages.find(x => x.template_number === badgeNum);
    const selectBadgeIndex = this.resBadgeImages.indexOf(indexBadgeVal);
    this.schemaOfBadges = this.resBadgeImages[selectBadgeIndex].color_scheme;
    this.badgeTemplate = this.resBadgeImages[selectBadgeIndex].angular_html;
    this.curvedNumber = this.resBadgeImages[selectBadgeIndex].is_curved;
    this.compDedegree = this.resBadgeImages[selectBadgeIndex].curve_radi[0];
    this.badgeDedegree = this.resBadgeImages[selectBadgeIndex].curve_radi[1];
    this.document.getElementById('dynBadgeTemplate').innerHTML = this.badgeTemplate;
    this.onSelectedBadgeColor(schema === 'no' ? this.certificateModel.color_scheme : 'default', this.certificateID && schema === 'no' ? '' : 'default');
    this.onDisplayCompName(this.certificateModel.company_name, this.compDedegree);
    this.onDisplaybadgeTitle(this.certificateModel.title, this.badgeDedegree);
  }

  onSelectedBadgeColor(colorName, callFrom = '') {
    if (this.certificateID && callFrom === '') {
      this.document.getElementById('badgeImageDyn').setAttribute('src', this.certificateModel.bg_image);
    } else {
      this.certificateModel.color_scheme = colorName;
      const indexColorVal = this.schemaOfBadges.find(x => x.name === colorName);
      const selectColorIndex = this.schemaOfBadges.indexOf(indexColorVal);
      this.badgeBgImage = this.schemaOfBadges[selectColorIndex].scheme_path;
      this.document.getElementById('badgeImageDyn').setAttribute('src', this.badgeBgImage);
    }
    this.onDisplayCompName(this.certificateModel.company_name, this.compDedegree);
    this.onDisplaybadgeTitle(this.certificateModel.title, this.badgeDedegree);
    this.document.getElementById('badgecomplogo').setAttribute(
      'src',
      this.certificateModel.company_logo ? this.certificateModel.company_logo : 'assets/images/badges/html/logo.png'
    );
  }

  submitForm(addData, publish) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.addCertificateForm.invalid) {
      this.errorMsg = 'error';
      return false;
    }
    if (this.addCertificateForm.valid) {
      // addData['is_designed'] = this.certificateModel.is_designed;
      // addData['company_name'] = this.certificateModel.company_name;
      // addData['title'] = this.certificateModel.title;
      // addData['identifier'] = this.certificateModel.identifier;
      // addData['degree'] = this.certificateModel.degree;
      // addData['code'] = this.certificateModel.code;
      // addData['description'] = this.certificateModel.description;
      // addData['criteria'] =  this.certificateModel.criteria;
      // addData['selectImageOption'] =  this.certificateModel.selectImageOption;
      // addData['logo'] = this.certificateModel.logo;
      // addData['badges'] = this.certificateModel.badges;
      // addData['is_active'] = this.certificateModel.is_active;
      // addData['business_unit'] = this.certificateModel.business_unit;
      // addData['company_logo'] =  this.certificateModel.company_logo;
      // addData['is_certificate'] = this.certificateModel.is_certificate;
      addData['badges'] = this.certificateModel.badges;
      addData['color_scheme'] = this.certificateModel.color_scheme;
      if (addData['logo'] === '' && this.certificateModel.is_designed === false) {
        this.errorMsg = 'valid_file_format';
        return false;
      } else if (addData['collaborate_img_1'] === '') {
        this.errorMsgArr['collaborate_img_1 '] = 'valid_file_format';
        this.errorMsg = 'error';
        return false;
      } else if (addData['collaborate_img_2'] === '') {
        this.errorMsgArr['collaborate_img_2'] = 'valid_file_format';
        this.errorMsg = 'error';
        return false;
      } else {
        if (this.certificateID) {
          if (this.certificateModel.color_scheme !== '') {
            this.editCertificate(addData, this.certificateID, publish);
          } else {
            this.editCertificate(addData, this.certificateID, publish);
          }
        } else {
          if (this.certificateModel.color_scheme !== '') {
            this.addCertificate(addData, publish);
          } else {
            this.addCertificate(addData, publish);
          }
        }
      }
    } else {
      this.errorMsg = 'select_certificate_template';
    }
  }

  editCertificate(formData, certificateID, publish) {
    this.process = true;
    this.certificateService.editCertificate(formData, certificateID).subscribe(
      data => {
        this.process = false;
        if (publish === true) {
          this.redirectToStep2(certificateID);
        } else {
          this.router.navigate(['usercourse']);
        }
        this.apiService.getWallet();
        this.certificateService.redirectCourse.next(false);
        this.common.openSnackBar('course_detail_edit', 'Close');
      },
      err => {
        this.process = false;
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
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      }
    );
  }

  addCertificate(addData, publish) {
    console.log(addData);
    // return false;
    this.process = true;
    this.certificateService.addCertificates(addData).subscribe(
      res => {
        this.resAddCourse = res;
        this.process = false;
        if (publish) {
          this.redirectToStep2(this.resAddCourse.id);
        } else {
          this.router.navigate(['usercourse']);
        }
        this.apiService.getWallet();
        this.certificateService.redirectCourse.next(false);
        this.common.openSnackBar('course_added_successfully', 'Close');
      },
      err => {
        this.process = false;
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
          this.common.openSnackBar('some_error_occurred', 'Close');
        }
      }
    );
  }

  onUploadBadgeLogo(e) {
    // this.percentDone = 0;
    this.findFile = e.files;
    this.errorMsgArr['company_logo'] = '';
    this.errorMsg = '';
    this.certificateModel.company_logo = this.certificateID ? this.certificateModel.company_logo : this.certificateModel.company_logo !== '' ? this.certificateModel.company_logo : '';
    const fileTypeArray = ['png', 'jpeg', 'jpg'];
    this.compfile = e.target.files[0];

    this.certificateLogo = new FormData();
    const fileName = this.compfile.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

    if (fileTypeArray.some(x => x === fileExtension) && this.compfile.size < 3072000) {
      this.certificateLogo.append('file', this.compfile, this.compfile.name);
      this.certificateLogo.append('user', this.apiService.user.id);
      this.apiService.uploadFileProcess(this.certificateLogo).subscribe(
        data => {
          if (data.type === HttpEventType.UploadProgress) {
            // this.percentDone = Math.round(100 * data.loaded / data.total);
          } else if (data instanceof HttpResponse) {
            this.certificateModel.company_logo = data['body']['file_url'];
            this.document.getElementById('badgecomplogo').setAttribute('src', data['body']['file_url']);
          }
        },
        err => {
          this.errorMsgArr['company_logo'] = 'some_error_occurred';
          this.certificateModel.company_logo = '';
          this.document.getElementById('badgecomplogo').setAttribute('src', 'assets/images/badges/html/logo.png');
        }
      );
      e.target.value = null;
    } else {
      this.errorMsgArr['company_logo'] = 'valid_file_format';
      this.certificateModel.company_logo = '';
      this.document.getElementById('badgecomplogo').setAttribute('src', 'assets/images/badges/html/logo.png');
    }
  }

  changeBadge(e) {
    this.percentDone = 0;
    this.findFile = e.files;
    this.errorMsgArr['logo'] = '';
    this.errorMsg = '';
    this.certificateModel.logo = this.certificateID ? this.certificateModel.logo : this.certificateModel.logo !== '' ? this.certificateModel.logo : '';
    const fileTypeArray = ['png', 'jpeg', 'jpg'];
    this.file = e.target.files[0];

    this.certificateLogo = new FormData();
    const fileName = this.file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

    if (fileTypeArray.some(x => x === fileExtension) && this.file.size < 3072000) {
      this.certificateLogo.append('file', this.file, this.file.name);
      this.certificateLogo.append('user', this.apiService.user.id);
      this.apiService.uploadFileProcess(this.certificateLogo).subscribe(
        data => {
          if (data.type === HttpEventType.UploadProgress) {
            this.percentDone = Math.round(100 * data.loaded / data.total);
          } else if (data instanceof HttpResponse) {
            this.certificateModel.logo = data['body']['file_url'];
            this.certificateModel.badges = '';
          }
        },
        err => {
          this.errorMsgArr['logo'] = 'some_error_occurred';
        }
      );
      e.target.value = null;
    } else {
      this.errorMsgArr['logo'] = 'valid_file_format';
    }
  }

  changeLogo(e, field) {
    console.log(field);
    this.percentDone = 0;
    this.findFile = e.files;
    this.errorMsg = '';
    console.log(field);
    if (field == 'collaborate_img_1') {
      this.errorMsgArr['collaborate_img_1'] = '';
      this.certificateModel.collaborate_img_1 = this.certificateID ? this.certificateModel.collaborate_img_1 : this.certificateModel.collaborate_img_1 !== '' ? this.certificateModel.collaborate_img_1 : '';
    } else {
      this.errorMsgArr['collaborate_img_2'] = '';
      this.certificateModel.collaborate_img_2 = this.certificateID ? this.certificateModel.collaborate_img_2 : this.certificateModel.collaborate_img_2 !== '' ? this.certificateModel.collaborate_img_2 : '';
    }
    const fileTypeArray = ['png', 'jpeg', 'jpg'];
    this.file = e.target.files[0];

    this.certificateLogo = new FormData();
    const fileName = this.file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

    if (fileTypeArray.some(x => x === fileExtension) && this.file.size < 3072000) {
      this.certificateLogo.append('file', this.file, this.file.name);
      this.certificateLogo.append('user', this.apiService.user.id);
      this.apiService.uploadFileProcess(this.certificateLogo).subscribe(
        data => {
          if (data.type === HttpEventType.UploadProgress) {
            this.percentDone = Math.round(100 * data.loaded / data.total);
          } else if (data instanceof HttpResponse) {
            if (field == 'collaborate_img_1') {
              this.certificateModel.collaborate_img_1 = data['body']['file_url'];
            } else {
              this.certificateModel.collaborate_img_2 = data['body']['file_url'];
            }
          }
        },
        err => {
          if (field == 'collaborate_img_1') {
            this.errorMsgArr['collaborate_img_1'] = 'some_error_occurred';
          } else {
            this.errorMsgArr['collaborate_img_2'] = 'some_error_occurred';
          }
        }
      );
      e.target.value = null;
    } else {
      if (field == 'collaborate_img_1') {
        this.errorMsgArr['collaborate_img_1'] = 'valid_file_format';
      } else {
        this.errorMsgArr['collaborate_img_2'] = 'valid_file_format';
      }
    }
  }

  refreshLogo(field) {
    console.log(field);
    if (field == 'collaborate_img_1') {
      this.certificateModel.collaborate_img_1 = '';
    } else {
      this.certificateModel.collaborate_img_2 = '';
    }
  }

  public dropped(e) {
    this.percentDone = 0;
    this.findFile = e.files;
    this.errorMsgArr['logo'] = '';
    this.errorMsg = '';
    this.certificateModel.logo = this.certificateID ? this.certificateModel.logo : this.certificateModel.logo !== '' ? this.certificateModel.logo : '';
    const fileTypeArray = ['png', 'jpeg', 'jpg']; // upload only png, jpeg & jpg
    if (this.findFile.length > 1) {
      this.errorMsgArr['logo'] = 'you_can_upload_only_one_file';
      return false;
    }
    const fileEntry = e.files[0].fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {
      this.file = file;
      this.certificateLogo = new FormData();
      const fileName = this.file.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

      if (fileTypeArray.some(x => x === fileExtension) && this.file.size < 3072000) {
        this.certificateLogo.append('file', this.file, this.file.name);
        this.certificateLogo.append('user', this.apiService.user.id);
        this.apiService.uploadFileProcess(this.certificateLogo).subscribe(
          data => {
            if (data.type === HttpEventType.UploadProgress) {
              this.percentDone = Math.round(100 * data.loaded / data.total);
            } else if (data instanceof HttpResponse) {
              this.certificateModel.logo = data['body']['file_url'];
              this.certificateModel.badges = '';
            }
          },
          err => {
            this.errorMsgArr['logo'] = 'some_error_occurred';
          }
        );
      } else {
        this.errorMsgArr['logo'] = 'valid_file_format';
      }
    });
  }

  public fileOver(event) {
    // console.log(event);
  }

  public fileLeave(event) {
    // console.log(event);
  }

  /**
   * @description - redirect to achievement form step2 form with course id
   * @param certID - course ID
   */
  redirectToStep2(certID) {
    if (this.apiService.remaining_wallet < 10 && !this.testMode) {
      this.ngxSmartModalService.getModal('planPopupInfo').open();
    } else {
      localStorage.setItem('redirectWithID', certID);
      localStorage.setItem('redirectWhich', 'course');
      this.router.navigate(['newassign']);
    }
  }
  /**
   * @description - Display the course name to the badge
   * @param compName - keyup based entered value display
   */
  onDisplayCompName(compName, degree) {
    this.certificateModel.company_name = compName;
    this.document.getElementById('badgeCompany').innerHTML = compName === '' || compName === null ? 'Company Name' : compName;
    if (degree !== 0) {
      new CircleType(document.getElementById('badgeCompany')).radius(degree);
    }
  }
  /**
  * @description - Display the course title to the badge
  * @param title - keyup based entered value display
  */
  onDisplaybadgeTitle(title, degree) {
    this.certificateModel.title = title;
    if (this.document.getElementById('badgeTitle') !== null) {
      this.document.getElementById('badgeTitle').innerHTML = title === '' || title === null ? 'Badge Title' : title;
    }
    if (degree !== 0) {
      if (this.curvedNumber === 2) {
        new CircleType(document.getElementById('badgeTitle')).radius(degree);
      } else {
        new CircleType(document.getElementById('badgeTitle')).dir(-1).radius(degree);
      }
    }
    if (this.document.getElementById('badgecomplogo') !== null) {
      this.document.getElementById('badgecomplogo').setAttribute(
        'src',
        this.certificateModel.company_logo ? this.certificateModel.company_logo : 'assets/images/badges/html/logo.png'
      );
    }
  }

  removeHtml(text) {
    return text ? text.replace(/(<([^>]+)>)/ig, '') : '';
  }

}



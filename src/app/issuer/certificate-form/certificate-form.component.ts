/*
 * File : CertificateForm.component.ts
 * Use: Dyanmically create the certificate and achieve the created certificate
 * Copyright : vottun 2019
 */
import { Component, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
import { environment as env } from '../../../environments/environment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-certificate-form',
  templateUrl: './certificate-form.component.html',
  styleUrls: ['./certificate-form.component.css']
})
export class CertificateFormComponent implements AfterViewInit {
  reasonForm: FormGroup;
  whitelogo = env.white_logo;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;
  fourFormGroup: FormGroup;
  baseUrl = env.baseUrl;
  addCertificateForm: FormGroup;
  statuslists: any = [{ 'value': true, 'text': 'active' }, { 'value': false, 'text': 'in_active' }];
  relatedstatuslists: any = [{ 'value': true, 'text': 'automatic' }, { 'value': false, 'text': 'manual' }];
  optionlist: any = [{ 'value': true, 'text': 'add_a_Certificate_or_Degree_Program' }, { 'value': false, 'text': 'add_a_Course_or_Badge' }];
  typeLists = [
    { 'value': true, 'text': 'certificate' },
    { 'value': false, 'text': 'id_badge' },
  ];
  errorMsg: string;
  errorMsgArr = [];
  fileUploaded = false;
  file: File;
  fileUploadAPI = 'http://13.126.158.210:84/api/files/uploads/';
  responseData: any;
  certificateID: any;
  process = false;
  businessUnitList: any = [];
  degreeList: any = [];
  courseslists: any = [];
  coursestring = '';
  selectedCourseArr: any = [];
  certificateModel: any = {
    is_certificate: true,
    title: '',
    degree: '',
    code: '',
    description: '',
    criteria: '',
    logo: '',
    is_active: true,
    business_unit: '',
    badges: '',
    courses: '',
    automatic: false,
    type: 'true',
    is_apple_wallet: false,
    is_designed: true,
    company_logo: '',
    eulogy: '',
    subject: '',
    bg_image: '',
    selectImageOption: true,
    degree_length: '',
    identifier: '',
    skills: ''
  };
  viewAutomatic = false;
  coursesArray: any = [];
  emptyCourse = true;
  certificateLogo = new FormData();
  submitted = false;
  imageUploading = false;
  public options: Object = {
    placeholderText: '',
    height: '250'
  };
  // disablesubmit = true;
  universityLogo = 'assets/images/Univer-logo.png';
  universityName = 'Company Name';
  resDelete: any = [];
  disableYes = true;
  hideOtherField = false;
  reasonTypeVal: any;
  reasonErrorMsg = '';
  resAddCert: any = [];
  /*New variable */
  resCertImages: any = [];
  schemaOfBadges: any = [];
  badgeTemplate = '';
  badgeBgImage = '';
  compfile: any;
  resClrScmCreation: any = [];
  imageCreateProcess = false;
  isColorChange: false;
  secondaryStatus = false;
  optionLogodisplay = false;
  displayField = false;
  public arrayColors: any = [];
  ibmDefaultcontent1 = 'ha concluido con éxito su formación en Blockchain y Tecnologías DLT. El alumno ha demostradodominio en el diseño de protocolos DLT y desarrollo de aplicaciones con los entornos deprogramación y frameworks: Solidity e Hyperledger.';
  ibmDefaultcontent2 = 'En reconocimiento de este acontecimiento Blockchain Institute & Technology, en colaboracióncon IBM, otorga la acreditación académica y el certificado profesional del sector.';
  ibmCertDisplay = false;
  public selectedColor = 'clr1';
  multipleImageSize = '';
  userDetails = JSON.parse(localStorage.getItem('user_details'));
  testMode: any = this.userDetails.profile_details.test_mode;
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

  mulOptImg: any = [];
  mulOptName: any = [];
  mulOptPos: any = [];
  multiOptionLogoHide = false;

  defaultEulogyPlacholder = '';
  defaultSubjectPlacholder = '';
  skillsData: any = [];
  resSkillDatas: any = [];

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    public apiService: ApiService,
    private certificateService: CertificateService,
    private common: CommonService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private cpService: ColorPickerService
  ) {
    this.certificateForm();
    this.getSkills();
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngAfterViewInit() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://desk.zoho.com/portal/api/feedbackwidget/361568000000105649?orgId=682985484&displayType=iframe'; //external script
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

  ngOnInit() {
    setTimeout(() => {
      if (this.apiService.userType === '4' && !this.apiService.pages.certificate) {
        this.common.openSnackBar('dont_have_privillege', 'Close');
        this.router.navigate(['/signin']);
      }
    }, 1500);
    this.getCourses();
    this.firstFormGroup = this._formBuilder.group({
      title: ['', Validators.compose([Validators.required, this.noWhitespaceValidator])],
      identifier: [''],
      business_unit: [''],
      eulogy: [''],
      subject: [''],
      degree: [''],
      code: [''],
      description: [''],
      criteria: [''],
      type: 1,
      is_active: [false],
      selectImageOption: [this.certificateModel.selectImageOption],
      option_logo_list: this.formbuilder.array([]),
      skills: [this.certificateModel.skills]
    });

    this.secondFormGroup = this._formBuilder.group({
      courses: [''],
      automatic: [false]
    });
    this.certificateID = this.route.snapshot.paramMap.get('id');
    if (this.certificateID) {
      this.certificateService.getIssuerCertificateDetail(this.certificateID).subscribe(data => {
        this.certificateModel = data;
        if (this.certificateModel.is_apple_wallet) {
          this.certificateModel.type = 'false';
        } else {
          this.certificateModel.type = 'true';
        }
        if (this.certificateModel.company_logo === 'badge_logo.png') {
          this.certificateModel.company_logo = '';
          this.toggleUploadImage(true);
        } else if (this.certificateModel.company_logo === '') {
          this.toggleUploadImage(false);
        } else {
          this.toggleUploadImage(true);
        }
        this.getDegreeList(this.certificateModel.business_unit);
        // this.secondFormGroup.controls['logo'].setValue(this.certificateModel.logo);
        this.certificateForm();
        this.getCertificateList();
        this.coursesArray = this.selectedCourseArr = this.certificateModel.course_lst;
        if (this.selectedCourseArr.length === 0) {
          this.viewAutomatic = false;
        } else {
          this.viewAutomatic = true;
        }
      }, err => {
        this.router.navigate(['usercertificate']);
        this.common.openSnackBar('Invalid certificate', 'Close');
      });
    } else {
      this.getCertificateList();
    }

    this.certificateService.getBusinessUnitList().subscribe(bus => {
      this.businessUnitList = bus['units'];
    });
    this.universityLogo = this.apiService.user.university_avatar && this.apiService.user.university_avatar !== '' ? this.apiService.user.university_avatar : this.universityLogo;
    this.universityName = this.apiService.user.org_name && this.apiService.user.org_name !== '' ? this.apiService.user.org_name : this.universityName;
    if (this.apiService.user.profile_details.is_private_user) {
      this.certificateModel.type = 'false';
    } else {
      this.certificateModel.type = 'true';
    }
  }

  onIdentifierChanges(val: any) {
    if (this.document.getElementById('identifier') !== null) {
      this.document.getElementById('identifier').innerHTML = val;
    }
  }

  discriptionContent(cont: any, edit = false) {
    if (edit) {
      if (this.document.getElementById('descDynamic') !== null) {
        this.document.getElementById('descDynamic').innerHTML = cont;
      }
    } else {
      if (this.document.getElementById('descDynamic') !== null) {
        this.document.getElementById('descDynamic').innerHTML = cont.value;
      }
    }
  }

  /**
   * @function onChangeColor
   * @description create a badge based on the color picker selection
   * @param color color code
   */
  onChangeColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    this.arrayColors['tid'] = this.certificateModel.badges;
    return this.cpService.rgbaToCmyk(rgba);
  }

  /**
   * @function onColorPickImgCreate
   * @description pre-selected color schema based certificate creation
   */
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

  openColorPicker() {
    const indexBadgeVal = this.resCertImages.find(x => x.template_number === this.certificateModel.badges);
    const selectBadgeIndex = this.resCertImages.indexOf(indexBadgeVal);
    this.arrayColors = this.resCertImages[selectBadgeIndex].color_code;
    this.arrayColors['tid'] = this.certificateModel.badges;
    this.ngxSmartModalService.getModal('colorPickPopup').open();
  }

  getCertificateList() {
    this.certificateService.getCertLists().subscribe(data => {
      if (data.type === HttpEventType.UploadProgress) {
      } else if (data instanceof HttpResponse) {
        this.resCertImages = data['body'];
        if (this.certificateID) {
          this.onSelectedBadge(this.certificateModel.badges, 'no');
        } else {
          setTimeout(() => {
            this.clickFirstBadgeLi();
          }, 500);
        }
      }
    });
  }

  /*Certificate title/subject text display based on the certificate - start*/
  onDisplayCompSubject(subject) {
    subject = subject ? subject : 'Proudly Presented to ';
    this.subjectText(subject);
  }

  onDisplayCompEulogy(eulogy) {
    eulogy = eulogy ? eulogy : 'Certificate of achievement';
    const arrEulogy = eulogy.split(' ');
    this.eulogyText(eulogy, arrEulogy);
  }

  subjectText(txt) {
    if (this.document.getElementById('certDynSubject') !== null) {
      this.document.getElementById('certDynSubject').innerHTML = txt;
    }
  }

  eulogyText(txt, arrTxt) {
    if (this.document.getElementById('certDynEulogy') !== null) {
      this.document.getElementById('certDynEulogy').innerHTML = txt.split(' ').slice(0, Math.floor(arrTxt.length / 2)).join(' ');
      if (this.document.getElementById('certDynEulogy2') !== null) {
        this.document.getElementById('certDynEulogy2').innerHTML = txt.split(' ').slice(Math.floor(arrTxt.length / 2)).join(' '), Math.round(arrTxt.length / 2);
      }
    }
  }
  /*Certificate title text display based on the certificate - end*/

  onDisplayCompDesgree(degree) {
    degree = degree === '' || degree === null ? 'Certificate Of Completion' : degree;
    if (this.document.getElementById('digreee') !== null) {
      this.document.getElementById('digreee').innerHTML = degree;
    }
  }

  onDisplayCompTitle(title) {
    title = title === '' || title === null ? 'Certificate Name' : title;
    if (this.document.getElementById('certDynTitle') !== null) {
      this.document.getElementById('certDynTitle').innerHTML = title;
    }
    this.secLogoImage(this.certificateModel.company_logo);
    this.dynOrgImage(this.apiService.user.university_avatar);
    this.dynOrgName();
    if (this.certificateModel.allow_script) {
      this.onDisplayIbmEulogy(this.certificateModel.eulogy ? this.certificateModel.eulogy : this.defaultEulogyPlacholder);
      this.onDisplayIbmSubject(this.certificateModel.subject ? this.certificateModel.subject : this.defaultSubjectPlacholder);
    } else {
      this.onDisplayCompEulogy(this.certificateModel.eulogy);
      this.onDisplayCompSubject(this.certificateModel.subject);
      this.firstFormGroup.controls['eulogy'].setValidators(null);
      this.firstFormGroup.controls['subject'].setValidators(null);
    }
    this.firstFormGroup.controls['eulogy'].updateValueAndValidity();
    this.firstFormGroup.controls['subject'].updateValueAndValidity();
    this.discriptionContent(this.certificateModel.description, true);
    this.onIdentifierChanges(this.certificateModel.identifier);
  }

  onDisplayIbmEulogy(eulogy) {
    eulogy = eulogy || this.defaultEulogyPlacholder != '' ? eulogy === '' ? this.defaultEulogyPlacholder : eulogy : this.ibmDefaultcontent1;
    this.ibmEulogyText(eulogy);
  }

  ibmEulogyText(txt) {
    if (this.document.getElementById('certDynEulogy') !== null) {
      this.document.getElementById('certDynEulogy').innerHTML = txt;
    }
  }

  onDisplayIbmSubject(subject) {
    subject = subject || this.defaultSubjectPlacholder != '' ? subject === '' ? this.defaultSubjectPlacholder : subject : this.ibmDefaultcontent2;
    this.ibmSubjectText(subject);
  }

  ibmSubjectText(txt) {
    if (this.document.getElementById('certDynSubject') !== null) {
      this.document.getElementById('certDynSubject').innerHTML = txt;
    }
  }


  clickFirstBadgeLi() {
    const firstLi = document.getElementsByClassName('findFirstBadge')[0].id;
    this.onSelectedBadge(firstLi);
  }

  onSelectedBadge(badgeNum, schema = 'default') {
    this.certificateModel.badges = badgeNum;
    const indexBadgeVal = this.resCertImages.find(x => x.template_number === badgeNum);
    const selectBadgeIndex = this.resCertImages.indexOf(indexBadgeVal);
    this.isColorChange = this.resCertImages[selectBadgeIndex].is_color_changeable;
    if (this.resCertImages[selectBadgeIndex].default_values) {
      this.defaultEulogyPlacholder = this.resCertImages[selectBadgeIndex].default_eulogy;
      this.defaultSubjectPlacholder = this.resCertImages[selectBadgeIndex].default_subject;
    } else {
      this.defaultEulogyPlacholder = '';
      this.defaultSubjectPlacholder = '';
    }
    this.schemaOfBadges = this.resCertImages[selectBadgeIndex].color_scheme;
    this.badgeTemplate = this.resCertImages[selectBadgeIndex].angular_html;
    this.optionLogodisplay = this.resCertImages[selectBadgeIndex].has_optional_logo;
    this.displayField = this.resCertImages[selectBadgeIndex].has_degree;
    this.certificateModel.allow_script = this.resCertImages[selectBadgeIndex].allow_script;
    this.certificateModel.degree_length = this.resCertImages[selectBadgeIndex].degree_length;
    if (this.certificateModel.allow_script) {
      this.ibmCertDisplay = true;
    } else {
      this.ibmCertDisplay = false;
    }
    this.document.getElementById('dynBadgeTemplate').innerHTML = this.badgeTemplate;
    this.onSelectedBadgeColor(schema === 'no' ? this.certificateModel.color_scheme : 'default', this.certificateID && schema === 'no' ? '' : 'default');
    this.onDisplayCompTitle(this.certificateModel.title);
    if (this.resCertImages[selectBadgeIndex].sec_img_count === 0) {
      this.multiOptionLogoHide = false;
      this.mulOptImg = [];
      this.mulOptName = [];
      this.mulOptPos = [];
      this.firstFormGroup.controls['option_logo_list'] = this.formbuilder.array([]);
    } else {
      // this.optionLogodisplay = false;
      this.multiOptionLogoHide = true;
      this.firstFormGroup.controls['option_logo_list'] = this.formbuilder.array([]);
      for (let i = 0; i < this.resCertImages[selectBadgeIndex].sec_img_count; i++) {
        this.addFields();
        if (this.certificateModel.option_logo_list != null && this.certificateModel.option_logo_list != '') {
          var logolists = this.certificateModel.option_logo_list.split(',');
          this.mulOptImg[i] = logolists[i] && logolists[i] !== null ? logolists[i] : 'null';
          this.dynOptionImageReplace(i);
        } else {
          this.mulOptImg[i] = 'null';
          this.dynOptionImageReplace(i);
        }
        if (this.certificateModel.option_name_list != null && this.certificateModel.option_name_list != '') {
          var namelists = this.certificateModel.option_name_list.split('_ad_');
          this.mulOptName[i] = namelists[i] && namelists[i] !== null ? namelists[i] : 'null';
          if (typeof this.mulOptName[i] != 'undefined' && this.mulOptName[i] != 'null') {
            this.firstFormGroup.controls['option_logo_list'].value[i]['name'] = this.mulOptName[i];
            this.dynamicNamePos(this.mulOptName[i], i, 'name');
          }
        } else {
          this.mulOptName[i] = 'null';
        }
        if (this.certificateModel.option_position_list != null && this.certificateModel.option_position_list != '') {
          var positionlists = this.certificateModel.option_position_list.split('_ad_');
          this.mulOptPos[i] = positionlists[i] && positionlists[i] !== null ? positionlists[i] : 'null';
          if (typeof this.mulOptName[i] != 'undefined' && this.mulOptPos[i] != 'null') {
            // this.firstFormGroup.controls['option_logo_list'][i].position.setValue(this.mulOptPos[i]);
            this.dynamicNamePos(this.mulOptPos[i], i, 'pos');
          }
        } else {
          this.mulOptPos[i] = 'null';
        }
      }
      // const control = <FormArray>this.firstFormGroup.controls['option_logo_list'];
      // for (let i = 0; i < this.resCertImages[selectBadgeIndex].sec_img_count; i++) {
      //   control.push(this.initNqCoordinators(this.mulOptImg[i].image, this.mulOptName[i], this.mulOptPos[i]));
      // }
    }
  }

  getInputValue(index, where) {
    if (where === 'name') {
      return this.mulOptName[index] && this.mulOptName[index] != 'null' ? this.mulOptName[index] : '';
    } else if (where === 'pos') {
      return this.mulOptPos[index] && this.mulOptPos[index] != 'null' ? this.mulOptPos[index] : '';
    } else {
      return '';
    }
  }

  clearUploadImage(index) {
    this.mulOptImg[index] = 'null';
    this.dynOptionImageReplace(index);
  }

  dynOptionImageReplace(index) {
    if (this.document.getElementById('dyn_opt_logo_' + index) !== null) {
      this.document.getElementById('dyn_opt_logo_' + index).setAttribute(
        'src',
        this.mulOptImg[index] !== '' && this.mulOptImg[index] !== 'null' ? this.mulOptImg[index] : 'assets/images/upload-signature.png'
      );
    }
  }

  dynamicNamePos(val, index, which) {
    var idName = which == 'name' ? 'dyn_opt_name_' : 'dyn_opt_position_';
    this.document.getElementById(idName + index).innerHTML = val;
  }

  onSelectedBadgeColor(colorName, callFrom = '') {
    if (this.document.getElementById('badgeImageDyn') !== null) {
      if (this.certificateID && callFrom === '') {
        this.document.getElementById('badgeImageDyn').setAttribute('src', this.certificateModel.bg_image);
      } else {
        this.certificateModel.color_scheme = colorName;
        const indexColorVal = this.schemaOfBadges.find(x => x.name === colorName);
        const selectColorIndex = this.schemaOfBadges.indexOf(indexColorVal);
        this.badgeBgImage = this.schemaOfBadges[selectColorIndex].scheme_path;
        this.document.getElementById('badgeImageDyn').setAttribute('src', this.badgeBgImage);
      }
    }
    if (this.document.getElementById('certDynTitle') !== null) {
      this.onDisplayCompTitle(this.certificateModel.title);
    }
    if (this.document.getElementById('digreee') !== null) {
      this.onDisplayCompDesgree(this.certificateModel.degree);
    }
    if (this.document.getElementById('university_name') !== null) {
      this.document.getElementById('university_name').innerHTML = this.apiService.user.org_name;
    }
    this.secLogoImage(this.certificateModel.company_logo);
    this.dynOrgImage(this.apiService.user.university_avatar);
    this.dynOrgName();
  }

  dynOrgImage(orgImg) {
    if (this.document.getElementById('dyn_org_img') !== null) {
      this.document.getElementById('dyn_org_img').setAttribute('src', orgImg);
    }
  }

  dynOrgName() {
    if (this.document.getElementById('dyn_company_name') !== null) {
      this.document.getElementById('dyn_company_name').innerHTML = this.apiService.user.org_name;
    }
  }

  secLogoImage(img) {
    if (this.document.getElementById('dyn_company_logo') !== null) {
      if (this.secondaryStatus) {
        this.document.getElementById('dyn_company_logo').setAttribute(
          'src',
          img !== '' ? img : 'assets/images/badges/html/secondary_logo.png'
        );
      } else {
        this.document.getElementById('dyn_company_logo').setAttribute(
          'src', 'assets/images/badges/html/noimage.png'
        );
      }
    }
  }

  toggleUploadImage(checked) {
    if (checked) {
      this.certificateModel.company_logo = checked && this.certificateModel.company_logo === '' ? '' : this.certificateModel.company_logo;
      this.secondaryStatus = true;
      this.secLogoImage(this.certificateModel.company_logo);
    } else {
      this.certificateModel.company_logo = '';
      this.secondaryStatus = false;
      this.secLogoImage('');
    }
  }

  onMultipleOptLogo(e, index) {
    jQuery('body').addClass('imageprocess');
    this.errorMsg = '';
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
          jQuery('body').removeClass('imageprocess');
          if (data.type === HttpEventType.UploadProgress) {
          } else if (data instanceof HttpResponse) {
            this.imageUploading = true;
            this.mulOptImg[index] = data['body']['file_url'];
            this.dynOptionImageReplace(index);
          }
        },
        err => {
          jQuery('body').removeClass('imageprocess');
          this.imageUploading = false;
        }
      );
      e.target.value = null;
    } else {
      this.common.openSnackBar('valid_file_format', 'Close');
      this.imageUploading = false;
      jQuery('body').removeClass('imageprocess');
    }
  }


  onMultipleOptName(val, index) {
    this.mulOptName[index] = val;
    this.dynamicNamePos(val && val != '' ? val : 'Name', index, 'name');
  }

  onMultipleOptPosition(val, index) {
    this.mulOptPos[index] = val;
    this.dynamicNamePos(val && val != '' ? val : 'Position / Role', index, 'position');
  }

  onUploadCompLogo(e) {
    jQuery('body').addClass('imageprocess');
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
          jQuery('body').removeClass('imageprocess');
          if (data.type === HttpEventType.UploadProgress) {
          } else if (data instanceof HttpResponse) {
            this.imageUploading = true;
            this.certificateModel.company_logo = data['body']['file_url'];
            this.secLogoImage(data['body']['file_url']);
          }
        },
        err => {
          jQuery('body').removeClass('imageprocess');
          this.imageUploading = false;
          this.errorMsgArr['company_logo'] = 'some_error_occurred';
          this.certificateModel.company_logo = '';
          this.secLogoImage('');
        }
      );
      e.target.value = null;
    } else {
      jQuery('body').removeClass('imageprocess');
      this.errorMsgArr['company_logo'] = 'valid_file_format';
      this.certificateModel.company_logo = '';
      this.imageUploading = false;
      this.secLogoImage('');
    }
  }

  getTypeList(val) {
    this.certificateModel.type = val;
  }

  getDegreeList(unit) {
    this.certificateService.getDegreeList(unit).subscribe(deg => {
      this.degreeList = deg['units'];
    });
  }

  certificateForm() {
    this.addCertificateForm = this.formbuilder.group({
      'title': [this.certificateModel.title, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'identifier': [this.certificateModel.identifier],
      'degree': [this.certificateModel.degree],
      'code': [this.certificateModel.code],
      'description': [this.certificateModel.description],
      'criteria': [this.certificateModel.criteria],
      'logo': [null],
      'badges': [this.certificateModel.badges, Validators.compose([Validators.required, this.noWhitespaceValidator])],
      'is_active': [this.certificateModel.is_active],
      'business_unit': [this.certificateModel.business_unit],
      'courses': [null],
      'automatic': [this.certificateModel.automatic],
      'company_name': [this.apiService.user.org_name],
      'company_logo': [null],
      'option_logo_list': this.formbuilder.array([]),
    });
  }

  addFields() {
    const control = <FormArray>this.firstFormGroup.controls['option_logo_list'];
    control.push(this.initNqCoordinators());
  }

  initNqCoordinators(imageUrl = null, name = null, position = null) {
    return this.formbuilder.group({
      image: imageUrl,
      name: name,
      position: position
    });
  }

  onChangeCourse(value: string, isChecked: boolean) {
    if (isChecked) {
      this.coursesArray.push(value);
    } else {
      const courseVal = this.coursesArray.find(x => x === value);
      const index = this.coursesArray.indexOf(courseVal);
      this.coursesArray.splice(index, 1);
    }
    if (this.coursesArray.length > 0) {
      this.coursestring = this.coursesArray.toString();
    } else {
      this.coursestring = '';
    }
    if (this.coursestring !== '' && this.coursestring != null) {
      this.viewAutomatic = true;
    } else {
      this.viewAutomatic = false;
    }
  }

  submitForm(addData, publish) {
    this.errorMsg = '';
    this.errorMsgArr = [];
    if (this.firstFormGroup.invalid) {
      this.errorMsg = 'valid_inputs';
      return false;
    }
    if (this.secondFormGroup.valid || this.certificateModel.is_certificate === false) {
      if (this.fileUploaded === true) {
        return false;
      }
      addData['badges'] = this.certificateModel.badges;
      addData['color_scheme'] = this.certificateModel.color_scheme;
      if (this.secondaryStatus === false) {
        addData['company_logo'] = '';
      } else {
        addData['company_logo'] = this.secondaryStatus && this.certificateModel.company_logo === '' ? 'badge_logo.png' : this.certificateModel.company_logo;
      }
      if (this.viewAutomatic === false) {
        addData['automatic'] = this.secondFormGroup.controls['automatic'].value;
      } else {
        addData['automatic'] = this.secondFormGroup.controls['automatic'].value;
      }
      if (this.coursesArray.length > 0) {
        this.coursestring = this.coursesArray.toString();
      }
      addData['courses'] = this.coursestring;
      this.certificateModel.courses = this.coursestring;
      this.certificateModel.automatic = addData['automatic'];
      this.certificateModel.company_logo = addData['company_logo'];
      if (this.certificateID) {
        if (this.certificateModel.color_scheme !== '') {
          this.editCertificate(this.certificateModel, this.certificateID, publish);
        } else {
          this.editCertificate(addData, this.certificateID, publish);
        }
      } else {
        if (this.certificateModel.color_scheme !== '') {
          this.addCertificate(this.certificateModel, publish);
        } else {
          this.addCertificate(addData, publish);
        }
      }
    } else {
      this.errorMsg = 'select_certificate_template';
    }
  }

  editCertificate(formData, certificateID, publish) {
    this.addCertificateForm.markAsTouched();
    this.process = true;
    formData['courses'] = this.coursestring;
    if (this.mulOptImg.length != 0) {
      formData['option_logo_list'] = this.mulOptImg.toString();
    } else {
      formData['option_logo_list'] = null;
    }
    if (this.mulOptName.length != 0) {
      formData['option_name_list'] = this.mulOptName.join('_ad_');
    } else {
      formData['option_name_list'] = null;
    }
    if (this.mulOptPos.length != 0) {
      formData['option_position_list'] = this.mulOptPos.join('_ad_');
    } else {
      formData['option_position_list'] = null;
    }
    this.certificateService.editCertificate(formData, certificateID).subscribe(
      data => {
        this.process = false;
        if (publish) {
          this.redirectToStep2(certificateID);
        } else {
          this.router.navigate(['usercertificate']);
        }
        this.apiService.getWallet();
        this.certificateService.redirectCerts.next(false);
        this.common.openSnackBar('certificate_detail_edit', 'Close');
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
  /**
   * @description Add the new certificate
   * @param addData - form data
   * @param publish - we need to find where we going to redirect after form submission
   */
  addCertificate(addData, publish) {
    this.process = true;
    if (this.mulOptImg.length != 0) {
      addData['option_logo_list'] = this.mulOptImg.toString();
    } else {
      addData['option_logo_list'] = null;
    }
    if (this.mulOptName.length != 0) {
      addData['option_name_list'] = this.mulOptName.join('_ad_');
    } else {
      addData['option_name_list'] = null;
    }
    if (this.mulOptPos.length != 0) {
      addData['option_position_list'] = this.mulOptPos.join('_ad_');
    } else {
      addData['option_position_list'] = null;
    }
    this.certificateService.addCertificates(addData).subscribe(
      res => {
        this.resAddCert = res;
        this.process = false;
        if (publish) {
          this.redirectToStep2(this.resAddCert.id);
        } else {
          this.router.navigate(['usercertificate']);
        }
        this.apiService.getWallet();
        this.certificateService.redirectCerts.next(false);
        this.common.openSnackBar('certificate_added_successfully', 'Close');
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
  /**
   * @description dynamically display the field error message
   * @param field field name
   */
  geterrorMsg(field) {
    if (field === 'title') {
      return this.firstFormGroup.controls[field].hasError('required')
        || this.firstFormGroup.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    } else {
      return this.firstFormGroup.controls[field].hasError('required') ? 'enter_a_value' : '';
    }
  }
  /**
   * @description function using for get activated course list based searching keyword
   * @param searchData - search value
   */
  getCourses(searchData?: any) {
    this.process = true;
    const params = new URLSearchParams();
    for (const key in searchData) {
      if (searchData[key]) {
        params.set(key, searchData[key]);
      }
    }
    this.certificateService.getIssuersCoursesActive(params.toString()).subscribe(
      data => {
        this.process = false;
        this.courseslists = data;
        this.emptyCourse = false;
        if (this.courseslists.length === 0) {
          this.emptyCourse = true;
        }
      },
      err => {
        this.courseslists = [];
        this.process = false;
      }
    );
  }
  /**
   * @description function using for redirect to the custom certificate design page
   * @param event event varaible - find checkbox are check and not
   */
  onTemplateChange(event) {
    if (!event.checked) {
      this.router.navigate([`customcertificate`]);
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      //   );
    }
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
      localStorage.setItem('redirectWhich', 'cert');
      this.router.navigate(['newassign']);
    }
  }
  /**
   * @description removed the unwanted html tag from api return content
   * @param text - html content
   */
  removeHtml(text) {
    return text ? text.replace(/(<([^>]+)>)/ig, '') : '';
  }
}

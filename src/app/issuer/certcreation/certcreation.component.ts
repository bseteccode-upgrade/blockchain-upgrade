/*
 * File : certcreation.component.ts
 * Use: Dyanmically create the certificate ( Using drag-drop option ) and achieve the created certificate
 * Copyright : vottun 2019
 */
import { Component, OnInit, AfterViewInit, ElementRef, Inject, Renderer2, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CertificateService } from '../services/certificate.service';
import { CommonService } from '../../service/common.service';
import { environment as env } from '../../../environments/environment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/platform-browser';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { dragula, DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;

import BlotFormatter from 'quill-blot-formatter';
Quill.register('modules/blotFormatter', BlotFormatter);

const font = Quill.import('formats/font');
// We do not add Aref Ruqaa since it is the default
font.whitelist = ['certificate', 'play', 'helveticabold', 'helveticastd', 'opensans', 'opensans-semi', 'opensans-bold', 'roboto-bold', 'roboto-medium', 'alegreyasc-regular', 'ptserif-regular', 'nyala', 'alex', 'alex-regular', 'ovo', 'calibri', 'museoslab', 'kadwa-regular', 'kron-regular', 'poly-regular', 'poppins-regular', 'allura-regular', 'archivo-regular', 'cinzel-regular', 'raleway-light', 'raleway-bold', 'italianno-regular', 'verdana', 'verdana-bold', 'montserrat-regular', 'vollkorn-italic', 'montserrat-semibold', 'cormor-regular', 'mirza', 'roboto', 'aref', 'acme', 'archivo', 'cantarell', 'comfortaa', 'courgette', 'fredoka', 'great', 'hind', 'jomhuria', 'kanit', 'kaushan', 'manuale', 'maven', 'monda', 'orbitron', 'overpass', 'quat', 'satisfy', 'signika', 'serif', 'sansserif', 'monospace']
Quill.register(font, true);

const size = Quill.import('formats/size');
size.whitelist = ['8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60'];
Quill.register(size, true);

declare var jQuery;

@Component({
  selector: 'app-certcreation',
  templateUrl: './certcreation.component.html',
  //styleUrls: ['./certcreation.component.css']
  styleUrls: ['../../../assets/styles/frontend.css']
})
export class CertcreationComponent implements OnInit, OnDestroy, AfterViewInit {

  reasonForm: FormGroup;
  appName = env.project_name;
  siteName = env.project_site;
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
    selectImageOption: false,
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
    custom_html: '<div class="main"><div class="contentaddhere" style="width:100%;display:inline-block;">Sample content</div>     <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button>        <button type="button" class="deleteRows" style="display:none;"><i class="material-icons">delete</i></button></div>' +
      '<div class="main"><div class="main-sub"><div class="content-two" style="margin-right:10px;display:inline-block;float:left;"> <div class="contentaddhere">Sample content</div>   <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button></div> <div class="content-two" style="display:inline-block;float:left;"><div class="contentaddhere">Sample content</div> <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button></div></div>    <button type="button" class="deleteRows" style="display:none;"><i class="material-icons">delete</i></button></div>'
      + '<div class="main"><div class="contentaddhere" style="width:100%;display:inline-block;">Sample content</div>     <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button>        <button type="button" class="deleteRows" style="display:none;"><i class="material-icons">delete</i></button></div>',
    color_code: '',
    identifier: ''
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

  /* dynamic cert */
  MANY_ITEMS = 'dragContainerCertCus';
  singleRow = '';
  columnRow = '';
  @ViewChild('dynamiccontent') addcontent_here: ElementRef;
  subs = new Subscription();
  contentHtml: any = '';
  currentId: any;
  initialContentVal: any;
  currentEnteredVal: any;
  quillEditorRef: any;
  placeholdercontentview = true;
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  videoUrl = 'https://youtu.be/EngW7tLk6R8';
  modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        [{
          'placeholder': [
            '{{first_name}}',
            '{{last_name}}',
            '{{title}}',
            '{{degree}}',
            '{{certificate_no}}',
            '{{qr_code_img}}',
            '{{organization}}',
            '{{evidence}}',
            '{{studentAddress}}',
            '{{issue_date}}',
            '{{end_date}}',
            '{{eulogy_content1}}',
            '{{eulogy_content2}}',
            '{{subject}}',
            '{{organization_logo}}']
        }]
      ]
    },
    // imageResize: true
  };

  // modules = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike'],
  //     ['blockquote', 'code-block'],
  //     [{ 'header': 1 }, { 'header': 2 }],
  //     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  //     [{ 'script': 'sub' }, { 'script': 'super' }],
  //     [{ 'direction': 'rtl' }],
  //     [{ 'size': [false, '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', '58', '60'] }],
  //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  //     [{ 'indent': '-1'}, { 'indent': '+1' }],
  //     ['clean'],
  //     [{ 'color': [] }, { 'background': [] }],
  //     [{ 'font': [false, 'certificate', 'play', 'helveticabold', 'helveticastd', 'opensans', 'opensans-semi', 'opensans-bold', 'roboto-bold', 'roboto-medium', 'alegreyasc-regular', 'ptserif-regular', 'nyala', 'alex', 'alex-regular', 'ovo', 'calibri', 'museoslab', 'kadwa-regular', 'kron-regular', 'poly-regular', 'poppins-regular', 'allura-regular', 'archivo-regular', 'cinzel-regular', 'raleway-light', 'raleway-bold', 'italianno-regular', 'verdana', 'verdana-bold', 'montserrat-regular', 'vollkorn-italic', 'montserrat-semibold', 'cormor-regular', 'mirza', 'roboto', 'aref', 'acme', 'archivo', 'cantarell', 'comfortaa', 'courgette', 'fredoka', 'great', 'hind', 'jomhuria', 'kanit', 'kaushan', 'manuale', 'maven', 'monda', 'orbitron', 'overpass', 'quat', 'satisfy', 'signika', 'serif', 'sansserif', 'monospace'] }],
  //     [{ 'align': [] }],
  //     ['link', 'image'],
  //     ['showHtml'],
  //     [{
  //       'placeholder': [
  //         '{{first_name}}',
  //         '{{last_name}}',
  //         '{{title}}',
  //         '{{certificate_no}}',
  //         '{{qr_code_img|safe}}',
  //         '{{organization}}',
  //         '{{blockchain_transaction_id}}',
  //         '{{student_address}}',
  //         '{{issue_date}}',
  //         '{{end_date}}',
  //         '{{organization_logo|safe}}']
  //     }],
  //   ],
  //   blotFormatter: {}
  //   // ImageResize : {}
  // };
  colorCodeBg: any = '';
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
    private cpService: ColorPickerService,
    private dragulaService: DragulaService,
    private renderer: Renderer2,
  ) {
    this.certificateForm();
    this.reasonForm = this.formbuilder.group({
      'reason_type': [null, Validators.compose([Validators.required])],
      'reason': ['']
    });
  }

  /**
   * @description dynamic certificate creation sample video play when user click the play button
   */
  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  openColorPicker() {
    this.ngxSmartModalService.getModal('colorPickPopup').open();
  }

  ngAfterViewInit() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://desk.zoho.com/portal/api/feedbackwidget/361568000000105649?orgId=682985484&displayType=iframe'; //external script

    /* dynamic cert */

    var self = this;
    var index = 0;
    jQuery(document).on('click', '.deleteRows', function () {
      jQuery(this).parent().remove();
      if (jQuery('#dynamiccontent').find('div').length === 0) {
        jQuery('.placeholderAddContent').css('display', 'block');
      }
    });
    jQuery(document).on('click', '.editRow', function (e) {
      var d = new Date();
      var n = d.getTime();
      var contentid = 'content-' + n;
      self.ngxSmartModalService.getModal('contentPopup').open();
      jQuery(this).parent().attr('id', contentid);
      self.currentId = contentid;
      setTimeout(() => {
        self.initialContentVal = jQuery('#' + contentid + ' .contentaddhere').html();
      }, 500);
    });

    jQuery(document).on('click', '.ql-picker-options', function (e) {
      jQuery('.ql-picker-item').removeClass('ql-selected');
    });

    jQuery(document).on('click', '.ql-placeholder .ql-picker-item', function (e) {
      jQuery(this).parents('.ql-expanded').removeClass('ql-expanded');
      self.quillEditorRef.focus();
      e.preventDefault();
      const cursorPosition = self.quillEditorRef.selection.savedRange;
      self.quillEditorRef.insertText(cursorPosition.index, jQuery(this).attr('data-value'));
      self.quillEditorRef.setSelection(cursorPosition.index + jQuery(this).attr('data-value').length);
    });

    // var txtArea = document.createElement('textarea');
    // txtArea.style.cssText = 'width: 100%;margin: 0px;background: rgb(29, 29, 29);box-sizing: border-box;color: rgb(204, 204, 204);font-size: 15px;outline: none;padding: 20px;line-height: 24px;font-family: Consolas, Menlo, Monaco, &quot;Courier New&quot;, monospace;position: absolute;top: 0;bottom: 0;border: none;display:none';

    // var htmlEditor = self.quillEditorRef.addContainer('ql-custom');
    // htmlEditor.appendChild(txtArea);

    // var myEditor = document.querySelector('.ql-editor');
    // self.quillEditorRef.on('text-change', (delta, oldDelta, source) => {
    //   console.log(source);
    //   console.log(oldDelta);
    //   console.log(delta);
    //   console.log(myEditor.innerHTML);
    //   var html = myEditor.children[0].innerHTML;
    //   console.log(myEditor.children[0].innerHTML);
    //   txtArea.value = html;
    // });

    // var customButton = document.querySelector('.ql-showHtml');
    // customButton.addEventListener('click', function() {
    //   if (txtArea.style.display === '') {
    //     var html = txtArea.value;
    //     console.log(txtArea.value);
    //     self.quillEditorRef.pasteHTML(html);
    //   }
    //   txtArea.style.display = txtArea.style.display === 'none' ? '' : 'none';
    // });

    /* Display drop-down content */
    const placeholderPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-placeholder .ql-picker-item'));
    placeholderPickerItems.forEach(item => item.textContent = item.dataset.value);
    document.querySelector('.ql-placeholder .ql-picker-label').innerHTML
      = 'Insert content' + document.querySelector('.ql-placeholder .ql-picker-label').innerHTML;
    if (this.certificateID) {
    } else {
      jQuery('#dynamiccontent').last().append(this.certificateModel.custom_html);
      jQuery('.placeholderAddContent').css('display', 'none');
    }
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.apiService.userType === '4' && !this.apiService.pages.certificate) {
        this.router.navigate(['/signin']);
        this.common.openSnackBar('dont_have_privillege', 'Close');
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
      selectImageOption: [false]
    });

    this.secondFormGroup = this._formBuilder.group({
      courses: [''],
      automatic: [false]
    });
    this.certificateID = this.route.snapshot.paramMap.get('id');
    if (this.certificateID) {
      this.certificateService.getNewIssuerCertificateDetail(this.certificateID).subscribe(data => {
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
        if (this.certificateModel.custom_html) {
          jQuery('.container-dragdrop').html(this.certificateModel.custom_html);
          this.colorCodeBg = this.certificateModel.color_code ? this.certificateModel.color_code : 'rgb(255,255,255)';
          jQuery('.custom-container').css('background-color', this.colorCodeBg);
          if (jQuery('#dynamiccontent').find('div').length === 0) {
            jQuery('.placeholderAddContent').css('display', 'inline-block');
          } else {
            jQuery('.placeholderAddContent').css('display', 'none');
          }
        }
        this.getDegreeList(this.certificateModel.business_unit);
        this.certificateForm();
        this.getCertificateList();
        this.coursesArray = this.selectedCourseArr = this.certificateModel.course_lst;
        if (this.selectedCourseArr === []) {
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


  onChangeColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    this.arrayColors['tid'] = this.certificateModel.badges;
    return this.cpService.rgbaToCmyk(rgba);
  }

  onColorPickImgCreate() {
    jQuery('.custom-container').css('background-color', this.arrayColors.clr1);
    this.colorCodeBg = this.arrayColors.clr1;
    this.ngxSmartModalService.getModal('colorPickPopup').close();
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
            // this.clickFirstBadgeLi();
          }, 500);
        }
      }
    });
  }

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

  onTemplateChange(event) {
    if (event.checked) {
      this.router.navigate(['certificateadd']);
    }
  }

  onDisplayCompDesgree(degree) {
    degree = degree === '' || degree === null ? 'degree' : degree;
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
    if (this.certificateModel.badges === '9' || this.certificateModel.badges === '10') {
      this.onDisplayIbmEulogy(this.certificateModel.eulogy);
      this.onDisplayIbmSubject(this.certificateModel.subject);
    } else {
      this.onDisplayCompEulogy(this.certificateModel.eulogy);
      this.onDisplayCompSubject(this.certificateModel.subject);
      this.firstFormGroup.controls['eulogy'].setValidators(null);
      this.firstFormGroup.controls['subject'].setValidators(null);
    }
    this.firstFormGroup.controls['eulogy'].updateValueAndValidity();
    this.firstFormGroup.controls['subject'].updateValueAndValidity();
  }

  onDisplayIbmEulogy(eulogy) {
    eulogy = eulogy ? eulogy : this.ibmDefaultcontent1;
    this.ibmEulogyText(eulogy);
  }

  ibmEulogyText(txt) {
    if (this.document.getElementById('certDynEulogy') !== null) {
      this.document.getElementById('certDynEulogy').innerHTML = txt;
    }
  }

  onDisplayIbmSubject(subject) {
    subject = subject ? subject : this.ibmDefaultcontent2;
    this.ibmSubjectText(subject);
  }

  ibmSubjectText(txt) {
    if (this.document.getElementById('certDynSubject') !== null) {
      this.document.getElementById('certDynSubject').innerHTML = txt;
    }
  }

  onSelectedBadge(badgeNum, schema = 'default') {
    this.certificateModel.badges = badgeNum;
    if (this.certificateModel.badges === '9' || this.certificateModel.badges === '10') {
      this.ibmCertDisplay = true;
    } else {
      this.ibmCertDisplay = false;
    }
    if (this.resCertImages !== []) {
      const indexBadgeVal = this.resCertImages.find(x => x.template_number === badgeNum);
      const selectBadgeIndex = this.resCertImages.indexOf(indexBadgeVal);
      if (selectBadgeIndex !== -1) {
        this.isColorChange = this.resCertImages[selectBadgeIndex].is_color_changeable;
        this.schemaOfBadges = this.resCertImages[selectBadgeIndex].color_scheme;
        this.badgeTemplate = this.resCertImages[selectBadgeIndex].angular_html;
        this.optionLogodisplay = this.resCertImages[selectBadgeIndex].has_optional_logo;
        this.displayField = this.resCertImages[selectBadgeIndex].has_degree;
        this.document.getElementById('dynBadgeTemplate').innerHTML = this.badgeTemplate;
      }
    }
    this.onSelectedBadgeColor(schema === 'no' ? this.certificateModel.color_scheme : 'default', this.certificateID && schema === 'no' ? '' : 'default');
    this.onDisplayCompTitle(this.certificateModel.title);
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

  onUploadCompLogo(e) {
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
          } else if (data instanceof HttpResponse) {
            this.imageUploading = true;
            this.certificateModel.company_logo = data['body']['file_url'];
            this.secLogoImage(data['body']['file_url']);
          }
        },
        err => {
          this.imageUploading = false;
          this.errorMsgArr['company_logo'] = 'some_error_occurred';
          this.certificateModel.company_logo = '';
          this.secLogoImage('');
        }
      );
      e.target.value = null;
    } else {
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
      'custom_html': [this.certificateModel.custom_html],
      'color_code': [this.colorCodeBg != '' ? this.colorCodeBg : this.certificateModel.color_code != '' ? this.certificateModel.color_code : 'rgb(255,255,255)']
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
      this.certificateModel.color_code = this.colorCodeBg != '' ? this.colorCodeBg : this.certificateModel.color_code != '' ? this.certificateModel.color_code : 'rgb(255,255,255)';
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
      addData['custom_html'] = jQuery('.container-dragdrop').html();
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
    this.certificateService.editNewCertificate(formData, certificateID).subscribe(
      data => {
        this.process = false;
        if (publish) {
          this.redirectToStep2(certificateID);
        } else {
          this.router.navigate(['usercertificate']);
        }
        this.apiService.getWallet();
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

  addCertificate(addData, publish) {
    this.process = true;
    this.certificateService.addNewCertificates(addData).subscribe(
      res => {
        this.resAddCert = res;
        this.process = false;
        if (publish) {
          this.redirectToStep2(this.resAddCert.id);
        } else {
          this.router.navigate(['usercertificate']);
        }
        this.apiService.getWallet();
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

  geterrorMsg(field) {
    if (field === 'title') {
      return this.firstFormGroup.controls[field].hasError('required')
        || this.firstFormGroup.controls[field].hasError('whitespace') ? 'enter_a_value' : '';
    } else {
      return this.firstFormGroup.controls[field].hasError('required') ? 'enter_a_value' : '';
    }
  }

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
   * @description - Detele the certificate and add the reason for the deletion
   * @param certID - reason form data
   */
  reasonFormSubmit(formdata) {
    if (!this.reasonForm.invalid) {
      const params = {
        'certificate_id': this.certificateID,
        'reason_type': formdata.reason_type,
        'reason': formdata.reason
      };
      this.apiService.deleteCert(params).subscribe(
        data => {
          this.resDelete = data;
          if (this.resDelete.msg === 'Certificate deleted successfully.') {
            this.ngxSmartModalService.getModal('myModal').close();
            this.router.navigate(['usercertificate']);
            this.common.openSnackBar('cert_deleted_success', 'Close');
          }
        },
        err => {
        }
      );
    } else {
      this.reasonErrorMsg = 'error';
    }
  }

  /**
  * @description field error message display to the reason form
  * @param field field name
  */
  getreasonErrorMsg(field) {
    if (field === 'reason_type' || field === 'reason') {
      return this.reasonForm.controls[field].hasError('required') ? 'enter_a_value' : '';
    }
  }

  /**
   * @description add/remove validation dynamically based on the reason type selection
   * @param type reason type
   */
  getReasonType(type) {
    this.reasonTypeVal = type;
    this.disableYes = false;
    if (type === 5) {
      this.reasonForm.controls['reason'].setValidators(Validators.compose([Validators.required]));
      this.reasonForm.controls['reason'].updateValueAndValidity();
      this.hideOtherField = true;
    } else {
      this.reasonForm.controls['reason'].clearValidators();
      this.reasonForm.controls['reason'].updateValueAndValidity();
      this.hideOtherField = false;
    }
  }

  /**
   * @description - redirect to achievement form step2 form with course id
   * @param certID - course ID
   */
  redirectToStep2(certID) {
    if (this.apiService.remaining_wallet < 10 && !this.apiService.testMode) {
      this.ngxSmartModalService.getModal('planPopupInfo').open();
    } else {
      localStorage.setItem('redirectWithID', certID);
      localStorage.setItem('redirectWhich', 'cert');
      localStorage.setItem('redirectwhichcert', 'customcert');
      this.router.navigate(['newassign']);
    }
  }

  removeHtml(text) {
    return text ? text.replace(/(<([^>]+)>)/ig, '') : '';
  }

  /* dynamic cert */

  getEditorInstance(editorInstance: any) {
    this.quillEditorRef = editorInstance;
  }

  addSingleRow() {
    const contentAdd: HTMLParagraphElement = this.renderer.createElement('div');
    contentAdd.setAttribute('class', 'main');
    contentAdd.setAttribute('style', 'position:relative;');
    contentAdd.innerHTML = '<div class="contentaddhere" style="width:100%;display:inline-block;">Sample content</div>     <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button>        <button type="button" class="deleteRows" style="display:none;"><i class="material-icons">delete</i></button>';
    //contentAdd.innerHTML = '<div class="contentaddhere" style="width:100%;display:inline-block;padding: 10px;margin:5px 0;">Sample content</div>     <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button>        <button type="button" class="deleteRows" style="display:none;"><i class="material-icons">delete</i></button>';
    // this.renderer.appendChild(this.addcontent_here.nativeElement, contentAdd);
    jQuery('#dynamiccontent').last().append(contentAdd);
    if (jQuery('#dynamiccontent').find('div').length > 0) {
      jQuery('.placeholderAddContent').css('display', 'none');
    }
  }

  addColumnRow() {
    const contentAdd: HTMLParagraphElement = this.renderer.createElement('div');
    contentAdd.setAttribute('class', 'main');
    contentAdd.innerHTML = '<div class="main-sub"><div class="content-two" style="margin-right:10px;display:inline-block;float:left;"> <div class="contentaddhere" >Sample content</div>   <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button></div> <div class="content-two" style="display:inline-block;float:left;"><div class="contentaddhere" >Sample content</div> <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button></div></div>    <button type="button" class="deleteRows" style="display:none;"><i class="material-icons">delete</i></button>';
    //contentAdd.innerHTML = '<div class="main-sub"><div class="content-two" style="margin-right:10px;display:inline-block;float:left;"> <div class="contentaddhere" style="/*padding: 5px;margin:5px 0;*/">Sample content</div>   <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button></div> <div class="content-two" style="display:inline-block;float:left;"><div class="contentaddhere" style="/*padding:10px;margin:5px 0;*/">Sample content</div> <button type="button" class="editRow" style="display:none;"><i class="material-icons">edit</i></button></div></div>    <button type="button" class="deleteRows" style="display:none;"><i class="material-icons">delete</i></button>';
    // this.renderer.appendChild(this.addcontent_here.nativeElement, contentAdd);
    jQuery('#dynamiccontent').last().append(contentAdd);
    if (jQuery('#dynamiccontent').find('div').length > 0) {
      jQuery('.placeholderAddContent').css('display', 'none');
    }
  }

  onContentChanged(event) {
    this.currentEnteredVal = event.html;
  }

  submitContent() {
    jQuery('#' + this.currentId + ' .contentaddhere').html(this.currentEnteredVal);
    this.ngxSmartModalService.getModal('contentPopup').close();
  }

  ngOnDestroy() {
    // this.dragulaService.remove();
    this.dragulaService.destroy(this.MANY_ITEMS);
  }
}


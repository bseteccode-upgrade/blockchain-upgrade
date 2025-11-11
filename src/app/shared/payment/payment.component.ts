/*
 * File : payment.component.ts
 * Use: payment page content and strip payment submit option
 * Copyright : vottun 2019
 */
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PaymentService } from '../../service/payment.service';
import { ApiService } from '../../service/api.service';
import { CommonService } from '../../service/common.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
declare var braintree;

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { subscribeOn } from 'rxjs/operators';
declare var jQuery;
declare var Stripe;
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  elements: Elements;

  @ViewChild('cardElement') cardElement: ElementRef;
  stripe;
  card;
  cardErrors;
  confirmation;
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
  // stripeTest: FormGroup;
  paymentToken: string;
  plans: any = [];
  selectedPlan: any = {};
  successMsg: string;
  errorMsg: string;
  process = false;
  progress = false;
  loading = true;
  amountEthereum: any;
  currentUsdPrice: any;
  errResData: any;
  paymentView = false;
  paymentContent: any = {
    'message': ''
  };
  displayCount: any = 50;
  normalPlanAmount: any;
  multipleValue: any;
  apiDisplayCount: any = 50;
  apiPlanAmount: any;
  apiMultipleValue: any;
  normalPlanCourseAmount: any;
  apiPlanCourseAmount: any;
  apiCertAmount: any; normalCertAmount: any;
  plan: any = [];
  batchCount: any;
  radioSelectedPlan: any;
  totalAmount: any = 1;
  originalTotal: any;
  originalAmount: any = 1;
  normalPlanPurchased: any;
  apiPlanPurchased: any;
  subtractNormalValue: any;
  subtractApiValue: any;
  discountLists: any;
  paymentForm: FormGroup;
  errorMsgArr: any = [];
  defaultBadgeCount: any = {
    blockchain_clients: []
  };
  planID: any;
  lessAmount: any = 0;
  normalCertCount: any = 1;
  apiCertCount: any = 1;
  normalDiscount: any = 0;
  apiDiscount: any = 0;
  planNameNormal: any = '';
  planNameApi: any = '';
  currentPlan: any = [];
  planAlreadyPurchased = false;
  finalnormalPlanAmount: any;
  finalapiPlanAmount: any;
  initialPay = false;
  samePlan = false;
  displayPlanContent = false;
  apiTotalAmount = 0;
  normalTotalAmount = 0;
  errorMsgStrip = '';
  errorMsgStripArr: any = [];
  displayDiscountNormal = '';
  displayDiscountAPI = '';
  defaultBadgeCountselected: any;
  tokenStrip: any;
  setBlockchain = '';
  currencyLists = [
    { 'label': 'USD', 'value': 'usd' },
    { 'label': 'EUR', 'value': 'eur' },
  ];
  currencyKey = 'eur';
  currencyFormat = {
    usd: '$',
    eur: '€'
  };
  findNoDiscount = false;
  radioSelectedPlanDetails: any = {
    plan_amount: 0,
    plan_amount_eur: 0
  };
  resToken: any = [];
  card_token: any;
  paymentRes: any = [];
  resPayment: any = [];
  constructor(
    private paymentService: PaymentService,
    private apiService: ApiService,
    private common: CommonService,
    private router: Router,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private formbuilder: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService,
    public cdRef: ChangeDetectorRef,
    public route: ActivatedRoute
  ) {
    this.paymentForm = this.formbuilder.group({
      'plan1': [null],
      'plan2': [null],
      'currency': ['eur', Validators.compose([Validators.required])],
      'paymentplan': [null, Validators.compose([Validators.required])],
      'badgecountnormal': [null, Validators.compose([Validators.pattern(/^-?([0-9]\d*)?$/)])],
      'badgecountapi': [null, Validators.compose([Validators.pattern(/^-?([0-9]\d*)?$/)])],
      'blockchainselect': ['']
    });
    this.apiService.listDiscount().then(
      res => {
        this.discountLists = res;
        localStorage.setItem('discountData', JSON.stringify(this.discountLists));
        // if (this.apiService.userType === '2' || this.apiService.userType === '8') {
        // } else {
        //   this.common.openSnackBar('dont_have_privillege', 'Close');
        //   this.router.navigate(['/students']);
        // }
      });
  }

  geterrorMsgUser(field) {
    if (field === 'badgecountnormal' || field === 'badgecountapi') {
      return this.paymentForm.controls[field].hasError('pattern') ? 'enter_only_number' : '';
    } else {
      if (field === 'blockchainselect') {
        return this.paymentForm.controls[field].hasError('required') ? 'please_select_blockchain' : '';
      } else {
        return this.paymentForm.controls[field].hasError('required') ? 'you_must_select_one_plan' : '';
      }
    }
  }

  ngAfterViewInit() {
    // this.stripCall();
    // this.cdRef.detectChanges();
  }

  async ngOnInit() {
    this.stripe = Stripe(env.stripkey);
    const elements = this.stripe.elements();

    this.card = elements.create('card', {
      style: {
        base: {
          iconColor: '#31325F',
          color: '#31325F',
          lineHeight: '40px',
          fontWeight: 300,
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
          '::placeholder': {
            color: '#31325F'
          }
        }
      }
    });
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
      this.cardErrors = error && error.message;
    });
    this.cdRef.detectChanges();

    this.route.queryParams.subscribe(data => {
      if (data.payment_intent_client_secret && data.payment_intent_client_secret != null && typeof data.payment_intent_client_secret != 'undefined') {
        const that = this;
        // return false;
        // this.stripe.confirmCardPayment(data.payment_intent_client_secret).then(function (response) {
        //   console.log(response);
        //   if (response.error) {
        //     // Handle error here
        //     that.errorMsgStrip = response.error.message;
        //     that.ngxSmartModalService.getModal('successModel').open();
        //   } else if (response.paymentIntent && response.paymentIntent.status === 'succeeded') {
        setTimeout(() => {
          const cardInfo = JSON.parse(localStorage.getItem('card'));
          const obj = {
            p_i_id: data.payment_intent,
            plan: cardInfo.plan,
            batch: cardInfo.batch,
            add_batch: cardInfo.add_batch,
            blockchainclient: cardInfo.blockchainclient,
          };
          this.paymentService.confirmPaymentAPI(obj).subscribe(response => {
            this.resPayment = response;
            if (this.resPayment.msg === 'succeeded') {
              this.errorMsgStrip = '';
              this.ngxSmartModalService.getModal('successModel').open();
            } else {
              this.errorMsgStrip = this.resPayment.error.msg;
              this.ngxSmartModalService.getModal('successModel').open();
            }
          }, error => {
            this.errorMsgStrip = error.error.msg;
            this.ngxSmartModalService.getModal('successModel').open();
          });

          this.paymentService.getPlans().toPromise().then(resdata => {
            localStorage.setItem('paymentPlan', JSON.stringify(resdata));
          });
        }, 500);
        //   }
        // });
      }
    });
    setTimeout(() => {
      if (!this.apiService.userVerified && this.apiService.user.register_type === '2') {
        this.ngxSmartModalService.getModal('userVerifyPopup').open();
      }
    }, 500);
    this.paymentService.getPlansContent().subscribe(data => {
      this.paymentContent = data;
    });
    this.loading = true;
    let planList: any = [];
    this.paymentService.getDefaultBadgeCount().subscribe(row => {
      this.defaultBadgeCount = row;
      this.defaultBadgeCountselected = 50;
      this.paymentForm.controls['badgecountnormal'].setValue('50');
      this.paymentForm.controls['badgecountapi'].setValue('50');
    });
    if (localStorage.getItem('paymentPlan') !== '' && localStorage.getItem('paymentPlan') !== null) {
      planList = JSON.parse(localStorage.getItem('paymentPlan'));
      this.commonPlanCall(JSON.parse(localStorage.getItem('paymentPlan')));
      this.loading = false;
    } else {
      this.paymentService.getPlans().toPromise().then(data => {
        planList = data;
        this.commonPlanCall(data);
        localStorage.setItem('paymentPlan', JSON.stringify(planList));
      }, err => {
        this.loading = false;
      });
    }
  }

  callCurrencyCalculation(currencyVal, radio) {
    this.currencyKey = currencyVal;
    this.commonPlanCall(JSON.parse(localStorage.getItem('paymentPlan')), 'currencycall', radio);
  }

  discountCalculate(amount, certCount, batchAmount, whichPlan) {
    this.discountLists = JSON.parse(localStorage.getItem('discountData'));
    if (typeof this.discountLists !== 'undefined' && this.discountLists !== null && this.discountLists !== []) {
      this.findNoDiscount = false;
      this.discountLists.map((x, index) => {
        if (certCount >= x.from_certificate && certCount <= x.to_certificate) {
          this.findNoDiscount = true;
          if (x.type === 'Percentage') {
            if (whichPlan === 'normal') {
              this.displayDiscountNormal = x.discount + '%';
              this.normalDiscount = (batchAmount * (x.discount / 100)).toFixed(2);
              this.finalnormalPlanAmount = (this.normalPlanAmount - this.normalDiscount).toFixed(2);
            } else {
              this.displayDiscountAPI = x.discount + '%';
              this.apiDiscount = (batchAmount * (x.discount / 100)).toFixed(2);
              this.finalapiPlanAmount = (this.apiPlanAmount - this.apiDiscount).toFixed(2);
            }
            amount = amount - (amount * (x.discount / 100));
          } else {
            if (whichPlan === 'normal') {
              this.displayDiscountNormal = '$' + x.discount;
              this.normalDiscount = (x.discount).toFixed(2);
              this.finalnormalPlanAmount = (this.normalPlanAmount - this.normalDiscount).toFixed(2);
            } else {
              this.displayDiscountAPI = '$' + x.discount;
              this.apiDiscount = (x.discount).toFixed(2);
              this.finalapiPlanAmount = (this.apiPlanAmount - this.apiDiscount).toFixed(2);
            }
            amount = amount - x.discount;
          }
        }
        if ((index === this.discountLists.length - 1) && this.findNoDiscount === false) {
          if (whichPlan === 'normal') {
            this.displayDiscountNormal = '$' + '0.00';
            this.normalDiscount = '0.00';
            this.finalnormalPlanAmount = (this.normalPlanAmount).toFixed(2);
          } else {
            this.displayDiscountAPI = '$' + '0.00';
            this.apiDiscount = '0.00';
            this.finalapiPlanAmount = (this.apiPlanAmount).toFixed(2);
          }
          amount = amount + 0.00;
        }
      });
    }
    this.originalTotal = amount;
    if (whichPlan === 'normal') {
      if (this.apiPlanPurchased) {
        this.originalAmount = (this.multipleValue - this.normalDiscount).toFixed(2);
        this.normalTotalAmount = this.multipleValue - this.normalDiscount;
      } else {
        if (this.plans[1]) {
          this.originalAmount = (this.plans[1][this.currencyKey]['amount'] - this.subtractNormalValue + this.multipleValue - this.normalDiscount).toFixed(2);
          this.normalTotalAmount = this.plans[1][this.currencyKey]['amount'] - this.subtractNormalValue + this.multipleValue - this.normalDiscount;
        } else {
          this.originalAmount = 0;
          this.normalTotalAmount = 0;
        }
      }

    } else if (whichPlan === 'api') {
      if (this.normalPlanPurchased) {
        if (this.plans[1]) {
          this.originalAmount = (this.plans[0][this.currencyKey]['amount'] - this.plans[1][this.currencyKey]['amount'] + this.apiMultipleValue - this.apiDiscount).toFixed(2);
          this.apiTotalAmount = this.plans[0][this.currencyKey]['amount'] - this.plans[1][this.currencyKey]['amount'] + this.apiMultipleValue - this.apiDiscount;
        } else {
          this.originalAmount = 0;
          this.normalTotalAmount = 0;
        }
      } else {
        this.originalAmount = (this.plans[0][this.currencyKey]['amount'] - this.subtractApiValue + this.apiMultipleValue - this.apiDiscount).toFixed(2);
        this.apiTotalAmount = this.plans[0][this.currencyKey]['amount'] - this.subtractApiValue + this.apiMultipleValue - this.apiDiscount;
      }
    }
    if (this.radioSelectedPlan === 'api') {
      if (this.normalPlanPurchased) {
        this.samePlan = false;
      } else {
        this.samePlan = this.normalPlanPurchased ? false : true;
      }
      this.originalAmount = (this.apiTotalAmount).toFixed(2);
    } else if (this.radioSelectedPlan === 'normal') {
      if (this.apiPlanPurchased) {
        this.samePlan = false;
      } else {
        this.samePlan = this.apiPlanPurchased ? false : true;
      }
      this.originalAmount = (this.normalTotalAmount).toFixed(2);
    }
  }

  onClosePopupVerify() {
    this.ngxSmartModalService.getModal('userVerifyPopup').close();
    this.router.navigate(['accountsetting']);
  }

  commonPlanCall(planData, defaultCurrency = 'usd', radio = '') {
    this.plans = planData;
    if (this.plans.length > 0) {
      this.loading = false;
      this.planNameNormal = this.plans[1] ? this.plans[1].plan_name : 'nothing';
      this.planNameApi = this.plans[0].plan_name;
      this.apiPlanCourseAmount = this.plans[0][this.currencyKey].limit;
      this.normalPlanCourseAmount = this.plans[1] ? this.plans[1][this.currencyKey].limit : 0;
      this.apiCertAmount = this.plans[0][this.currencyKey].certificate;
      this.normalCertAmount = this.plans[1] ? this.plans[1][this.currencyKey].certificate : 0;
      this.normalPlanPurchased = this.plans[1] ? this.plans[1].is_default : false;
      this.apiPlanPurchased = this.plans[0].is_default;
      if (radio == '') {
        this.radioSelectedPlan = this.apiPlanPurchased ? 'api' : 'normal';
      }

      // if (defaultCurrency === 'currencycall') {
      //   this.currencyKey = this.currencyKey;
      // } else {
      //   this.currencyKey = this.plans[0].current_cur && this.plans[0].current_cur !== 'none' ? this.plans[0].current_cur : this.currencyKey;
      // }
      if (this.normalPlanPurchased || this.apiPlanPurchased) {
        this.paymentForm.controls['paymentplan'].setValue(this.normalPlanPurchased ? 'normal' : this.apiPlanPurchased ? 'api' : null);
      } else {
        if (this.paymentForm.controls['paymentplan'].value) {
        } else {
          this.paymentForm.controls['paymentplan'].setValue(null);
        }
      }
      this.plan = this.plans.find(x => x.is_default === true);
      this.plans.find(x => {
        if (x.is_default === false) {
          this.lessAmount = x.lessamount;
        } else {
          if (radio != '') {
            this.currentPlan = this.plans.find(y => y.is_default === true);
          } else {
            this.currentPlan = x;
          }
        }
      });
      if (this.plans[1]) {
        if (this.plans[0]['is_default'] === false && this.plans[1]['is_default'] === false) {
          this.planAlreadyPurchased = false;
          this.initialPay = true;
          if (this.defaultBadgeCount.blockchainselect) {
          } else {
            if (this.apiService.blockchain_client == '') {
              this.paymentForm.controls['blockchainselect'].setValidators([Validators.required]);
            }
          }
        } else {
          this.paymentForm.controls['blockchainselect'].setValidators(null);
          this.planAlreadyPurchased = true;
          this.initialPay = false;
        }
        this.paymentForm.updateValueAndValidity();
      } else {
        if (this.plans[0]['is_default'] === false) {
          this.planAlreadyPurchased = false;
          this.initialPay = true;
          if (this.defaultBadgeCount.blockchainselect) {
          } else {
            if (this.apiService.blockchain_client == '') {
              this.paymentForm.controls['blockchainselect'].setValidators([Validators.required]);
            }
          }
        } else {
          this.paymentForm.controls['blockchainselect'].setValidators(null);
          this.planAlreadyPurchased = true;
          this.initialPay = false;
        }
        this.paymentForm.updateValueAndValidity();
      }

      setTimeout(() => {
        const normalCertCountInitial = this.displayCount;
        this.multipleValue = this.displayCount * this.normalCertAmount;
        if (this.plans[1]) {
          this.subtractNormalValue = this.normalPlanPurchased ? this.plans[1][this.currencyKey]['amount'] : 0;
          this.normalPlanAmount = this.plans[1][this.currencyKey]['amount'] - this.subtractNormalValue + this.multipleValue;
        } else {
          this.subtractNormalValue = 0;
          this.normalPlanAmount = 0;
        }
        this.discountCalculate(this.normalPlanAmount, normalCertCountInitial, this.multipleValue, 'normal');
        const apiCertCountInitial = this.apiDisplayCount;
        this.apiMultipleValue = this.apiDisplayCount * this.apiCertAmount;
        this.subtractApiValue = this.apiPlanPurchased ? this.plans[0][this.currencyKey]['amount'] : 0;
        this.apiPlanAmount = this.plans[0][this.currencyKey]['amount'] - this.subtractApiValue + this.apiMultipleValue;
        this.discountCalculate(this.apiPlanAmount, apiCertCountInitial, this.apiMultipleValue, 'api');
        if (this.planAlreadyPurchased) {
          if (radio != '') {
            this.selectPlan(this.radioSelectedPlanDetails, this.radioSelectedPlan);
          } else {
            this.selectPlan(this.plan, this.radioSelectedPlan);
          }
        } else {
          if (this.plans.length === 1 && this.paymentForm.valid) {
            this.selectPlan(this.plans[0], 'api');
          }
        }
      }, 500);
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  stripCall() {
    // this.stripeTest = this.fb.group({});
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#31325F',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#31325F'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }

      });
  }

  selectPlan(plan, planName) {
    this.paymentForm.controls['paymentplan'].setValue(planName);
    this.radioSelectedPlan = planName;
    this.radioSelectedPlanDetails = plan;
    this.plan = plan;
    if (planName === 'api') {
      this.apiCertCount = this.apiDisplayCount;
      this.apiPlanAmount = this.plans[0][this.currencyKey]['amount'] - this.subtractApiValue + this.apiMultipleValue;
      this.discountCalculate(this.apiPlanAmount, this.apiCertCount, this.apiMultipleValue, planName);
    }
    if (planName === 'normal') {
      this.normalCertCount = this.displayCount;
      if (this.plans[1]) {
        this.normalPlanAmount = this.plans[1][this.currencyKey]['amount'] - this.subtractNormalValue + this.multipleValue;
      } else {
        this.normalPlanAmount = 0;
      }
      this.discountCalculate(this.normalPlanAmount, this.normalCertCount, this.multipleValue, planName);
    }
  }

  withOutStripSubmit() {
    this.process = true;
    // this.makePayment([]);
  }

  resetSelectFieldError() {
    this.errorMsgStripArr = [];
  }

  buy() {
    this.process = true;
    this.errorMsgStrip = '';
    this.errorMsgStripArr = [];
    // if (this.stripeTest.invalid) {
    //   this.errorMsgStripArr['blockchainselect'] = 'please_select_blockchain';
    //   this.process = false;
    //   return false;
    // }
    this.stripe
      .createToken(this.card).then(token => {
        if (token.token) {
          if (this.initialPay) {
            this.paymentsubmit(token.token, token);
          } else {
            this.makePayment(token.token, token);
          }
        } else if (token.error) {
          this.process = false;
          this.errorMsgStrip = token.error.message;
        }
      });
  }

  paymentsubmit(token, tokenDetails) {
    this.card_token = token.card.id;
    this.tokenStrip = token;
    this.makePayment(this.tokenStrip, tokenDetails);
  }

  initializePayment() {
    this.errorMsg = '';
    this.totalAmount = this.radioSelectedPlan === 'api' ? this.apiPlanAmount : this.normalPlanAmount;
    if (this.paymentForm.valid) {
      if (this.paymentForm.controls['badgecountnormal'].value === 1 && this.paymentForm.controls['paymentplan'].value === 'normal') {
        this.errorMsg = 'error';
        this.errorMsgArr['badgecountapi'] = '';
        this.errorMsgArr['badgecountnormal'] = 'enter_a_value';
        return false;
      } else if (this.paymentForm.controls['badgecountnormal'].value <= 1 && this.paymentForm.controls['paymentplan'].value === 'normal') {
        this.errorMsg = 'error';
        this.errorMsgArr['badgecountapi'] = '';
        this.errorMsgArr['badgecountnormal'] = 'enter_a_value';
        return false;
      } else if (this.paymentForm.controls['badgecountapi'].value <= 1 && this.paymentForm.controls['paymentplan'].value === 'api') {
        this.errorMsg = 'error';
        this.errorMsgArr['badgecountnormal'] = '';
        this.errorMsgArr['badgecountapi'] = 'enter_a_value';
        return false;
      } else if (this.paymentForm.controls['badgecountapi'].value === 1 && this.paymentForm.controls['paymentplan'].value === 'api') {
        this.errorMsg = 'error';
        this.errorMsgArr['badgecountnormal'] = '';
        this.errorMsgArr['badgecountapi'] = 'enter_a_value';
        return false;
      }
      this.paymentView = true;
      this.progress = false;
      this.errorMsg = '';
      this.ngxSmartModalService.getModal('myModal').open();
    } else {
      this.errorMsg = 'error';
    }
  }

  makePayment(result, tokenDetails) {
    this.card_token = tokenDetails.token.card.id;
    const obj = {
      plan: this.plan.id,
      payment_token: result.id,
      amount: this.radioSelectedPlan === 'api' ? this.apiTotalAmount : this.normalTotalAmount,
      batch: this.radioSelectedPlan === 'api' ? this.apiDisplayCount / 10 : this.displayCount / 10,
      add_batch: this.plan.is_default ? 1 : 0,
      blockchainclient: this.paymentForm.controls['blockchainselect'].value ? this.paymentForm.controls['blockchainselect'].value : null,
      currency: this.currencyKey,
      card_token: this.card_token,
      nativeElement: jQuery('#3dlayout')
    };

    localStorage.setItem('card', JSON.stringify(obj));
    this.paymentService.makePayment(obj).subscribe(
      data => {
        this.paymentRes = data;
        this.process = false;
        this.apiService.user.notification_flag = false;
        this.apiService.getWallet();
        this.paymentService.getPlansSingle();

        if (this.paymentRes.error) {
          this.ngxSmartModalService.getModal('myModal').close();
          this.errorMsgStrip = this.paymentRes.error;
        } else if (this.paymentRes.msg === 'Success') {
          this.ngxSmartModalService.getModal('myModal').close();
          if (this.paymentRes.url && this.paymentRes.url != null && this.paymentRes.url != 'None') {
            window.location.href = this.paymentRes.url;
          } else {
            this.errorMsgStrip = '';
            this.successPaymentCall(this.paymentRes.pid);
            // this.ngxSmartModalService.getModal('successModel').open();
          }
        } else {
          this.ngxSmartModalService.getModal('myModal').close();
          this.errorMsgStrip = 'payment_failed';
        }
      },
      err => {
        this.ngxSmartModalService.getModal('myModal').close();
        this.process = false;
        if (err.status === 400 || err.status === 406) {
          this.errorMsgStrip = err.error.msg;
        } else {
          this.errorMsgStrip = 'payment_failed';
        }
      }
    );
  }

  // create3DSecure(paymentRequest, resolve, reject) {
  //   return (status, cardResponse) => {

  //     if (status !== 200 || cardResponse.error) {  // problem
  //       reject(cardResponse.error);
  //     } else if (cardResponse.card.three_d_secure === 'not_supported' && cardResponse.status === 'chargeable') {
  //       resolve(cardResponse);
  //     } else if (cardResponse.card.three_d_secure === 'optional' || cardResponse.card.three_d_secure === 'required') {
  //       const onCreate3DSecureCallback = this.createIframe(paymentRequest, resolve);

  //       Stripe.source.create({
  //         type: 'three_d_secure',
  //         amount: paymentRequest.amount,
  //         currency: paymentRequest.currency,
  //         three_d_secure: { card: cardResponse.id },
  //         redirect: { return_url: window.location.href }
  //       }, onCreate3DSecureCallback);
  //     } else {
  //       reject(cardResponse);
  //     }
  //   };
  // }

  onNormalPlan(val) {
    this.errorMsg = '';
    if (val > 0 && val !== '') {
      this.displayCount = val;
    } else {
      this.displayCount = val.replace(/[^0-9]/g, '');
    }
    this.normalCertCount = this.displayCount;
    this.multipleValue = this.normalCertCount * this.normalCertAmount;
    if (this.plans[1]) {
      this.subtractNormalValue = this.normalPlanPurchased ? this.plans[1][this.currencyKey]['amount'] : 0;
      this.normalPlanAmount = this.plans[1][this.currencyKey]['amount'] - this.subtractNormalValue + this.multipleValue;
    } else {
      this.subtractNormalValue = 0;
      this.normalPlanAmount = 0;
    }
    this.discountCalculate(this.normalPlanAmount, this.normalCertCount, this.multipleValue, 'normal');
  }

  onApiPlan(val) {
    this.errorMsg = '';
    if (val > 0 && val !== '') {
      this.apiDisplayCount = val;
    } else {
      this.apiDisplayCount = val.replace(/[^0-9]/g, '');
    }
    this.apiCertCount = this.apiDisplayCount;
    this.apiMultipleValue = this.apiCertCount * this.apiCertAmount;
    this.subtractApiValue = this.apiPlanPurchased ? this.plans[0][this.currencyKey]['amount'] : 0;
    this.apiPlanAmount = this.plans[0][this.currencyKey]['amount'] - this.subtractApiValue + this.apiMultipleValue;
    this.discountCalculate(this.apiPlanAmount, this.apiCertCount, this.apiMultipleValue, 'api');
  }

  closeMyModelPopup() {
    this.ngxSmartModalService.getModal('myModal').close();
  }

  closeOtherPopup() {
    // this.ngxSmartModalService.getModal('otherModel').close();
  }

  closeSuccessPopup() {
    this.ngxSmartModalService.getModal('successModel').close();
    if (this.apiService.user.register_type === '3') {
      this.router.navigate(['/productlist']);
    }
    if (this.apiService.user.register_type === '2') {
      this.router.navigate(['/students']);
    }
  }

  successPaymentCall(pid) {
    const cardInfo = JSON.parse(localStorage.getItem('card'));
    const obj = {
      p_i_id: pid,
      plan: cardInfo.plan,
      batch: cardInfo.batch,
      add_batch: cardInfo.add_batch,
      blockchainclient: cardInfo.blockchainclient,
    };
    this.paymentService.confirmPaymentAPI(obj).subscribe(response => {
      this.ngxSmartModalService.getModal('myModal').close();
      this.resPayment = response;
      if (this.resPayment.msg === 'succeeded') {
        this.errorMsgStrip = '';
        this.ngxSmartModalService.getModal('successModel').open();
      } else {
        this.errorMsgStrip = this.resPayment.error.msg;
        this.ngxSmartModalService.getModal('successModel').open();
      }
    }, error => {
      this.ngxSmartModalService.getModal('myModal').close();
      this.errorMsgStrip = error.error.msg;
      this.ngxSmartModalService.getModal('successModel').open();
    });
    this.apiService.getWallet();
    this.paymentService.getPlans().toPromise().then(resdata => {
      localStorage.setItem('paymentPlan', JSON.stringify(resdata));
    });
  }

}

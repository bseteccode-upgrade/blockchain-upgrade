import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { RegisterComponent } from './register/register.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { BadgeDetailComponent } from './badge-detail/badge-detail.component';
import { ActivityProductComponent } from './activity-product/activity-product.component';
import { IndexComponent } from './index/index.component';
import { AchievementSearchComponent } from './achievement-search/achievement-search.component';
import { StudentSearchComponent } from './student-search/student-search.component';
import { StudentsearchListComponent } from './studentsearch-list/studentsearch-list.component';
import { AcitvityProcductLocComponent } from './acitvity-procduct-loc/acitvity-procduct-loc.component';
import { ApiregisterComponent } from './apiregister/apiregister.component';
import { SupViewProductComponent } from './sup-view-product/sup-view-product.component';
import { RegistersupplychainComponent } from './registersupplychain/registersupplychain.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { AutologinComponent } from './autologin/autologin.component';
import { SecurestudentlogComponent } from './securestudentlog/securestudentlog.component';
import { SecureloginComponent } from './securelogin/securelogin.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'securelog/:token/:regtype', component: SecureloginComponent },
  { path: 'student/secure/log/:token', component: SecurestudentlogComponent },
  { path: 'signin/:id', component: SigninComponent },
  { path: 'autologin/:token', component: AutologinComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'api-register', component: ApiregisterComponent },
  // { path: 'supply-register', component: RegistersupplychainComponent },
  { path: 'reset', component: ResetPwdComponent },
  { path: 'forgot-pwd', component: ForgotPwdComponent },
  { path: 'badgedetail', component: BadgeDetailComponent },
  { path: 'batches', component: ActivityProductComponent },
  { path: 'embed/achievementsearch', component: AchievementSearchComponent },
  { path: 'embed/studentsearch', component: StudentSearchComponent },
  { path: 'embed/studentlist', component: StudentsearchListComponent },
  { path: 'prductlocation', component: AcitvityProcductLocComponent },
  { path: 'viewproduct/:id', component: SupViewProductComponent },
  { path: '', component: SigninComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        enableTracing: false
      })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

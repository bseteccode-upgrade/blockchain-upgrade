import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificatesComponent } from './certificates/certificates.component';
import { AccountSettingComponent } from '../shared/account-setting/account-setting.component';
import { ChangePwdComponent } from '../shared/change-pwd/change-pwd.component';
import { MoocListComponent } from './mooc-list/mooc-list.component';
import { StudentComponent } from './student.component';
import { MoocCertificateComponent } from './mooc-certificate/mooc-certificate.component';
import { YourcredentialComponent } from './yourcredential/yourcredential.component';
import { AuthGuard } from '../service/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'accountsetting', component: AccountSettingComponent },
      { path: 'changepwd', component: ChangePwdComponent},
      { path: 'certificates', component: CertificatesComponent},
      { path: 'credential', component: YourcredentialComponent},
      // { path: 'mooc', component: MoocCertificateComponent},
      // { path: 'mooc/:id', component: MoocCertificateComponent},
      // { path: 'mooc-list', component: MoocListComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }

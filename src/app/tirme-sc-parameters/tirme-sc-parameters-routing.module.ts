import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../service/auth.guard';
import { TirmeSCSParametersComponent } from './tirme-scs-parameters/tirme-scs-parameters.component';
import { TirmeSCParametersComponent } from './tirme-sc-parameters.component';

const routes: Routes = [
  {
    path: '',
    component: TirmeSCParametersComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'tirme-sc-parameters', component: TirmeSCSParametersComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrmeSCParametersRoutingModule { }

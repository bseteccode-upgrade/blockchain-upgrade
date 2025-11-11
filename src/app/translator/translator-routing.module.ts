import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../service/auth.guard';
import { TranslatorComponent } from './translator.component';
import { LanguagesComponent } from './languages/languages.component';

const routes: Routes = [
  {
    path: '',
    component: TranslatorComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'languages', component: LanguagesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TranslatorRoutingModule { }

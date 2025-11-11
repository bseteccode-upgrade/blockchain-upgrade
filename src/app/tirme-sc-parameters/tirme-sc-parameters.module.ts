import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../share.module';

import { TrmeSCParametersRoutingModule } from './tirme-sc-parameters-routing.module';
import { TirmeSCParametersComponent } from './tirme-sc-parameters.component';
import { TirmeSCSParametersComponent } from './tirme-scs-parameters/tirme-scs-parameters.component';
import { TirmeSCParametersService } from './services/tirme-sc-parameters.service';

@NgModule({
  imports: [
    CommonModule,
    TrmeSCParametersRoutingModule,
    ShareModule,
  ],
  declarations: [
    TirmeSCSParametersComponent,
    TirmeSCParametersComponent,
  ],
  providers: [
    TirmeSCParametersService,
  ]
})
export class TirmeSCParametersModule { }

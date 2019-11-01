import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { LivesessionComponent } from './livesession.component';
import { LivesessionRoutingModule } from './livesession-routing.module';
// import { NgxSelectModule  } from 'ngx-select-ex';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    LivesessionRoutingModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    NgbModule
  ],
  declarations: [LivesessionComponent]
})
export class LivesessionModule { }

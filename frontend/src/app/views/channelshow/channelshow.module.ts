import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ChannelshowComponent } from './channelshow.component';
import { ChannelshowRoutingModule } from './channelshow-routing.module';
// import { NgxSelectModule  } from 'ngx-select-ex';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ChannelshowRoutingModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    NgbModule
  ],
  declarations: [ChannelshowComponent]
})
export class ChannelshowModule { }

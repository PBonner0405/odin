import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { ChannelComponent } from './channel.component';
import { ChannelRoutingModule } from './channel-routing.module';
import { NgxSelectModule  } from 'ngx-select-ex';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ChannelRoutingModule,
    BsDropdownModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    NgxSelectModule
  ],
  declarations: [ChannelComponent]
})
export class ChannelModule { }

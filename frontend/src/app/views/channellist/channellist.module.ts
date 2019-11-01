import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgxSelectModule  } from 'ngx-select-ex';
import { NgxTextOverflowClampModule } from "ngx-text-overflow-clamp";

import { ChannellistComponent } from './channellist.component';
import { ChannellistRoutingModule } from './channellist-routing.module';
// import { NgxSelectModule  } from 'ngx-select-ex';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ChannellistRoutingModule,
    BsDropdownModule,
    NgxSelectModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    NgxTextOverflowClampModule
    // NgxSelectModule
  ],
  declarations: [ChannellistComponent]
})
export class ChannellistModule { }

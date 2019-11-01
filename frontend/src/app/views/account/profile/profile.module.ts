import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';  
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSelectModule  } from 'ngx-select-ex';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';


@NgModule({
  imports: [
    FormsModule,
    ProfileRoutingModule,
    CommonModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxSelectModule
  ],
  declarations: [ ProfileComponent ]
})
export class ProfileModule { }

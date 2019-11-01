import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common'
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FullCalendarModule } from 'ng-fullcalendar'; // for FullCalendar!
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';

import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ScheduleRoutingModule,
    BsDropdownModule,
    FullCalendarModule, // for FullCalendar!
    // DlDateTimeDateModule,  // <--- Determines the data type of the model
    // DlDateTimePickerModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    NgbModule
  ],
  providers: [DatePipe],
  declarations: [ScheduleComponent],
})
export class ScheduleModule { }

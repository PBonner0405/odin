import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { OptionsInput } from '@fullcalendar/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import { EventService, SocketService, CommonService, GlobalService } from '../../../services';
import { environment } from '../../../../environments/environment';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
declare var $: any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  @ViewChild('fullcalendar', null) fullcalendar: CalendarComponent;
  @ViewChild('eventProModal', null) propertyModal: ModalDirective;
  @ViewChild('addEventModal', null) addEventModal: ModalDirective;
  @ViewChild('editEventModal', null) editEventModal: ModalDirective;
  @ViewChild('warningModal', null) warningModal: ModalDirective;
  @ViewChild('aboutModal', null) aboutModal: ModalDirective;

  userAvatarPath: any;

  calendaroptions: OptionsInput;
  eventsModel: any;
  upcommingevents: any = [];
  eventtype: any = [];
  selectedEvent: any;

  eventsubscribe: any;

  tempEvent: any = {
    title: "",
    start: "",
    end: "",
    duration: "",
    description: "",
    type: "private",
    channel: "",
    source: "",
    partnerid: ""
  };

  editEvent: any = {
    title: "",
    start: "",
    end: "",
    duration: "",
    description: "",
    type: "",
    channel: ""
  };

  isWrongTitle: boolean = false;
  isWrongStart: boolean = false;
  // isWrongEnd: boolean = false;
  // isWrongStartEnd: boolean = false;
  isWrongDuration: boolean = false;
  isWrongDescription: boolean = false;
  isWrongChannel: boolean = false;

  warningDescription: String = "The schedule you want to add, is conflicting with others...";

  selectedEventPartner: any = {};

  selectedEventProperty: any = {
    id: "",
    userid: "",
    title: "",
    start: "",
    end: "",
    description: "",
    type: "",
    channel: "",
    source: "",
    partnerid: ""
  }

  constructor(public eventService: EventService, public socketService: SocketService, public commonService: CommonService, public globalService: GlobalService, public datepipe: DatePipe, public ngZone: NgZone) {
    
    this.userAvatarPath = environment.USER_AVATAR_PATH;
    
    this.eventtype = this.commonService.subjectType;
    this.tempEvent.type = "private";
    this.calendaroptions = {
      editable: true,
      eventLimit: true,
      header: {
        left: 'prev,next ',
        center: 'title',
        right: 'today'
      },
      plugins: [interactionPlugin, dayGridPlugin, bootstrapPlugin, timeGridPlugin],
      themeSystem: 'bootstrap',
      eventRender: function (info) {
        // info.eventColor: '#378006';
        if (new Date() > new Date(info.event.start)) {
          info.el.style.backgroundColor = '#ffc107';
          info.el.style.borderColor = '#ffc107';
        }
        else {
          if (info.event._def.extendedProps.type == "private") {
            info.el.style.backgroundColor = '#378006';
            info.el.style.borderColor = '#378006';
          }
        }
      }
    };

    this.eventsubscribe = this.socketService.onReceiveEvent().subscribe(msg => {          //get all events by server through socket.
      this.ngZone.run(async () => {
        // console.log('got a all events: ' + msg);
        var msgObj = JSON.parse(msg);
        this.eventService.setEvents(msgObj);
        this.eventsModel = this.calendaroptions.events = this.eventService.getEvents();
        this.eventService.getEvents().subscribe(data => {
          this.ngZone.run(async () => {
            this.eventsModel = this.calendaroptions.events = data;
            console.log("events:", this.eventsModel);
            var i, j;
            this.upcommingevents = [];
            for (i = 0; i < data.length; i++) {
              if (new Date() < new Date(data[i].start)) {
                // data[i].start = this.customizedDate(new Date(data[i].start));
                // data[i].end = this.customizedDate(new Date(data[i].end));

                var tempObj: any = data[i];
                if (tempObj.source != "self") {
                  for (j = 0; j < this.commonService.registerUsers.length; j++) {
                    if (this.commonService.registerUsers[j].userdata._id == tempObj.partnerid) {
                      tempObj.partner = this.commonService.registerUsers[j].userdata;
                      tempObj.partnerstatus = this.commonService.registerUsers[j].status;
                      tempObj.partnerrating = this.commonService.registerUsers[j].rating;
                      console.log("avatarpath", environment.USER_AVATAR_PATH);
                      console.log("avatarname", tempObj.partner.avatarname);
                //      tempObj.partner.avatarname = environment.USER_AVATAR_PATH + tempObj.partner.avatarname;
                      console.log("set partner:", data[i]);
                      break;
                    }
                  }
                }

                tempObj.start = new Date(tempObj.start);
                tempObj.end = new Date(tempObj.end);
                this.upcommingevents.push(tempObj);
              }
            }

            for (i = 0; i < this.upcommingevents.length - 1; i++) {        //sort upcomming events
              for (j = i + 1; j < this.upcommingevents.length; j++) {
                if (new Date(this.upcommingevents[i].start) > new Date(this.upcommingevents[j].start)) {
                  var temp = this.upcommingevents[i];
                  this.upcommingevents[i] = this.upcommingevents[j];
                  this.upcommingevents[j] = temp;
                }
              }
            }

            console.log("upcomming events:", this.upcommingevents);
          });
        });
      });
    });
  }

  customizedDate(paramDate: Date) : any {
    const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var hour: any;
    var AP: any;
    if(paramDate.getHours() >= 12) {
      AP = 'p.m.';
    } else{
      AP = 'a.m.';
    }
    hour = paramDate.getHours()%12;
    let formatted_date = weekdays[paramDate.getDay()] + " " + months[paramDate.getMonth()] + " " + paramDate.getDate()+" "+hour+":"+(paramDate.getMinutes()!=0?paramDate.getMinutes():"00")+" "+AP;
    return formatted_date;
  }

  ngOnInit(): void {
    this.eventService.sendEventRequest()
      .then(res => {
        console.log(res);
        if (res.success) {
        } else {
        }
      }).catch(error => {
        console.log(error);
      })
  }

  ngOnDestroy(): void {
    this.eventsubscribe.unsubscribe();
  }

  eventClick(model) {
    console.log("eventClick", model);
    this.selectedEvent = model;
    this.propertyModal.show();
  }
  eventDragStop(model) {
    console.log("eventDragStop", model);
  }
  eventDrop(model) {
    console.log("eventDrop:", model);
    this.eventService.changeEvent(model.event._def.extendedProps._id,
      {
        title: model.event.title,
        start: model.event.start,
        end: model.event.end,
        type: model.event._def.extendedProps.type,
        channel: model.event._def.extendedProps.channel,
        description: model.event._def.extendedProps.description
      })
      .then(res => {
        console.log(res);
        if (res.success) {

        } else {
          if (res.message == "This event you want to change, is conflicting with others!") {
            this.warningDescription = "The schedule you want to change, is conflicting with others...";
            this.warningModal.show();
          }
          else {
            this.warningDescription = res.message;
            this.warningModal.show();
          }
        }
        this.addEventModal.hide();
      }).catch(error => {
        console.log(error);
        this.addEventModal.hide();
      })
  }
  clickButton(model) {
    console.log("eventClickButton", model);
  }
  dateClick(model) {
    console.log("dateClick", model);
  }
  updateEvents() {
    console.log("update event log");
    this.eventsModel = [{
      title: 'Updaten Event',
      start: this.yearMonth + '-08',
      end: this.yearMonth + '-10'
    }];
  }

  editSelectedEvent() {
    var i;
    for (i = 0; i < this.eventService.eventData.length; i++) {
      if (this.eventService.eventData[i]._id == this.selectedEvent.event._def.extendedProps._id) {
        this.editEvent = this.eventService.eventData[i];
        console.log("===========================event start==========================");
        console.log(this.eventService.eventData[i].start);
        console.log(new Date(this.eventService.eventData[i].start));
        this.editEvent.start = this.datepipe.transform(new Date(this.eventService.eventData[i].start), 'yyyy-MM-ddTHH:mm');
        console.log(this.editEvent.start);
        console.log("================================================================");
        this.editEvent.end = this.datepipe.transform(new Date(this.eventService.eventData[i].end), 'yyyy-MM-ddTHH:mm');
        $('#eventduration2').val(((new Date(this.eventService.eventData[i].end).getTime()) - (new Date(this.eventService.eventData[i].start).getTime())) / 60000);
        console.log("channel:", this.editEvent.channel);
      }
    }
    // this.editEvent.title = this.selectedEvent.event._def.title;
    // this.editEvent.start = this.selectedEvent.event.start;
    // this.editEvent.end = this.selectedEvent.event.end;
    // console.log("dateend:", this.eventService.eventData);
    // console.log("changed:", this.editEvent.end);
    // this.editEvent.channel = this.selectedEvent.event._def.extendedProps.channel;
    // this.editEvent.type = this.selectedEvent.event._def.extendedProps.type;
    // this.editEvent.description = this.selectedEvent.event._def.extendedProps.description;
    this.propertyModal.hide();
    this.setFlagInit();
    this.eventtype = this.globalService.getUser().tags;
    this.editEventModal.show();
  }

  removeSelectedEvent() {
    this.eventService.removeEvent(this.selectedEvent.event._def.extendedProps._id)
      .then(res => {
        console.log(res);
        if (res.success) {

        } else {

        }
        this.propertyModal.hide();
      }).catch(error => {
        console.log(error);
        this.propertyModal.hide();
      })
  }

  aboutSelectedEvent() {
    this.ngZone.run(async () => {
      this.selectedEventProperty.title = this.selectedEvent.event.title;
      this.selectedEventProperty.start = this.customizedDate(this.selectedEvent.event.start);
      this.selectedEventProperty.end = this.customizedDate(this.selectedEvent.event.end);
      this.selectedEventProperty.type = this.selectedEvent.event._def.extendedProps.type;
      this.selectedEventProperty.channel = this.selectedEvent.event._def.extendedProps.channel;
      this.selectedEventProperty.description = this.selectedEvent.event._def.extendedProps.description;
      this.selectedEventProperty.source = this.selectedEvent.event._def.extendedProps.source;
      this.selectedEventProperty.userid = this.selectedEvent.event._def.extendedProps.userid;
      this.selectedEventProperty._id = this.selectedEvent.event._def.extendedProps._id;
      this.selectedEventProperty.partnerid = this.selectedEvent.event._def.extendedProps.partnerid;
      if (this.selectedEventProperty.source != "self") {
        for (var i = 0; i < this.commonService.registerUsers.length; i++) {
          if (this.commonService.registerUsers[i].userdata._id == this.selectedEventProperty.partnerid) {
            console.log("this.commonService.registerUsers[i].userdata:", this.commonService.registerUsers[i].userdata.avatarname);
            this.selectedEventPartner = this.commonService.registerUsers[i];
//            this.selectedEventPartner.avatarname = environment.USER_AVATAR_PATH + this.selectedEventPartner.avatarname;
            break;
          }
        }
      }
    });

    console.log("selected event:", this.selectedEventProperty);
    console.log("selected partner", this.selectedEventPartner);
    this.aboutModal.show();
    this.propertyModal.hide();
  }

  showNewEventModal() {
    this.setFlagInit();
    this.eventtype = this.globalService.getUser().tags;
    this.addEventModal.show();
  }
  addNewEvent() {
    if (this.tempEvent.title.length > 0) {        //title validation check
      this.isWrongTitle = false;
    } else {
      this.isWrongTitle = true;
    }

    if (this.tempEvent.start.length > 0) {        //datetime validation check
      this.isWrongStart = false;
    } else {
      this.isWrongStart = true;
    }

    // if (this.tempEvent.end.length > 0) {          //datetime validation check
    //   this.isWrongEnd = false;
    // } else {
    //   this.isWrongEnd = true;
    // }

    // if (this.isWrongStart == false && this.isWrongEnd == false) {
    //   if (new Date(this.tempEvent.start) > new Date(this.tempEvent.end)) {
    //     this.isWrongStartEnd = true;
    //   } else {
    //     this.isWrongStartEnd = false;
    //   }
    // }

    if ($('#eventduration1').val() != null)        //get duration value
      this.tempEvent.duration = $('#eventduration1').val();
    else
      this.tempEvent.duration = "";

    if (this.tempEvent.duration.length > 0) {
      this.isWrongDuration = false;
    } else {
      this.isWrongDuration = true;
    }

    if (this.tempEvent.description.length > 0) {        //title validation check
      this.isWrongDescription = false;
    } else {
      this.isWrongDescription = true;
    }

    if (this.tempEvent.channel.length > 0) {              //chan
      this.isWrongChannel = false;
    } else {
      this.isWrongChannel = true;
    }

    console.log("channel:", this.tempEvent.channel);

    if (this.isWrongTitle == false &&
      this.isWrongStart == false &&
      this.isWrongDuration == false &&
      this.isWrongDescription == false &&
      this.isWrongChannel == false) {
      this.tempEvent.end = new Date(new Date(this.tempEvent.start).getTime() + this.tempEvent.duration * 60000).toString();
      this.tempEvent.source = "self";
      this.tempEvent.partnerid = "nopartner";
      this.eventService.addEvent(this.tempEvent)
        .then(res => {
          console.log(res);
          if (res.success) {

          } else {
            if (res.message == "This event, you want to add is conflicting with others!") {
              this.warningDescription = "The schedule you want to add, is conflicting with others...";
              this.warningModal.show();
            }
          }
          this.addEventModal.hide();
        }).catch(error => {
          console.log(error);
          this.addEventModal.hide();
        })
    }
  }

  changeSelectedEvent() {
    if (this.editEvent.title.length > 0) {        //title validation check
      this.isWrongTitle = false;
    } else {
      this.isWrongTitle = true;
    }

    if (this.editEvent.start.length > 0) {        //datetime validation check
      this.isWrongStart = false;
    } else {
      this.isWrongStart = true;
    }

    // if (this.editEvent.end.length > 0) {        //datetime validation check
    //   this.isWrongEnd = false;
    // } else {
    //   this.isWrongEnd = true;
    // }

    // if (this.isWrongStart == false && this.isWrongEnd == false) {
    //   if (new Date(this.editEvent.start) > new Date(this.editEvent.end)) {
    //     this.isWrongStartEnd = true;
    //   } else {
    //     this.isWrongStartEnd = false;
    //   }
    // }

    if ($('#eventduration2').val() != null)        //get duration value
      this.editEvent.duration = $('#eventduration2').val();
    else
      this.editEvent.duration = "";

    if (this.editEvent.duration.length > 0) {
      this.isWrongDuration = false;
    } else {
      this.isWrongDuration = true;
    }

    if (this.editEvent.description.length > 0) {        //title validation check
      this.isWrongDescription = false;
    } else {
      this.isWrongDescription = true;
    }

    if (this.editEvent.channel.length > 0) {              //chan
      this.isWrongChannel = false;
    } else {
      this.isWrongChannel = true;
    }

    console.log("channel:", this.editEvent.channel);

    if (this.isWrongTitle == false &&
      this.isWrongStart == false &&
      this.isWrongDuration == false &&
      this.isWrongDescription == false &&
      this.isWrongChannel == false) {
      this.editEvent.end = new Date(new Date(this.editEvent.start).getTime() + this.editEvent.duration * 60000).toString();
      console.log("duration:", this.editEvent.duration);
      console.log("(start, end)", this.editEvent.start, this.editEvent.end);
      this.eventService.changeEvent(this.selectedEvent.event._def.extendedProps._id, this.editEvent)
        .then(res => {
          console.log(res);
          if (res.success) {

          } else {
            if (res.message == "This event you want to change, is conflicting with others!") {
              this.warningDescription = "The schedule you want to change, is conflicting with others...";
              this.warningModal.show();
            }
            else {
              this.warningDescription = res.message;
              this.warningModal.show();
            }
          }
          this.editEventModal.hide();
        }).catch(error => {
          console.log(error);
          this.editEventModal.hide();
        })
    }
  }

  setAddPublic() {
    this.tempEvent.type = "public";
  }

  setAddPrivate() {
    this.tempEvent.type = "private";
  }

  setEditPublic() {
    this.editEvent.type = "public";
  }

  setEditPrivate() {
    this.editEvent.type = "private";
  }

  setFlagInit() {
    this.isWrongTitle = false;
    this.isWrongStart = false;
    this.isWrongDuration = false;
    this.isWrongDescription = false;
    this.isWrongChannel = false;
  }

  get yearMonth(): string {
    const dateObj = new Date();
    var month = dateObj.getUTCMonth();
    if (month + 1 >= 10) {
      return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
    }
    else {
      return dateObj.getUTCFullYear() + '-' + '0' + (dateObj.getUTCMonth() + 1);
    }
  }

}

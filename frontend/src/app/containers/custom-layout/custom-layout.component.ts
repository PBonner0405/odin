import { Component, OnDestroy, Inject, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
// import { navItems } from '../../_nav';
import { environment } from '../../../environments/environment';
import { GlobalService, UserService, SocketService, CommonService, ChatService, EventService } from '../../services';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LivesessionService } from '../../services/livesession.service';
import { OptionsInput } from '@fullcalendar/core';
import { CalendarComponent } from 'ng-fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import { ChangeDetectorRef } from '@angular/core';
declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.scss'],
})
export class CustomLayoutComponent implements OnDestroy, OnInit {
  @ViewChild('switchMode', null) switchMode: ElementRef;
  @ViewChild('warningModal', { static: false }) public warningModal: ModalDirective;
  @ViewChild('swapModeModal', { static: false }) public swapModeModal: ModalDirective;
  @ViewChild('noticeModal', { static: false }) public noticeModal: ModalDirective;
  @ViewChild('scheduleModal', { static: false }) public scheduleModal: ModalDirective;
  @ViewChild('requestEventModal', { static: false }) public requestEventModal: ModalDirective;
  @ViewChild('infoAcceptedModal', { static: false }) public infoAcceptedModal: ModalDirective;
  @ViewChild('infoRejectedModal', { static: false }) public infoRejectedModal: ModalDirective;
  @ViewChild('aboutEventModal', { static: false }) public aboutEventModal: ModalDirective;
  @ViewChild('fullcalendar', null) fullcalendar: CalendarComponent;


  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  avatarPath: String = "assets/img/avatars/6.jpg";
  loginName: String = "";
  loginEmail: String = "";
  userMode: String = "Observer";

  schedulesubscribe: any;
  presenterScheduleSubscribe: any;
  /////////////////// session ///////////////////
  sessionRequestMsg: any;
  sessionRequestSenderId: any;

  scheduleDlgContent: String = "Presenter's schedule modal.";

  eventsModel: any = [];
  calendaroptions: OptionsInput = {
    editable: false,
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
      // console.log("eventrender info", info);
    }
  };

  eventSelectFlag: any = 0;
  selectedEvent: any;

  eventtype: any = [];

  tempEvent: any = {
    title: "",
    start: "",
    duration: "",
    end: "",
    description: "",
    type: "private",
    channel: ""
  };

  isWrongTitle: boolean = false;
  isWrongStart: boolean = false;
  // isWrongEnd: boolean = false;
  // isWrongStartEnd: boolean = false;
  isWrongDuration: boolean = false;
  isWrongDescription: boolean = false;
  isWrongChannel: boolean = false;

  scheduleRequestedEvent: any;
  scheduleRequester: any;
  sessionScheduleFlag: any = 0;

  warningDescription: String = "You have to complete presenter profile options to use presenter mode.";

  constructor(private router: Router, private globalService: GlobalService, private userService: UserService, public ngZone: NgZone, private socketService: SocketService, public commonService: CommonService, public eventService: EventService, private chatService: ChatService, public livesessionService: LivesessionService, private cdr: ChangeDetectorRef, @Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });

    /////////////////////////////////////////User Initialize////////////////////////////////////////
    this.avatarPath = environment.USER_AVATAR_PATH + globalService.getUser().avatarname;
    this.loginName = this.globalService.getUser().name;
    this.loginEmail = this.globalService.getUser().email;

    this.socketService.sendActiveEvent(this.globalService.getUser()._id);

    this.socketService.onActiveUsers().subscribe(msg => {
      this.commonService.activeUsers = JSON.parse(msg);
      this.commonService.activeUserCount = this.commonService.activeUsers.length;
      this.commonService.actionClient.next();
    });

    this.socketService.onLoginUsers().subscribe(msg => {
      this.commonService.loginUsers = JSON.parse(msg);
      this.commonService.loginUserCount = this.commonService.loginUsers.length;
      this.commonService.actionClient.next();
    });

    this.socketService.onRegisterUsers().subscribe(msg => {
      this.commonService.registerUsers = JSON.parse(msg);
      this.commonService.registerUserCount = this.commonService.registerUsers.length;

      this.commonService.availableClassCount = 0;
      this.commonService.presenterList = [];
      for (var i = 0; i < this.commonService.registerUserCount; i++) {
        if (this.commonService.registerUsers[i].userdata.ismadeprofile == true) {
          this.commonService.availableClassCount += this.commonService.registerUsers[i].userdata.tags.length;         //calculate class available
          this.commonService.presenterList.push(this.commonService.registerUsers[i]);
        }
      }
      this.commonService.actionClient.next();
    });
  }

  ngOnInit() {
    this.schedulesubscribe = this.socketService.onReceiveEvent().subscribe(msg => {          //get all events by server through socket.
      this.ngZone.run(async () => {
        var msgObj = JSON.parse(msg);
        this.eventService.setEvents(msgObj);
      });
    });

    ////////////////////////////////////// presenter's schedule ////////////////////////////////////////

    this.eventtype = this.commonService.subjectType;

    this.presenterScheduleSubscribe = this.commonService.scheduleListener().subscribe(res => {
      this.ngZone.run(() => {
        this.loadPresenterSchedule();
      });
    });

    ////////////////////////////////////////// live session /////////////////////////////////////////
    this.socketService.receiveLiveSessionMessage().subscribe(msg => {
      this.sessionRequestMsg = JSON.parse(msg);
      if (this.sessionRequestMsg.msgdata.type == "ice-candidate") {
        this.livesessionService.addICECandidate(this.sessionRequestMsg);
      } else if (this.sessionRequestMsg.msgdata.type == "offer") {
        console.log("offer messsage arrived!");
        this.livesessionService.answerOffer(this.sessionRequestMsg);
        this.router.navigate(['/livesession']);
      } else if (this.sessionRequestMsg.msgdata.type == "answer") {
        this.livesessionService.receiveAnswer(this.sessionRequestMsg);
      } else if (this.sessionRequestMsg.msgdata.type == "bidsession") {
        this.sessionRequestSenderId = this.sessionRequestMsg.senderid;
        $("#sessionModal").fadeIn();
      } else if (this.sessionRequestMsg.msgdata.type == "bidcancel") {
        $("#sessionModal").fadeOut();
      } else if (this.sessionRequestMsg.msgdata.type == "acceptsession") {
        this.commonService.sessionRequestFlag = 1;
      } else if (this.sessionRequestMsg.msgdata.type == "rejectsession") {
        this.commonService.sessionRequestFlag = 2;
        this.warningDescription = "Your request for instant session, has been rejected...";
        this.warningModal.show();
      } else if (this.sessionRequestMsg.msgdata.type == "finishsession") {
        console.log("session finish request");
        this.noticeModal.show();
        this.commonService.isSessionActive = false;
        this.commonService.sessionRequestFlag = 0;
        this.livesessionService.endPeerConnection();
        this.router.navigate(['/dashboard']);
      } else if (this.sessionRequestMsg.msgdata.type == "camcount") {
        this.commonService.remoteCamCount = this.sessionRequestMsg.msgdata.data;
        /////////////////////////////////// schedule session //////////////////////////////////
      } else if (this.sessionRequestMsg.msgdata.type == "requestschehdule") {
        this.sessionScheduleFlag = 1;
        this.sessionRequestSenderId = this.sessionRequestMsg.senderid;
        this.scheduleRequestedEvent = this.sessionRequestMsg.msgdata.data;
        this.scheduleRequestedEvent.partnerid = this.sessionRequestMsg.senderid;
        this.scheduleRequestedEvent.source = "received";
        this.scheduleRequestedEvent.start = new Date(this.scheduleRequestedEvent.start);
        this.scheduleRequestedEvent.end = new Date(this.scheduleRequestedEvent.end);
        this.scheduleRequester = this.sessionRequestMsg.msgdata.senderinfo;
        this.scheduleRequester.avatarname = environment.USER_AVATAR_PATH + this.scheduleRequester.avatarname;
        $("#sessionScheduleModal").fadeIn();
      } else if (this.sessionRequestMsg.msgdata.type == "acceptschedulerequest") {
        $("#waitingScheduleModal").fadeOut();

        this.eventService.requestPresenterSchedule(this.sessionRequestMsg.senderid)
          .then(res => {
            console.log("success result:", res);
            // this.router.navigate(['/channellist']);
            if (res.success == true) {
              this.commonService.presenterEventList = res.data;
            }
            else {
              this.commonService.presenterEventList = [];
            }
            this.loadPresenterSchedule();
          }).catch(error => {
            console.log(error);
          })

        this.infoAcceptedModal.show();

        console.log("event request response:", this.sessionRequestMsg.msgdata.data);
        this.eventService.addEvent(this.sessionRequestMsg.msgdata.data)         // save observer schedule
          .then(res => {
            console.log(res);
            if (res.success) {
           
            } else {
              if (res.message == "This event, you want to add is conflicting with others!") {
                this.warningDescription = "The schedule you want to add, is conflicting with others...";
                this.warningModal.show();
              }
            }
          }).catch(error => {
            console.log(error);
          })
      } else if (this.sessionRequestMsg.msgdata.type == "rejectschedulerequest") {
        $("#waitingScheduleModal").fadeOut();
        this.infoRejectedModal.show();
      } else if (this.sessionRequestMsg.msgdata.type == "eventconflictrequest") {
        $("#sessionScheduleModal").fadeOut();
        this.warningDescription = "The schedule you want to request, is conflicting with others...";
        this.warningModal.show();
      } else if (this.sessionRequestMsg.msgdata.type == "requestschedulecancel") {
        $("#sessionScheduleModal").fadeOut();
        console.log("cancel arrived");
      }
      this.commonService.sessionSRCClient.next();
    });
  }

  loadPresenterSchedule() {
    console.log("presenter eventlist:", this.commonService.presenterEventList);
    this.eventsModel = [];
    for (var i = 0; i < this.commonService.presenterEventList.length; i++) {
      this.eventsModel.push(this.commonService.presenterEventList[i]);
      if (this.commonService.presenterEventList[i].type == "private") {
        this.eventsModel[this.eventsModel.length - 1].title = "Unavailable";
        this.eventsModel[this.eventsModel.length - 1].description = "Unavailable";
      }
    }
    this.calendaroptions.events = this.eventsModel;
    console.log("target presenter:", this.commonService.schedulePresenter);
    this.scheduleDlgContent = "Please confirm " + this.commonService.schedulePresenter.name + "'s schedule."
    this.scheduleModal.show();
  }
  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.schedulesubscribe.unsubscribe();
    this.changes.disconnect();
  }

  doLogOut() {
    this.userService.logout(this.globalService.getToken())
      .then(res => {
        console.log(res);
        if (res.success) {
          this.globalService.removeUser();
          this.globalService.removeToken();
          this.socketService.sendLogoutEvent();
          this.commonService.currentMode = "Observer";
          this.router.navigate(['/login']);
        } else {

        }
      }).catch(error => {
        console.log(error);
      })
  }

  modeChanged() {
    if (this.globalService.getUser().ismadeprofile) {
      if (this.userMode == "Presenter") {
        this.userMode = this.commonService.currentMode = "Observer";
      }
      else {
        this.userMode = this.commonService.currentMode = "Presenter";
      }
    }
    else {
      this.userMode = this.commonService.currentMode = "Observer";
      this.switchMode.nativeElement.checked = true;
      this.swapModeModal.show();
    }
  }

  acceptSessionRequest() {
    $("#sessionModal").fadeOut();
    this.commonService.isSessionActive = true;
    this.commonService.sessionPartnerId = this.sessionRequestSenderId;
    this.socketService.sendLiveSessionMessage(
      this.globalService.getUser()._id,
      this.sessionRequestSenderId,
      {
        type: "acceptsession"
      });
  }

  rejectSessionRequest() {
    $("#sessionModal").fadeOut();
    this.socketService.sendLiveSessionMessage(
      this.globalService.getUser()._id,
      this.sessionRequestSenderId,
      {
        type: "rejectsession"
      });
  }

  eventClick(model) {
    // console.log("eventClick", model);
    this.eventSelectFlag = 1;
    this.selectedEvent = model.event;
    this.aboutEventModal.show();

  }
  eventDragStop(model) {
    // console.log("eventDragStop", model);
  }
  eventDrop(model) {
    // console.log("eventDrop:", model);
  }
  clickButton(model) {
    // console.log("eventClickButton", model);
  }
  dateClick(model) {
    // console.log("dateClick", model);
  }

  scheduleModalShown(event) {
    console.log("event show:", event);
    window.dispatchEvent(new Event('resize'));
  }

  requestScheduleSession() {
    console.log("target presenter:", this.commonService.schedulePresenter);
    this.eventtype = this.commonService.schedulePresenter.tags;
    this.requestEventModal.show();
  }

  setSchedulePublic() {
    this.tempEvent.type = "public";
  }

  setSchedulePrivate() {
    this.tempEvent.type = "private";
  }

  sendSchedule() {
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

    if ($('#eventduration').val() != null)        //get duration value
      this.tempEvent.duration = $('#eventduration').val();
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
      // console.log("event start:", this.tempEvent.start);
      // console.log("event duration:", this.tempEvent.duration);
      this.tempEvent.end = new Date(new Date(this.tempEvent.start).getTime() + this.tempEvent.duration * 60000).toString();
      // console.log("event end:", this.tempEvent.end);
      // this.eventService.addEvent(this.tempEvent)
      //   .then(res => {
      //     console.log(res);
      //     if (res.success) {

      //     } else {

      //     }
      //     this.addEventModal.hide();
      //   }).catch(error => {
      //     console.log(error);
      //     this.addEventModal.hide();
      //   })

      this.socketService.sendLiveSessionMessage(
        this.globalService.getUser()._id,
        this.commonService.schedulePresenter.id,
        {
          type: "requestschehdule",
          data: this.tempEvent,
          senderinfo: this.globalService.getUser()
        });

      this.requestEventModal.hide();
      //      $("#waitingScheduleModal").fadeIn();
    }
  }

  dismissDlg() {
    console.log("cancel send");
    $("#waitingScheduleModal").fadeOut();
    this.socketService.sendLiveSessionMessage(
      this.globalService.getUser()._id,
      this.commonService.schedulePresenter.id,
      {
        type: "requestschedulecancel"
      });
  }

  async acceptScheduleRequest() {
    $("#sessionScheduleModal").fadeOut();
    await this.eventService.addEvent(this.scheduleRequestedEvent)
      .then(res => {
        console.log(res);
        if (res.success) {
          this.scheduleRequestedEvent.source = "sent";
          this.scheduleRequestedEvent.partnerid = this.globalService.getUser()._id;
          this.socketService.sendLiveSessionMessage(
            this.globalService.getUser()._id,
            this.sessionRequestSenderId,
            {
              type: "acceptschedulerequest",
              data: this.scheduleRequestedEvent
            });
        } else {
          if (res.message == "This event, you want to add is conflicting with others!") {
            this.warningDescription = "The schedule you want to add, is conflicting with others...";
            this.warningModal.show();
            this.socketService.sendLiveSessionMessage(
              this.globalService.getUser()._id,
              this.sessionRequestSenderId,
              {
                type: "eventconflictrequest"
              });
          }
        }
        this.router.navigate(['/schedule']);
      }).catch(error => {
        console.log(error);
      })
  }

  rejectScheduleRequest() {
    $("#sessionScheduleModal").fadeOut();
    this.socketService.sendLiveSessionMessage(
      this.globalService.getUser()._id,
      this.sessionRequestSenderId,
      {
        type: "rejectschedulerequest"
      });
  }
}

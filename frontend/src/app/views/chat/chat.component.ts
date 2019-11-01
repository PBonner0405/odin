import { Component, OnInit, NgZone, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonService, ChatService, GlobalService, SocketService, EventService } from '../../services';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { LivesessionService } from '../../services/livesession.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('chathistory', { static: false }) private chatLog: ElementRef;
  @ViewChild('dangerModal', null) dangerModal: ModalDirective;
  @ViewChild('warningModal', null) warningModal: ModalDirective;

  public defaultAvatarPath: String;
  public contactData: any;
  public contactUsers: any = [];
  public messageData: any = [];                   //all message history

  public currentContactId = "";
  public currentContactUser: any = {};              //selected contact info
  public currentMessageData: String = "";
  public currentMessageList: any = [];             //message history with specific user

  public scrollFlag: any = 1;

  public warningDescription: String = "";

  constructor(private router: Router, public commonService: CommonService, public chatService: ChatService, public globalService: GlobalService, public socketService: SocketService, public eventService: EventService, public livesessionService: LivesessionService, public ngZone: NgZone) {
    this.socketService.onNewContact().subscribe(async msg => {
      await this.loadContactData();
      await this.loadMessageData();
    });

    this.socketService.onReceiveMessage().subscribe(msg => {          //new message
      var msgObj = JSON.parse(msg);
      this.commonService.messageList.push(msgObj);
      if (msgObj.senderid == this.currentContactId) {               //accept message from contact
        this.currentMessageList.push(msgObj);
        this.readReceivedMessage();                                 //confirm received message
      }
      else if (msgObj.receiverid == this.currentContactId) {        //response of your sending
        this.currentMessageList.push(msgObj);
      }
      else {                                                         //unread count increase
        // console.log("----------inc count---------");
        var i;
        for (i = 0; i < this.contactUsers.length; i++) {
          if (this.contactUsers[i].id == msgObj.senderid) {
            this.contactUsers[i].unreadcount++;
            this.commonService.unReadMsgCnt++;
          }
        }
      }
      this.scrollFlag = 1;
    });
  }

  async ngOnInit() {
    this.defaultAvatarPath = environment.USER_AVATAR_PATH;
    await this.loadContactData();                                 //exception with first
    await this.loadMessageData();
  }

  subscription: Subscription
  ngAfterViewInit(): void {
    this.subscription = this.commonService.clientListener().subscribe(res => {
      this.ngZone.run(async () => {
        await this.loadContactData();
        await this.loadMessageData();
      });
    });

    this.subscription = this.commonService.sessionSRCListener().subscribe(res => {
      this.ngZone.run(() => {
        if (this.commonService.sessionRequestFlag == 1) {      //accepted
          $("#waitingModal").fadeOut();
          this.startVideoSession();
        }
        if (this.commonService.sessionRequestFlag == 2) {      //rejected
          $("#waitingModal").fadeOut();
        }
      });
    });
  }


  ngAfterViewChecked() {
    if (this.scrollFlag == 1) {
      this.scrollToBottom();
      this.scrollFlag = 0;
    }
  }

  loadContactData() {
    var i, j;
    this.chatService.getContactRequest()
      .then(res => {
        if (res.success) {
          this.contactData = this.commonService.contactList;
          for (i = 0; i < this.contactData.lasts.length - 1; i++) {        //sort by lasts
            for (j = i + 1; j < this.contactData.lasts.length; j++) {
              if (this.contactData.lasts[i] < this.contactData.lasts[j]) {
                var tmptime = this.contactData.lasts[i]; this.contactData.lasts[i] = this.contactData.lasts[j]; this.contactData.lasts[j] = tmptime;
                var tmpid = this.contactData.ids[i]; this.contactData.ids[i] = this.contactData.ids[j]; this.contactData.ids[j] = tmpid;
              }
            }
          }
          for (i = 0; i < this.contactData.lasts.length; i++) {
            for (j = 0; j < this.commonService.registerUsers.length; j++) {
              if (this.contactData.ids[i] == this.commonService.registerUsers[j].userdata._id) {
                this.contactUsers[i] = {
                  name: this.commonService.registerUsers[j].userdata.name,
                  last: this.contactData.lasts[i],
                  activity: this.commonService.registerUsers[j].status.activity,
                  avatarname: this.commonService.registerUsers[j].userdata.avatarname,
                  id: this.commonService.registerUsers[j].userdata._id,
                  isProfileComplete: this.commonService.registerUsers[j].userdata.ismadeprofile,
                  tags: this.commonService.registerUsers[j].userdata.tags,
                  unreadcount: 0
                }
              }
            }
          }
          this.commonService.unReadMsgCnt = 0;
        }
        else {
          console.log("no Contact data");
          this.dangerModal.show();
        }
      }).catch(error => {
        console.log(error);
      })
  }

  loadMessageData() {
    var i, j;
    this.chatService.getMessageRequest()
      .then(res => {
        if (res.success) {
          this.messageData = this.commonService.messageList;
          for (i = 0; i < this.messageData.length - 1; i++) {        //sort by lasts
            for (j = i + 1; j < this.messageData.length; j++) {
              if (this.messageData[i].time > this.messageData[j].time) {
                var tmp = this.messageData[i]; this.messageData[i] = this.messageData[j]; this.messageData[j] = tmp;
              }
            }
          }
          for (i = 0; i < this.messageData.length; i++) { //badge count(unread messages)
            if (this.messageData[i].receiverid == this.globalService.getUser()._id && this.messageData[i].status == "unread") {
              for (j = 0; j < this.contactUsers.length; j++) {
                if (this.contactUsers[j].id == this.messageData[i].senderid) {
                  this.contactUsers[j].unreadcount++;
                  this.commonService.unReadMsgCnt++;
                }
              }
            }
          }
        }
        else {
          console.log("no Contact data");
        }
      }).catch(error => {
        console.log(error);
      })
  }

  async selectContact(contactUser) {

    if (this.currentContactId != contactUser.id) {
      this.currentContactUser = contactUser;
      this.currentContactId = contactUser.id;
      this.messageData = this.commonService.messageList;
      this.currentMessageList = [];                  //show messages with selected contact
      var i, j;
      for (i = 0; i < this.messageData.length; i++) {
        if (this.messageData[i].senderid == this.currentContactId || this.messageData[i].receiverid == this.currentContactId) {
          this.currentMessageList.push(this.messageData[i]);
        }
      }
      await this.readReceivedMessage();
      this.scrollFlag = 1;
    }
  }

  readReceivedMessage() {
    this.chatService.readMessageRequest(this.currentContactId, this.globalService.getUser()._id)
      .then(res => {
        if (res.success) {
          var i;
          for (i = 0; i < this.contactUsers.length; i++) {
            if (this.contactUsers[i].id == this.currentContactId) {
              this.commonService.unReadMsgCnt -= this.contactUsers[i].unreadcount;
              this.contactUsers[i].unreadcount = 0;
            }
          }
        }
        else {
        }
      }).catch(error => {
        console.log(error);
      })
  }

  keyPress(event: any) {
    if (event.keyCode == 13) {
      this.sendMessage();
      event.stopPropagation();
      return false
    }
  }

  sendMessage() {
    this.chatService.sendMessage(this.globalService.getUser()._id, this.currentContactId, this.currentMessageData);
    this.currentMessageData = "";
  }

  scrollToBottom(): void {
    try {
      this.chatLog.nativeElement.scrollTop = this.chatLog.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.currentContactId = "";         //format currentcontactid when leave component
  }

  liveInstantRequest(contactUser): void {
    if (contactUser.activity == "active") {
      this.commonService.initialContactId = this.currentContactId;
      $("#waitingModal").fadeIn();
      this.socketService.sendLiveSessionMessage(
        this.globalService.getUser()._id,
        this.currentContactId,
        {
          type: "bidsession"
        });
    } else {
      this.warningDescription = "This user is not active, you can have a session when it's active";
      this.warningModal.show();
    }
  }

  dismissDlg() {
    $("#waitingModal").fadeOut();
    this.socketService.sendLiveSessionMessage(
      this.globalService.getUser()._id,
      this.currentContactId,
      {
        type: "bidcancel"
      });
  }

  liveScheduleRequest(contactUser): void {
    //  console.log("contact user:", contactUser);
  //  if (contactUser.activity == "active") {
      this.eventService.requestPresenterSchedule(contactUser.id)
        .then(res => {
          console.log("success result:", res);
         // this.router.navigate(['/channellist']);
          this.commonService.schedulePresenter = contactUser;
          if(res.success == true) {
            this.commonService.presenterEventList = res.data;
          }
          else {
            this.commonService.presenterEventList = [];
          }
          this.commonService.scheduleClient.next();
        }).catch(error => {
          console.log(error);
        })
    // } else {
    //   this.warningDescription = "This user is not active, you can have a schedule when it's active";
    //   this.warningModal.show();
    // }
  }

  startVideoSession(): void {
    this.commonService.isSessionActive = true;
    this.commonService.sessionRequestFlag = 0;
    this.commonService.sessionPartnerId = this.commonService.initialContactId;
    this.livesessionService.inviteToVideoCall(this.globalService.getUser()._id, this.commonService.sessionPartnerId);
    this.router.navigate(['/livesession']);
  }
}

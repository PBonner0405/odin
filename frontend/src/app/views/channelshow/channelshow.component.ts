import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonService, ChatService, GlobalService, ChannelService, SocketService, EventService } from '../../services';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { LivesessionService } from '../../services/livesession.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
declare var $: any;

@Component({
  selector: 'app-channelshow',
  templateUrl: './channelshow.component.html',
  styleUrls: ['./channelshow.component.scss']
})
export class ChannelshowComponent implements OnInit {

  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef;
  @ViewChild('videoSource1', { static: false }) videoSource1: ElementRef;
  @ViewChild('videoSource2', { static: false }) videoSource2: ElementRef;

  @ViewChild('warningModal', null) warningModal: ModalDirective;

  reviewtmp: any = {
    rating: 0,
    feedback: "",
  }

  isWrongRating: boolean = false;
  isWrongFeedback: boolean = false;

  initialChannelRequestFlag: boolean = false;

  public defaultUploadPath: any;
  public defaultAvatarPath: any;
  public currentUser: any;
  public channelInfo: any = null;          //showing channel information

  public selectedVideo: any;
  public selectedVideoPrice: any = 0.0;
  public selectedVideoName: String = "";
  public payedflag: any = 0;

  public currentActivity: any;
  public feedbackStatus: any = 0;

  public reviewList: any = [];

  public warningDescription: String = "";

  constructor(private router: Router, public commonService: CommonService, public socketService: SocketService, public chatService: ChatService, public eventService: EventService, public globalService: GlobalService, public channelService: ChannelService, public livesessionService: LivesessionService, public paymentService: PaymentService, public ngZone: NgZone) {
    console.log("url:", this.router.url);
    this.defaultUploadPath = environment.USER_UPLOAD_PATH;
    this.defaultAvatarPath = environment.USER_AVATAR_PATH;

    this.channelService.postChannelRequest(this.router.url.substring(13))
      .then(res => {
        console.log(res);
        if (res.success) {
          this.channelInfo = res.data;

          this.selectedVideo = this.defaultUploadPath + this.channelInfo.channel.data.files[0];
          this.selectedVideoName = this.channelInfo.channel.data.files[0]
          this.selectedVideoPrice = this.channelInfo.channel.data.uploadprices[0];

          this.currentUser = this.globalService.getUser();

          for (var i = 0; i < this.channelInfo.channel.data.feedbacks.length; i++) {
            var writterid = this.channelInfo.channel.data.feedbacks[i].writterid;
            for (var j = 0; j < this.commonService.registerUsers.length; j++) {
              if (writterid == this.commonService.registerUsers[j].userdata._id) {
                console.log("user:", this.commonService.registerUsers[j].userdata);
                this.reviewList.push({
                  avatar: this.commonService.registerUsers[j].userdata.avatarname,
                  username: this.commonService.registerUsers[j].userdata.name,
                  rate: this.channelInfo.channel.data.feedbacks[i].rate,
                  description: this.channelInfo.channel.data.feedbacks[i].review,
                  date: this.channelInfo.channel.data.feedbacks[i].savedtime.substring(0, 10)
                });
                break;
              }
            }
          }

          if (this.channelInfo.channel.postuser._id == this.currentUser._id) {
            this.feedbackStatus = 3;
          }
          console.log("channelInfo:", this.channelInfo);
        }
      }).catch(error => {
        console.log(error);
      })
  }

  subscription: Subscription
  ngOnInit() {
    this.subscription = this.commonService.clientListener().subscribe(res => {
      console.log("set register user", this.commonService.registerUsers);
      this.ngZone.run(async () => {
        this.setUserActivity();

        if (this.commonService.registerUsers && this.channelInfo && this.initialChannelRequestFlag == false) {
          this.payedflag = 0;
          if (this.selectedVideoPrice == 0 || this.globalService.getUser()._id == this.channelInfo.channel.postuser._id) {
            this.payedflag = 1;
          } else {
            console.log("register users:", this.commonService.registerUsers);

            var currentVisitUser = null;
            for (var i = 0; i < this.commonService.registerUsers.length; i++) {
              if (this.commonService.registerUsers[i].userdata._id == this.globalService.getUser()._id) {
                currentVisitUser = this.commonService.registerUsers[i];
                break;
              }
            }
            var len = currentVisitUser.userdata.paidforvideos.length;
            for (var i = 0; i < len; i++) {
              if (currentVisitUser.userdata.paidforvideos[i] == this.channelInfo.channel.data.files[0]) {
                this.payedflag = 1;
              }
            }
          }

          console.log("pay flag on start:", this.payedflag);

          this.initialChannelRequestFlag = true;
        }
      });
    });
  }

  ngAfterViewInit(): void {
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


  setUserActivity(): void {
    if (!this.commonService.registerUsers) {
      return;
    }
    if (!this.channelInfo) {
      return;
    }
    var i;
    for (i = 0; i < this.commonService.registerUsers.length; i++) {
      if (this.channelInfo.channel.postuser._id == this.commonService.registerUsers[i].userdata._id) {
        if (this.commonService.registerUsers[i].status.activity == "active") {
          this.currentActivity = "online";
        }
        else {
          this.currentActivity = "offline";
        }
      }
    }
  }

  contactStart(contactid): void {
    this.chatService.addContactRequest(contactid)
      .then(res => {
        console.log(res);
        if (res.success) {

        }
      }).catch(error => {
        console.log(error);
      })
  }


  videoSelect(videoitem, price): void {
    this.ngZone.run(async () => {
      this.payedflag = 0;

      if (price == 0 || this.globalService.getUser()._id == this.channelInfo.channel.postuser._id) {
        this.payedflag = 1;
      }
      console.log("video clicked:", videoitem, price);
      this.selectedVideo = this.defaultUploadPath + videoitem;
      this.selectedVideoName = videoitem;
      this.selectedVideoPrice = price;
      
      var currentVisitUser = null;
      for (i = 0; i < this.commonService.registerUsers.length; i++) {
        if (this.commonService.registerUsers[i].userdata._id == this.globalService.getUser()._id) {
          currentVisitUser = this.commonService.registerUsers[i];
          break;
        }
      }
      var len = currentVisitUser.userdata.paidforvideos.length;
      for (var i = 0; i < len; i++) {
        if (currentVisitUser.userdata.paidforvideos[i] == videoitem) {
          this.payedflag = 1;
        }
      }
      console.log("pay flag on select:", this.payedflag);
      this.videoSource1.nativeElement.src = this.selectedVideo;
      this.videoSource2.nativeElement.src = this.selectedVideo;
      this.videoplayer.nativeElement.load();
      console.log("video src:", this.videoSource1.nativeElement);
      if (price == 0) {
        this.videoplayer.nativeElement.play();
      }
    });

  }

  postFeedback(): void {
    if (this.reviewtmp.rating > 0) {
      this.isWrongRating = false;
    } else {
      this.isWrongRating = true;
    }

    if (this.reviewtmp.feedback.length > 0) {
      this.isWrongFeedback = false;
    } else {
      this.isWrongFeedback = true;
    }

    if (this.isWrongRating == false &&
      this.isWrongFeedback == false) {
      this.channelService.postChannelReview(this.reviewtmp, this.channelInfo.channel.data._id)
        .then(res => {
          console.log(res);
          if (res.success) {
            this.feedbackStatus = 1;
          }
          else {
            this.feedbackStatus = 2;
          }
        }).catch(error => {
          console.log(error);
          this.feedbackStatus = 2;
        })
    }
  }

  dismissDlg() {
    $("#waitingModal").fadeOut();
    this.socketService.sendLiveSessionMessage(
      this.globalService.getUser()._id,
      this.channelInfo.channel.postuser._id,
      {
        type: "bidcancel"
      });
  }

  liveInstantRequest(requestid): void {
    if (this.currentActivity == "online") {
      this.commonService.initialContactId = requestid;
      $("#waitingModal").fadeIn();
      this.socketService.sendLiveSessionMessage(
        this.globalService.getUser()._id,
        requestid,
        {
          type: "bidsession"
        });
    } else {
      this.warningDescription = "This user is not active, you can have a session when it's active";
      this.warningModal.show();
    }
  }

  liveScheduleRequest(requestid): void {
    var contactUser: any;
    for (var i = 0; i < this.commonService.registerUsers.length; i++) {
      if (requestid == this.commonService.registerUsers[i].userdata._id) {
        contactUser = this.commonService.registerUsers[i];
        break;
      }
    }
    // if (contactUser.status.activity == "active") {
    this.eventService.requestPresenterSchedule(requestid)
      .then(res => {
        console.log("success result:", res);
        // this.router.navigate(['/channellist']);
        this.commonService.schedulePresenter = {
          id: contactUser.userdata._id,
          name: contactUser.userdata.name,
          tags: contactUser.userdata.tags,
          isProfileComplete: contactUser.userdata.ismadeprofile,
          avatarname: contactUser.userdata.avatarname
        };
        if (res.success == true) {
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

  payForVideo(price): void {
    this.paymentService.paymentRequest(price, this.channelInfo.channel.data.paypalmail, this.selectedVideoName, environment.REDIRECT_URL + this.router.url)
      .then(res => {
        console.log("payment resonse:", res);
        if (res.success == true) {
          if (res.successflag == 1) {
            window.location.href = res.redirecturl;
          } else if (res.successflag == 2) {
            alert("payment success!");
          }
        }
      }).catch(error => {
        console.log(error);
      })
  }
}

import { Component, OnInit, ViewChild, ElementRef, NgZone, QueryList } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SocketService, CommonService, GlobalService } from '../../../services';
import { LivesessionService } from '../../../services/livesession.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
declare var $: any;
// declare let RTCPeerConnection: any;

@Component({
  selector: 'app-livesession',
  templateUrl: './livesession.component.html',
  styleUrls: ['./livesession.component.scss']
})
export class LivesessionComponent implements OnInit {
  @ViewChild('endSessionModal', null) endSessionModal: ModalDirective;

  @ViewChild("mine", null) mine: any;
  @ViewChild("remote", null) remote: any;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;


  callActive: boolean = false;

  remotedevices: any = [];
  mydevices: any = [];

  private ctx: CanvasRenderingContext2D;

  constructor(private router: Router, public socketService: SocketService, public livesessionService: LivesessionService, public globalService: GlobalService, public commonService: CommonService, public ngZone: NgZone) { }

  ngOnInit() {
    // this.ctx = this.canvas.nativeElement.getContext('2d');
    // this.ctx.fillStyle = 'red';
    // this.ctx.fillRect(30, 10, 50, 50);
  }

  subscription: Subscription
  ngAfterViewInit(): void {
    this.subscription = this.commonService.sessionSRCListener().subscribe(res => {
      this.ngZone.run(() => {

        if (this.commonService.srcNative.length >= 1) {
          setTimeout(() => {
            var videolist = this.mine.nativeElement.children;
            //     var videolist = document.getElementById("mineid").children;
            console.log("my video cnt", videolist.length);
            for (var i = 0; i < this.commonService.myCamCount; i++) {
              if (videolist[i]) {
                videolist[i].children[0].srcObject = this.commonService.srcNative[i];
                videolist[i].children[0].style.visibility = "visible";
              }
            }
          }, 0);

        }
        if (this.commonService.srcRemote.length >= 1) {
          setTimeout(() => {
            var videolist = this.remote.nativeElement.children;
            //    var videolist = document.getElementById("remoteid").children;
            for (var i = 0; i < this.commonService.remoteCamCount; i++) {
              if (videolist[i]) {
                videolist[i].children[0].srcObject = this.commonService.srcRemote[i];
                videolist[i].children[0].style.visibility = "visible";
              }
            }
          }, 0);
        }
      });
    });
  }

  endSession(): void {
    ////////////// end session message to partner ///////////////
    console.log("session partner id:", this.commonService.sessionPartnerId);
    this.socketService.sendLiveSessionMessage(
      this.globalService.getUser()._id,
      this.commonService.sessionPartnerId,
      {
        type: "finishsession"
      });

    this.commonService.isSessionActive = false;
    this.commonService.sessionRequestFlag = 0;
    this.livesessionService.endPeerConnection();
    this.router.navigate(['/dashboard']);
    this.endSessionModal.hide();
  }
}

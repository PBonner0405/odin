import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService, CommonService, GlobalService, ChannelService, ChatService } from '../../services'
import { INgxSelectOption } from 'ngx-select-ex/ngx-select/ngx-select.interfaces';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channellist',
  templateUrl: './channellist.component.html',
  styleUrls: ['./channellist.component.scss']
})
export class ChannellistComponent implements OnInit {

  public defaultUploadPath: any;
  public defaultAvatarPath: any;
  public currentUser: any;
  ////////////////////    Dropdown    ////////////////////
  public items: any[] = [];
  public selectedStationId: any;
  public ngxDisabled = false;
  ////////////////////////////////////////////////////////

  public currentSearchStation: any = "";
  public currentKeyword: any = "";
  public searchResult: any = null;

  constructor(private router: Router, public commonService: CommonService, private globalService: GlobalService, public channelService: ChannelService, public chatService: ChatService, public ngZone: NgZone) {
    this.items = commonService.stations;

    this.currentKeyword = this.commonService.channelSearchKeyword;
    this.currentSearchStation = this.commonService.channelSearchStation;
    this.selectedStationId = this.commonService.channelSearchStationId;
    this.searchResult = this.commonService.channelList;

    this.defaultUploadPath = environment.USER_UPLOAD_PATH;
    this.defaultAvatarPath = environment.USER_AVATAR_PATH;

    this.currentUser = this.globalService.getUser();
    // this.defaultPosterPath = environment.USER_UPLOAD_PATH + "poster.png";
  }

  subscription: Subscription
  ngOnInit() {
    this.setUserActivity();
    this.subscription = this.commonService.clientListener().subscribe(res => {
      this.ngZone.run(async () => {
        this.setUserActivity();
      });
    });
  }

  setUserActivity(): void {
    var i, j;
    for ( i = 0; i < this.commonService.registerUsers.length; i++) {
      for (j = 0; j < this.searchResult.results.length; j ++) {
        if(this.searchResult.results[j].channel.postuser._id == this.commonService.registerUsers[i].userdata._id) {
          this.searchResult.results[j].channel.postuser.activity = this.commonService.registerUsers[i].status.activity;
        }
      }
    }
  }

  doSelectStation(option: INgxSelectOption) {
    console.log('MultipleDemoComponent.doSelectOptions', option);
    this.currentSearchStation = option[0].text;
  }

  searchChannel() {
    console.log("search-channel:", this.currentSearchStation, this.currentKeyword);
    this.commonService.channelSearchKeyword = this.currentKeyword;
    this.commonService.channelSearchStation = this.currentSearchStation;
    this.commonService.channelSearchStationId = this.selectedStationId;
    this.channelService.postSearch(this.currentKeyword, this.currentSearchStation)
      .then(res => {
        console.log("success result:", res);
        this.commonService.channelList = res;
        this.searchResult = this.commonService.channelList;
        this.setUserActivity();
        console.log("show list", this.searchResult);
      }).catch(error => {
        console.log(error);
      })
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

  showChannelDetail(channelItem): void {
    console.log("here", channelItem);
    this.commonService.currentShowingChannel = channelItem;
    this.channelService.postViewChannel(channelItem.channel.data._id)
      .then(res => {
        console.log(res);
        if (res.success) {
        }
      }).catch(error => {
        console.log(error);
      })
    this.router.navigate(['/channelshow/'+channelItem.channel.data._id]);
  }
}

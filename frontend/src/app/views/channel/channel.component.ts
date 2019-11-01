import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService, ChannelService, CommonService } from '../../services';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { INgxSelectOption } from 'ngx-select-ex/ngx-select/ngx-select.interfaces';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {

  @ViewChild('skillTagModal', null) skillTagModal: ModalDirective;
  @ViewChild('successUploadModal', null) successUploadModal: ModalDirective;
  @ViewChild('failedUploadModal', null) failedUploadModal: ModalDirective;

  avatarPath: String = "";
  skillcnt: any = 2;
  skilltags: any = [];
  currentSkill: String = "";
  currentStation: String = "";

  fileToUpload: File = null;
  cntUploadFile: any = 1;
  uploadFileList: any = [null];
  uploadFlagList: any = [0];
  uploadPriceList: any = [0.0];
  uploadedFileNames: any = [];
  uploadedFilePrices: any = [0.0];
  cntUploaded: any = 0;

  channeltmp: any = {
    title: "",
    description: "",
    skill: "",
    station: "",
    level: "",
    price: "",
    duration: "",
    attendeecnt: "",
    paypalmail: ""
  }

  isWrongTitle: boolean = false;
  isWrongDescription: boolean = false;
  isWrongSkill: boolean = false;
  isWrongStation: boolean = false;
  isWrongLevel: boolean = false;
  isWrongPrice: boolean = false;
  isWrongDuration: boolean = false;
  isWrongAttendeeCnt: boolean = false;
  isWrongPaypal: boolean = false;
  isWrongVideoPrice: any = [false];
  isBusy = false;

  ////////////////////    Dropdown    ////////////////////
  public items: any[] = [];
  public selectedStationId: any;
  public ngxDisabled = false;
  ////////////////////////////////////////////////////////

  constructor(private router: Router, globalService: GlobalService, public channelService: ChannelService, public commonService: CommonService) {
    this.avatarPath = environment.USER_AVATAR_PATH + globalService.getUser().avatarname;
    this.skillcnt = 2;
    console.log("test:", globalService.getUser().tags);
    this.skilltags = globalService.getUser().tags;
    this.items = commonService.stations;
    this.cntUploadFile = 1;
    this.uploadFileList = [null];
  }

  ngOnInit() {
  }

  handleFileInput(files: FileList, idx) {
    this.fileToUpload = files.item(0);
    this.uploadFileList[idx] = this.fileToUpload;
    console.log("FileList:", this.uploadFileList);
  }


  async uploadFileToActivity() {

    if (this.channeltmp.title.length > 0) {
      this.isWrongTitle = false;
    } else {
      this.isWrongTitle = true;
    }

    if (this.channeltmp.description.length > 100) {
      this.isWrongDescription = false;
    } else {
      this.isWrongDescription = true;
    }

    console.log("price:", this.channeltmp.price);
    console.log("duration:", this.channeltmp.duration);
    console.log("count:", this.channeltmp.attendeecnt);

    if (this.channeltmp.price) {
      this.isWrongPrice = false;
    } else {
      this.isWrongPrice = true;
    }

    if (this.channeltmp.duration) {
      this.isWrongDuration = false;
    } else {
      this.isWrongDuration = true;
    }

    if (this.channeltmp.attendeecnt) {
      this.isWrongAttendeeCnt = false;
    } else {
      this.isWrongAttendeeCnt = true;
    }

    if (this.channeltmp.skill.length > 0) {
      this.isWrongSkill = false;
    } else {
      this.isWrongSkill = true;
    }

    if (this.channeltmp.station.length > 0) {
      this.isWrongStation = false;
    } else {
      this.isWrongStation = true;
    }

    {                                           //mail validation check 
      console.log(this.channeltmp.paypalmail);
      const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.isWrongPaypal = !regExp.test(this.channeltmp.paypalmail);
      console.log("result:", this.isWrongPaypal);
    }
    

    if (this.channeltmp.level.length > 0) {
      this.isWrongLevel = false;
    } else {
      this.isWrongLevel = true;
    }

    var i;

    for (i = 0; i < this.cntUploadFile; i++) {
      this.uploadPriceList[i] = +$("#price"+i).val();
      if (this.uploadFileList[i] != null && $("#check" + i + ":checked").val() && this.uploadPriceList[i] <= 0) {
        this.isWrongVideoPrice[i] = true;
      } else {
        this.isWrongVideoPrice[i] = false;
      }
    }

    for (i = 0; i < this.cntUploadFile; i++) {
      if(this.isWrongVideoPrice[i] == true) {
        return;
      }
    }

    if (this.isWrongTitle == false &&
      this.isWrongDescription == false &&
      this.isWrongSkill == false &&
      this.isWrongStation == false &&
      this.isWrongLevel == false &&
      this.isWrongPrice == false &&
      this.isWrongDuration == false &&
      this.isWrongPaypal == false &&
      this.isWrongAttendeeCnt == false) {           // create channel with validation check 
      this.isBusy = true;
      this.uploadedFileNames = [];
      this.uploadedFilePrices = [0.0];
      this.cntUploaded = 0;
      for (i = 0; i < this.cntUploadFile; i++) {
        if (this.uploadFileList[i] != null) {
          if (this.uploadFileList[i].size > 50 * 1024 * 1024) {
            this.uploadFlagList[i] = 3;
          }
          else {
            this.uploadFlagList[i] = 1;
            await this.channelService.postFile(this.uploadFileList[i])
              .then(res => {
                if (res.success) {
                  this.uploadFlagList[i] = 2;
                  this.uploadedFileNames[this.cntUploaded] = res.filename;
                  this.uploadedFilePrices[this.cntUploaded] = this.uploadPriceList[i];
                  this.cntUploaded++;
                }
                else {
                  this.uploadFlagList[i] = 3;
                }

                console.log(res);
              }).catch(err => {
                this.uploadFlagList[i] = 3;
                console.log(err);
              });
          }
        }
        else {
          this.uploadFlagList[i] = 2;
        }
      }
      await this.channelService.postChannelDetail(this.channeltmp, this.uploadedFileNames, this.uploadedFilePrices)
        .then(res => {
          this.isBusy = false;
          if (res.success) {
            // console.log("result:", res);
            this.successUploadModal.show();
            //            this.router.navigate(['/dashboard']);

          } else {
            // console.log("result:", res);
            this.failedUploadModal.show();
          }
        }).catch(error => {
          console.log(error);
          this.isBusy = false;
          this.failedUploadModal.show();
        });
    }
  }

  addUploadFile() {
    this.cntUploadFile++;
    this.uploadFileList.push(null);
    this.uploadFlagList.push(0);
  }

  removeUploadFile(idx) {
    if (this.uploadFlagList[idx] == 0) {
      this.cntUploadFile--;
      this.uploadFileList.splice(idx, 1);
      this.uploadFlagList.splice(idx, 1);
    }
  }

  setPriceTick(idx) {
    console.log("here:", idx, $("#check" + idx + ":checked").val());
    if ($("#check" + idx + ":checked").val()) {
      $("#price" + idx).prop("disabled", false);
    } else {
      $("#price" + idx).prop("disabled", true);
    }
  }

  selectSkill(skill) {
    this.currentSkill = skill;
    this.skillTagModal.hide();
    this.channeltmp.skill = this.currentSkill;
  }

  doSelectStation(option: INgxSelectOption) {
    console.log('MultipleDemoComponent.doSelectOptions', option);
    this.currentStation = option[0].text;
    console.log("station:", this.currentStation);
    this.channeltmp.station = this.currentStation;
  }

  selectIntermediateLevel() {
    this.channeltmp.level = "intermediate";
    console.log("intermediate");
  }

  selectProfessionalLevel() {
    this.channeltmp.level = "professional";
    console.log("Professional");
  }

  selectExpertLevel() {
    this.channeltmp.level = "expert";
    console.log("Expert");
  }
}

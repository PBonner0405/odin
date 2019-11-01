import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { environment } from '../../../../environments/environment';
import { UserService, CommonService } from '../../../services';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { INgxSelectOption } from 'ngx-select-ex/ngx-select/ngx-select.interfaces';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  pOption: any = {
    title: "",
    description: "",
    tags: []
  };

  userdata: any = {};

  ////////////////////Validation flags////////////////////
  isWrongPresenterTitle: boolean = false;
  isWrongPresenterDescription: boolean = false;
  isWrongPresenterTags: boolean = false;
  ////////////////////////////////////////////////////////

  ////////////////////    Dropdown    ////////////////////
  public items: any[] = [];
  public ngxValue: any = [];
  public ngxDisabled = false;
  ////////////////////////////////////////////////////////

  avatarPath: String = "";
  isBusy = false;

  @ViewChild('successModal', null) successModal: ModalDirective;

  constructor(private globalService: GlobalService, private userService: UserService, private commonService: CommonService) {
    this.avatarPath = environment.USER_AVATAR_PATH + globalService.getUser().avatarname;
    this.userdata = globalService.getUser();
    this.items = commonService.skills;
  }

  ngOnInit() {

  }

  savechange() {
    if (this.pOption.title.length > 0) {        //phone validation check      
      this.isWrongPresenterTitle = false;
    } else {
      this.isWrongPresenterTitle = true;
    }
    if (this.pOption.description.length >= 50) {        //phone validation check      
      this.isWrongPresenterDescription = false;
    } else {
      this.isWrongPresenterDescription = true;
    }
    if (this.pOption.tags.length > 0) {
      this.isWrongPresenterTags = false;
    } else {
      this.isWrongPresenterTags = true;
    }
    console.log("selected items:", this.pOption.tags);
    if (this.isWrongPresenterTitle == false && this.isWrongPresenterDescription == false && this.isWrongPresenterTags == false) {
      this.isBusy = true;
      this.userService.completeProfile(this.pOption, this.globalService.getToken())
        .then(res => {
          console.log(res);
          this.isBusy = false;
          if (res.success) {
            if (this.globalService.getToken() == res.data.token) {
              this.globalService.setUser(res.data.user);
              this.userdata = this.globalService.getUser();
              console.log("response user data:", this.userdata);
              this.successModal.hide();
            }
            else {
              alert("Token Authentication Error!!!");
            }
          } else {
            alert(res.message);
          }
        }).catch(error => {
          console.log(error);
          this.isBusy = false;
        })
    }
  }

  doSelectOptions(options: INgxSelectOption[]) {
    console.log('MultipleDemoComponent.doSelectOptions', options);
    this.pOption.tags = [];
    for (var i = 0; i < options.length; i++)
      this.pOption.tags[i] = options[i].text;
  }
}

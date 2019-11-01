import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/index';
declare var $: any;
declare const msDropdown: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  user: any = {
    username: "",
    email: "",
    password: "",
    birth: "",
    phone: "",
    country: "",
    ismadeprofile: false,
    avatar: "",
    file: File = null
  }

  isWrongUsername: boolean = false;
  isWrongEmail: boolean = false;
  isWrongPassword: boolean = false;
  isWrongBirth: boolean = false;
  isWrongPhone: boolean = false;
  isWrongCountry: boolean = false;
  isWrongJob: boolean = false;
  isWrongAboutme: boolean = false;
  isWrongAvatar: boolean = false;
  isBusy = false;
  // isPresenter = true;


  // @ViewChild('parentdiv', null) theDiv:ElementRef;

  constructor(private router: Router, private userService: UserService) { }

  ngAfterViewInit(): void {
    console.log("2:ngAfterViewInit");
    $(document).ready(function () {
      $("#countries").msDropdown();
    });
  }
  ngOnInit(): void {
    console.log("1:ngOnInit");
  }

  doSignup() {
    if (this.user.username.length > 0) {        //username validation check
      this.isWrongUsername = false;
    } else {
      this.isWrongUsername = true;
    }

    {                                           //email validation check 
      const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.isWrongEmail = !regExp.test(this.user.email);
    }

    if (this.user.password.length > 0) {        //password validation check
      this.isWrongPassword = false;
    } else {
      this.isWrongPassword = true;
    }

    {                                           //birthday validation check
      const dateReg = /^((19|20)\d\d)[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
      this.isWrongBirth = !dateReg.test(this.user.birth);
    }

    if (this.user.phone.length > 0) {        //phone validation check      
      this.isWrongPhone = false;
    } else {
      this.isWrongPhone = true;
    }

    if ($('#countries').val() != null)        //get country value
      this.user.country = $('#countries').val();
    else
      this.user.country = "";
    if (this.user.country.length > 0) {        //country validation check      
      this.isWrongCountry = false;
    } else {
      this.isWrongCountry = true;
    }

    if (this.user.avatar.length > 0) {        //avatar validation check      
      this.isWrongAvatar = false;
    } else {
      this.isWrongAvatar = true;
    }

    if (this.isWrongUsername == false &&
      this.isWrongEmail == false &&
      this.isWrongPassword == false &&
      this.isWrongBirth == false &&
      this.isWrongPhone == false &&
      this.isWrongCountry == false &&
      this.isWrongAvatar == false) {
      this.user.ismadeprofile = false;
      this.isBusy = true;
      this.userService.signup(this.user)                               
        .then(res => {
          console.log(res);
          this.isBusy = false;
          if (res.success) {
            alert("Verification email has sent to your email address. Please check out your email inbox.");
            this.router.navigate(['/login']);
          } else {
            alert(res.message);
          }
        }).catch(error => {
          console.log(error);
          this.isBusy = false;
        })
    }
  }

  insertPhoto(event: any) {
    $("#fileopen").trigger("click");
  }

  readImage(input) {
    var file: File = input.files[0];
    console.log("checkfile:", file);
    this.user.file = file;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      $("#userAvatar").attr("src", myReader.result);
    };
    myReader.readAsDataURL(file);
    /*return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = function (e) {
        resolve(e.target.result);
      }
      reader.error = function (e) {
        reject(e);
      }
      reader.readAsDataURL(input.files[0]);
    });*/
  }

  async openImage(event: any) {
    await this.readImage(event.target);
    // this.isWrongAvatar = false;
  }

  // checkPresenter() {
  //   $("#type-presenter").prop('checked', true);
  //   this.user.usertype = "presenter";
  //   this.isPresenter = true;
  // }

  // checkStudent() {
  //   $("#type-student").prop('checked', true);
  //   this.user.usertype = "student";
  //   this.isPresenter = false;
  // }
}

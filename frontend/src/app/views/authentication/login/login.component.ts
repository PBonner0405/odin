import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, GlobalService, SocketService } from '../../../services/index';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: any = {
    username: "",
    password: ""
  }
  isWrongUsername: boolean = false;
  isWrongPassword: boolean = false;
  isBusy = false;

  constructor(private router: Router, private userService: UserService, private globalService: GlobalService, private socketService: SocketService) { }

  ngOnInit() {

  }

  doLogin() {
    if (this.user.username.length > 0) {
      this.isWrongUsername = false;
    } else {
      this.isWrongUsername = true;
    }
    if (this.user.password.length > 0) {
      this.isWrongPassword = false;
    } else {
      this.isWrongPassword = true;
    }
    if (this.isWrongUsername == false && this.isWrongPassword == false) {
      this.isBusy = true;
      this.userService.login(this.user)
        .then(res => {
          console.log(res);
          this.isBusy = false;
          if (res.success) {
            this.globalService.setUser(res.data.user);
            this.globalService.setToken(res.data.token);
            this.socketService.sendLoginEvent(this.globalService.getUser()._id);
            this.router.navigate(['/dashboard']);
          } else {
            
          }
        }).catch(error => {
          console.log(error);
          this.isBusy = false;
        })
    }
  }
}

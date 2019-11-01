import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/index';

declare var $: any;

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  user: any = {
    password: "",
  }

  isWrongPassword: boolean = false;
  isBusy = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  sendPassword() {
    if (this.user.password.length > 0) {
      this.isWrongPassword = false;
    } else {
      this.isWrongPassword = true;
    }
    if (this.isWrongPassword == false) {
      this.isBusy = true;
      this.userService.resetPassword(this.user)
        .then(res => {
          console.log(res);
          this.isBusy = false;
          if (res.success) {
            alert("Successfully updated.");
            this.router.navigate(['/login']);
          } else {

          }
        }).catch(error => {
          console.log(error);
          this.isBusy = false;
        })
    }
  }

  showPassword() {
    var pass = $("#password");
    var fieldtype = pass.attr('type');
    if (fieldtype == 'password') {
      pass.attr('type', 'text');
      $(this).text("Hide Password");
    } else {
      pass.attr('type', 'password');
      $(this).text("Show Password");
    }
  }
}


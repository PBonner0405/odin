import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/index';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  user: any = {
    email: "",
  }

  isWrongEmail: boolean = false;
  isBusy = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
  }

  sendMail() {
    {                                           //email validation check 
      const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.isWrongEmail = !regExp.test(this.user.email);
    }

    if (this.isWrongEmail == false) {
      this.isBusy = true;
      this.userService.resetRequest(this.user)
        .then(res => {
          console.log(res);
          this.isBusy = false;
          if (res.success) {
            alert("Reset-password request has sent to your email address. Please check out your email inbox.");
            this.router.navigate(['/login']);
          } else {
          }
        }).catch(error => {
          console.log(error);
          this.isBusy = false;
        })
    }
  }
}

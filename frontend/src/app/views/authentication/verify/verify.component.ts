import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.route.params.subscribe(params => {

      this.userService.confirmVerify(params['URL'])
        .then(res => {
          console.log(res);
          if (res.success) {
            this.router.navigate(['/welcome']);
          } else {
            this.router.navigate(['/error']);
          }
        }).catch(error => {
          console.log(error);
        })
    });



  }
}

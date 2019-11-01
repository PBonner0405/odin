import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { GlobalService } from './global.service';

@Injectable()
export class ChannelGuard implements CanActivate {

    constructor(private router: Router, private globalService: GlobalService) { }

    canActivate() {
        if (this.globalService.getUser().ismadeprofile) {
            
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['dashboard']);
        return false;
    }
}

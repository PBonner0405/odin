import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../default_nav';
import { environment } from '../../../environments/environment';
import { GlobalService } from '../../services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  avatarPath : String = "assets/img/avatars/6.jpg";
  constructor(private globalService: GlobalService, @Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
    this.avatarPath = environment.USER_AVATAR_PATH + globalService.getUser().avatarname;
  }

  ngOnInit(){
    
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}

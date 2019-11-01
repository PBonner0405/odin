import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSelectModule } from 'ngx-select-ex';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { FullCalendarModule } from 'ng-fullcalendar'; // for FullCalendar!

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import the library module
import { AngularResizedEventModule } from 'angular-resize-event';

// Import containers
import { DefaultLayoutComponent, CustomLayoutComponent } from './containers';

import { P404DefaultComponent } from './views/error/404.component';
import { P500DefaultComponent } from './views/error/500.component';
import { P404Component } from './default-views/error/404.component';
import { P500Component } from './default-views/error/500.component';
import { LoginComponent } from './views/authentication/login/login.component';
import { RegisterComponent } from './views/authentication/register/register.component';
import { AuthGuard } from './services/auth.service';
import { UserService, GlobalService, SocketService, CommonService, ChatService, EventService, ChannelService, ChannelGuard, PaymentService } from './services';

const APP_CONTAINERS = [
  DefaultLayoutComponent,
  CustomLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { ChartsModule } from 'ng2-charts';
import { from } from 'rxjs';
import { ForgetComponent } from './views/authentication/forget/forget.component';
import { ErrorComponent } from './views/authentication/error/error.component';
import { ResetComponent } from './views/authentication/reset/reset.component';
import { WelcomeComponent } from './views/authentication/welcome/welcome.component';
import { VerifyComponent } from './views/authentication/verify/verify.component';
import { LivesessionService } from './services/livesession.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FullCalendarModule,
    // BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    // ChartsModule,
    AngularResizedEventModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSelectModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    P404DefaultComponent,
    P500DefaultComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    ErrorComponent,
    ResetComponent,
    WelcomeComponent,
    VerifyComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  },
    UserService,
    AuthGuard,
    ChannelGuard,
    GlobalService,
    SocketService,
    CommonService,
    ChatService,
    EventService,
    ChannelService,
    LivesessionService,
    PaymentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

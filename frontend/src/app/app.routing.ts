import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent, CustomLayoutComponent } from './containers';

import { AuthGuard, ChannelGuard } from './services/index';
import { P404DefaultComponent } from './views/error/404.component';
import { P500DefaultComponent } from './views/error/500.component';
import { LoginComponent } from './views/authentication/login/login.component';
import { RegisterComponent } from './views/authentication/register/register.component';
import { WelcomeComponent } from './views/authentication/welcome/welcome.component';
import { ErrorComponent } from './views/authentication/error/error.component';
import { ForgetComponent } from './views/authentication/forget/forget.component';
import { ResetComponent } from './views/authentication/reset/reset.component';
import { VerifyComponent } from './views/authentication/verify/verify.component';

//Import Child module
import { BaseModule } from './views/base/base.module';
// import { DashboardModule } from './views/dashboard/dashboard.module';
// import { ProfileModule } from './views//profile/profile.module'
// import { ButtonsModule } from './views/buttons/buttons.module';
// import { ChartJSModule } from './views/chartjs/chartjs.module';
// import { IconsModule } from './views/icons/icons.module';
// import { NotificationsModule } from './views/notifications/notifications.module';
// import { ThemeModule } from './views/theme/theme.module';
// import { WidgetsModule } from './views/widgets/widgets.module';


export const routes: Routes = [
  {
    path: '',
    component: CustomLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'base',
        loadChildren: () => BaseModule
      },
      // {
      //   path: 'buttons',
      //   loadChildren: () => ButtonsModule
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => ChartJSModule
      // },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/account/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'message',
        loadChildren: () => import('./views/chat/chat.module').then(m=>m.ChatModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('./views/session/schedule/schedule.module').then(m=>m.ScheduleModule)
      },
      {
        path: 'channel',
        canActivate: [ChannelGuard],
        loadChildren: () => import('./views/channel/channel.module').then(m=>m.ChannelModule)
      },
      {
        path: 'channellist',
        loadChildren: () => import('./views/channellist/channellist.module').then(m=>m.ChannellistModule)
      },
      {
        path: 'channelshow',
        loadChildren: () => import('./views/channelshow/channelshow.module').then(m=>m.ChannelshowModule)
      },
      {
        path: 'livesession',
        loadChildren: () => import('./views/session/livesession/livesession.module').then(m=>m.LivesessionModule)
      },
      // {
      //   path: 'icons',
      //   loadChildren: () => IconsModule
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: () => NotificationsModule
      // },
      // {
      //   path: 'theme',
      //   loadChildren: () => ThemeModule
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () => WidgetsModule
      // },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  {
    path: 'page',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'base',
        loadChildren: () => import('./default-views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./default-views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./default-views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./default-views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./default-views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./default-views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./default-views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./default-views/widgets/widgets.module').then(m => m.WidgetsModule)
      },
      { path: '**', redirectTo: 'page/dashboard', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginComponent, data: { title: 'Login Page' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Register Page' } },
  { path: 'welcome', component: WelcomeComponent, data: { title: 'Welcome' } },
  { path: 'error', component: ErrorComponent, data: { title: 'Warning' } },
  { path: 'forget', component: ForgetComponent, data: { title: 'Forget' } },
  { path: 'resetpassword', component: ResetComponent, data: { title: 'ResetPassword' } },
  { path: '404', component: P404DefaultComponent, data: { title: 'Page 404' } },
  { path: '500', component: P500DefaultComponent, data: { title: 'Page 500' } },
  { path: 'email-verification/:URL', component: VerifyComponent, data: { title: 'Email Verification' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

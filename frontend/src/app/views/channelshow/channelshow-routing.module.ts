import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelshowComponent } from './channelshow.component';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';

const routes: Routes = [
  {
    path: '**',
    component: ChannelshowComponent,
    data: {
      title: 'Channelshow'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    TooltipModule.forRoot()],
  exports: [RouterModule]
})
export class ChannelshowRoutingModule {}
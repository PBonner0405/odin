import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannellistComponent } from './channellist.component';

const routes: Routes = [
  {
    path: '',
    component: ChannellistComponent,
    data: {
      title: 'Channellist'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannellistRoutingModule {}
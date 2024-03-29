import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelComponent } from './channel.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelComponent,
    data: {
      title: 'Channel'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelRoutingModule {}
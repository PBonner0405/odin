import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivesessionComponent } from './livesession.component';

const routes: Routes = [
  {
    path: '',
    component: LivesessionComponent,
    data: {
      title: 'LiveSession'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivesessionRoutingModule {}
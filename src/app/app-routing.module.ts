import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallComponent } from './phone/call/call.component';
import { ExpertComponent } from './phone/expert/expert.component';
import { TabsComponent } from './phone/tabs/tabs.component';

const routes: Routes = [
		{ path: '', component: TabsComponent },
		{ path: 'phone', component: CallComponent },
		{ path: 'expert', component: ExpertComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SlackAppComponent } from './slack-app/slack-app.component';

const routes: Routes = [
  { path: '', component: SlackAppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'slack/:id', component: SlackAppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

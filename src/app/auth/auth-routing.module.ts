import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ResetComponent} from './components/reset/reset.component';
import {AuthGuard} from './auth-guard.service';


const routes: Routes = [
  {
    path: 'reset-password',
    component: ResetComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {path: 'register', component: RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}

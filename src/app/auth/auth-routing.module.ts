import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ResetComponent} from './components/reset/reset.component';
import {AuthGuardGuard} from './auth-guard.guard';


const routes: Routes = [
  {
    path: 'reset-password',
    component: ResetComponent,
    canActivate: [AuthGuardGuard],
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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ResetComponent} from './components/reset/reset.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
  ],
  exports: [
    LoginComponent, RegisterComponent, ResetComponent
  ]
})
export class AuthModule {
}

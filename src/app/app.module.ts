import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { DetailComponent } from './detail/detail.component';
import { NgxElectronModule } from 'ngx-electron';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MoneyPipe } from './money.pipe';
import { VowelsPipe } from './vowels.pipe';
import { FraganciaFormComponent } from './fragancia-form/fragancia-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    UploadComponent,
    DetailComponent,
    MoneyPipe,
    VowelsPipe,
    FraganciaFormComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AuthModule,
        NgbModule,
        NgxElectronModule,
        FormsModule,
        ReactiveFormsModule,
    ],
  providers: [],
  exports: [
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

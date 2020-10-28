import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {AuthGuard} from './auth/auth-guard.service';
import {HomeComponent} from './home/home.component';
import {DetailComponent} from './detail/detail.component';
import {FraganciaFormComponent} from './fragancia-form/fragancia-form.component';
import { CommoditiesFormComponent } from './commodities-form/commodities-form.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new_fragancia',
    component: FraganciaFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'upload_commodities',
    component: CommoditiesFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'commodities',
    component: DetailComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

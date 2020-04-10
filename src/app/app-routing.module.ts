import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CanActivateGuard } from './providers/canactivate.guard.service';
import { AddingComponent } from './components/adding/adding.component';
import { SettingComponent } from './components/setting/setting.component';
import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivateChild: [CanActivateGuard],
    canActivate: [CanActivateGuard]
  },
  {
    path: 'adding',
    component: AddingComponent
  },
  {
    path: 'setting',
    component: SettingComponent
  },
  {
    path: 'landing',
    component: LandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

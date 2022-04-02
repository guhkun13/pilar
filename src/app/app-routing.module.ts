import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { Login2Component } from './pages/login2/login2.component';
import { Login3Component } from './pages/login3/login3.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login2',
    component: Login2Component,
  },
  {
    path: 'login3',
    component: Login3Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

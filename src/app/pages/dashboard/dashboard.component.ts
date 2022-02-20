import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/auth.service';
import { IUserLoggedIn } from 'src/app/interfaces/userLoggedIn';

import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  isLoggedIn?: boolean = false;
  userLoggedIn: any;

  ngOnInit(): void {
    console.log('init from Dashboard Comp');
    this.userLoggedIn = this.getUser();
  }

  getUser(): any {
    if (
      localStorage.getItem('userLoggedIn') != null ||
      localStorage.getItem('userLoggedIn') != undefined
    ) {
      var user: any = localStorage.getItem('userLoggedIn');
      this.isLoggedIn = true;
      console.log('local storage not null!');
      console.log(user);

      return JSON.parse(user);
    }
  }

  // Logout the current session
  logout(): void {
    console.log('LOGOUT!');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { IUserLoggedIn } from 'src/app/interfaces/userLoggedIn';
import { Component, Injectable, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { ILogin } from 'src/app/interfaces/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  dummyUser: ILogin = { userid: 'admnin', password: 'admin@123' };

  loginForm?: FormGroup;
  message?: string;
  returnUrl?: string;
  socialUser!: SocialUser;
  isLoggedin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.returnUrl = '/';
    this.authService.logout();

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
    });
  }

  get f() {
    return this.loginForm?.controls;
  }

  // Initial implicite flow using OAuth2 protocol
  loginWithGoogle(): void {
    console.log('loginWithGoogle in LoginComp');
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(() => {
      console.log('login with Google OK');
      console.log(this.returnUrl);

      let userLoggedIn: IUserLoggedIn = {
        name: this.socialUser.name,
        email: this.socialUser.email,
        photoUrl: this.socialUser.photoUrl,
        firstName: this.socialUser.firstName,
        lastName: this.socialUser.lastName,
      };

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userLoggedIn', JSON.stringify(userLoggedIn));

      localStorage.setItem('name', this.socialUser.name);
      localStorage.setItem('email', this.socialUser.email);
      localStorage.setItem('photoUrl', this.socialUser.photoUrl);
      localStorage.setItem('firstName', this.socialUser.firstName);
      localStorage.setItem('lastName', this.socialUser.lastName);

      this.router.navigate([this.returnUrl]);
    });
  }
}

/**
 * contoh hasil login : 
 * {
    "id": "115090881468295724551",
    "name": "guhkun patata",
    "email": "guhkun13@gmail.com",
    "photoUrl": "https://lh3.googleusercontent.com/a-/AOh14GihAxdAHJklQg41-CLRC66DJ7BZHlx1H5cNyI8w1w=s96-c",
    "firstName": "guhkun",
    "lastName": "patata",
    "authToken": "ya29.A0ARrdaM-a2HnOUqcYjoj0k2V7x7-ggulVpBmvvIEj2BYmaYFxh3Oz-yHBlAH98wM0WLaQoWSeooSz2q5yG7agxjh_vMI0vmH6QYK6tpF4H4fb-KhEjABdOm_uOPLcEwJovCZWcfrnISC21B31FrPxfsCVCR0A",
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjYjZiZTUxZWZlYTZhNDE5ZWM5MzI1ZmVhYTFlYzQ2NjBmNWIzN2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTY3NTUyMjU3Mjk1LTZ2a3YxNXViaHBiMWZkbWhndjNxaXQ3c2ljb3NlOWhiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTY3NTUyMjU3Mjk1LTZ2a3YxNXViaHBiMWZkbWhndjNxaXQ3c2ljb3NlOWhiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE1MDkwODgxNDY4Mjk1NzI0NTUxIiwiZW1haWwiOiJndWhrdW4xM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImQ1SVB6b3p3eXotN1hpMU5xZWVLTHciLCJuYW1lIjoiZ3Voa3VuIHBhdGF0YSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaWhBeGRBSEprbFFnNDEtQ0xSQzY2REo3QlpIbHgxSDVjTnlJOHcxdz1zOTYtYyIsImdpdmVuX25hbWUiOiJndWhrdW4iLCJmYW1pbHlfbmFtZSI6InBhdGF0YSIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNjQ1MzUwNTM0LCJleHAiOjE2NDUzNTQxMzQsImp0aSI6IjA2NjM0OGI3ZTFmYzU5MjY2YWFlNWNiYTk1YTUwNTExZmM4Mjc3NDkifQ.Y4MRKIj02CnV541tVdEI-L7voYgNcGGVXWqkEQES0xgmPBAkK0AnjZfe6IiEsxCpjyGH0dsEYzJlzVdZWoWMKWzQHyoBitF7dnrSDZPkbDuMvym1YlSnOMcMNkUzSBx8dJXAQvMk-RALWFZmiv63a9zcv9U19xCysiNEt5o9n2eBJEF76m32gUNVx4nED7rG6pw4DpSlsuZ-ak2aDvVIvYad7_tfqe9TP6scX1rfmd2O6zVyj3RDNLOKNeM8L5U5Em9UWulFiKD0k517VHENjOAqTtda4llOKSGvwlTlkcNbQdOc-Ur0c5b_DRezYbqUJPWHgABXpCp13wHJ3YkoJg",
    "response": {
        "token_type": "Bearer",
        "access_token": "ya29.A0ARrdaM-a2HnOUqcYjoj0k2V7x7-ggulVpBmvvIEj2BYmaYFxh3Oz-yHBlAH98wM0WLaQoWSeooSz2q5yG7agxjh_vMI0vmH6QYK6tpF4H4fb-KhEjABdOm_uOPLcEwJovCZWcfrnISC21B31FrPxfsCVCR0A",
        "scope": "email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
        "login_hint": "AJDLj6JUa8yxXrhHdWRHIV0S13cAduMRVY-jZ2iQ30F7_vN0HszzVIL8ahBGHJBws6nZJH5pOeQMjhy9B8TumGtflmJgE-FzWg",
        "expires_in": 3599,
        "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjYjZiZTUxZWZlYTZhNDE5ZWM5MzI1ZmVhYTFlYzQ2NjBmNWIzN2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTY3NTUyMjU3Mjk1LTZ2a3YxNXViaHBiMWZkbWhndjNxaXQ3c2ljb3NlOWhiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTY3NTUyMjU3Mjk1LTZ2a3YxNXViaHBiMWZkbWhndjNxaXQ3c2ljb3NlOWhiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE1MDkwODgxNDY4Mjk1NzI0NTUxIiwiZW1haWwiOiJndWhrdW4xM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImQ1SVB6b3p3eXotN1hpMU5xZWVLTHciLCJuYW1lIjoiZ3Voa3VuIHBhdGF0YSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHaWhBeGRBSEprbFFnNDEtQ0xSQzY2REo3QlpIbHgxSDVjTnlJOHcxdz1zOTYtYyIsImdpdmVuX25hbWUiOiJndWhrdW4iLCJmYW1pbHlfbmFtZSI6InBhdGF0YSIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNjQ1MzUwNTM0LCJleHAiOjE2NDUzNTQxMzQsImp0aSI6IjA2NjM0OGI3ZTFmYzU5MjY2YWFlNWNiYTk1YTUwNTExZmM4Mjc3NDkifQ.Y4MRKIj02CnV541tVdEI-L7voYgNcGGVXWqkEQES0xgmPBAkK0AnjZfe6IiEsxCpjyGH0dsEYzJlzVdZWoWMKWzQHyoBitF7dnrSDZPkbDuMvym1YlSnOMcMNkUzSBx8dJXAQvMk-RALWFZmiv63a9zcv9U19xCysiNEt5o9n2eBJEF76m32gUNVx4nED7rG6pw4DpSlsuZ-ak2aDvVIvYad7_tfqe9TP6scX1rfmd2O6zVyj3RDNLOKNeM8L5U5Em9UWulFiKD0k517VHENjOAqTtda4llOKSGvwlTlkcNbQdOc-Ur0c5b_DRezYbqUJPWHgABXpCp13wHJ3YkoJg",
        "session_state": {
            "extraQueryParams": {
                "authuser": "0"
            }
        },
        "first_issued_at": 1645350534931,
        "expires_at": 1645354133931,
        "idpId": "google"
    },
    "provider": "GOOGLE"
}
 */

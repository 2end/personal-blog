import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SigninModel } from '../signin/signin-model';
import { SignupModel } from '../signup/signup-model';
import { User } from './user-model';
import { SigninResult } from '../shared/models/signin-result';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private signinUrl: string = environment.apiUrl + '/signin/';
  private signupUrl: string = environment.apiUrl + '/user/';
  redirectUrl: string;
  inBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.inBrowser = isPlatformBrowser(platformId);
  }

  signin(model: SigninModel): Observable<any> {
    return this.http.post(this.signinUrl, model).pipe(
      tap((result: SigninResult) =>  {
        this.token = result.token;
        this.user = {
          id: result.userId,
          name: result.userName, 
          isSubscribed: result.isSubscribed, 
          isAdmin: result.isAdmin 
        };
      }),
    );
  }

  signup(model: SignupModel): Observable<any> {
    return this.http.post(this.signupUrl, model).pipe();
  }

  get isSignedin(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
     return this.user == null ? false : this.user.isAdmin;
  }

  redirectSignin() {
    this.router.navigate(['/signin']);
  }

  signout() {
    this.token = null;
    this.user = null;
  }

  private set token(token: string) {
    if (!token) {
      localStorage.removeItem('auth-token');
    } else {
      localStorage.setItem('auth-token', token);
    }
  }

  private get token(): string {
    if (this.inBrowser) {
      return localStorage.getItem('auth-token');
    } else {
      return null;
    }
  }

  set user(user: User) {
    if (!user) {
      localStorage.removeItem('auth-user');
    } else {
      localStorage.setItem('auth-user', JSON.stringify(user));
    }
  }

  get user(): User {
    if (this.inBrowser) {
      const userRaw: string = localStorage.getItem('auth-user');
      const user: any = userRaw ? JSON.parse(userRaw) : null;      
      return user;
    }
  }

  addHeaders(headers: HttpHeaders): HttpHeaders {
    return headers.set('Authorization', 'Bearer ' + this.token);
  }
}

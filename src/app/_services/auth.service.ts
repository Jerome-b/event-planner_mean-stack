import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = '/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // api for POST request
  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  // api for register
  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      phone: user.phone,
      email: user.email,
      password: user.password,
    }, httpOptions);
  }

}

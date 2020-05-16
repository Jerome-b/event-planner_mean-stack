import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

const API_URL = '/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Get all users
  getUsers() {
    return this.http.get(API_URL + 'all');
  }

  getUsers2(): Observable<User[]> {
    return this.http.get<User[]>(API_URL + 'specific');
  }

  getUsers3(): Observable<User[]> {
    return this.http.get<User[]>(API_URL + 'specific2');
  }
}

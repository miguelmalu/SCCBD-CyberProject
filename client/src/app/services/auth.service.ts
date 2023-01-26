import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role';
import { User } from '../models/user';
import { UserCredentials } from '../models/userCredentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.apiURL + '/api/auth';

  constructor(private http: HttpClient) { }

  loginUser(userCredentials: UserCredentials): Observable<string> {
    return this.http.post(this.url + '/login', userCredentials, {responseType: 'text'}) ;
  }

  registerUser(user: User): Observable<string> {
    return this.http.post(this.url + '/register', user, {responseType: 'text'}) ;
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.url + '/roles');
  }

  addRole(role: Role): Observable<string> {
    return this.http.post(this.url + '/roles', role, {responseType: 'text'}) ;
  }
}

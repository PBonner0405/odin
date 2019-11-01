import { Injectable } from '@angular/core';
import { UserModel } from './user.model';

@Injectable()
export class GlobalService {
  constructor() { }

  //////////////   set & get login user   ////////////
  getUser(): UserModel {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
  }

  setUser(user: UserModel) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  setToken(token: any) {
    localStorage.setItem('userToken', token);
  }

  getToken(): string {
    return localStorage.getItem('userToken');
  }

  removeUser() {
    localStorage.removeItem('currentUser');
  }

  removeToken() {
    localStorage.removeItem('userToken');
  }
}

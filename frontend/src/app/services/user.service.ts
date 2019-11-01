import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { contentHeaders } from '../common/headers';
import { environment } from '../../environments/environment';
import { Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(public http: Http) { }

  handleError(error: any) {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }


  /////////////    account Login   ////////////

  login(user: any): Promise<any> {
    const request_url = environment.SERVER_URL + '/auth/login';
    const data = {
      name: user.username,
      password: user.password,
    };
    console.log("request url:", request_url);
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  //////////    account register   //////////
  signup(user: any): Promise<any> {
    console.log(user);
    const request_url = environment.SERVER_URL + '/auth/signup';

    let formData: FormData = new FormData();
    console.log("file:", user.file);
    formData.append('avatar', user.file, user.file.name);
    formData.append('name', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('birthday', user.birth);
    formData.append('phone', user.phone);
    formData.append('country', user.country);
    formData.append('ismadeprofile', user.ismadeprofile);
    formData.append('avatar', user.avatar);
    console.log("formdata:", formData);

    const uploadHeaders = new Headers();
    
    uploadHeaders.append('Content-Type', undefined);
    return this.http.post(request_url, formData)
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  //////////    Reset-password request message to user email   //////////
  resetRequest(user: any): Promise<any> {
    const request_url = environment.SERVER_URL + '/auth/forgot-password';
    const data = {
      email: user.email
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()  
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  //////////    Send reset-password   //////////
  resetPassword(user: any): Promise<any> {
    var url = window.location.href;
    var token = url.split("=").slice(-1)[0];
    const request_url = environment.SERVER_URL + '/auth/reset-password/' + token;
    console.log("request_url:",request_url);
    const data = {
      password: user.password
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  //////////    Send Email Verify Confirm   //////////
  confirmVerify(URL : any): Promise<any> {
    const request_url = environment.SERVER_URL + '/auth/email-verification/' + URL;
    console.log("email confirm request_url:",request_url);
    return this.http.get(request_url)
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  //////////    Logout   //////////
  logout(token: String): Promise<any>{
    const request_url = environment.SERVER_URL + '/auth/logout';
    const data = {
      token: token
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  //////////     Add Presenter Profile Options     //////////
  completeProfile(pOption: any, token: any): Promise<any> {
    console.log(pOption);
    const request_url = environment.SERVER_URL + '/auth/update';
    const data = {
      presentertitle: pOption.title,
      presenterdescription: pOption.description,
      tags: pOption.tags,
      token: token
    };

    console.log("update data:", data);
    
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }
}

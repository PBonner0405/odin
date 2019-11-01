import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { contentHeaders } from '../common/headers';
import { environment } from '../../environments/environment';
import { GlobalService } from './global.service';
import { CommonService } from './common.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(public http: Http, public global: GlobalService, public commonService: CommonService, public socketService: SocketService) { }

  handleError(error: any) {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  addContactRequest(contactid: string): Promise<any> {
    const request_url = environment.SERVER_URL + '/chat/addcontact';
    const data = {
      token: this.global.getToken(),
      contactid: contactid,
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => { return res.json(); })
      .catch(this.handleError);
  }

  getContactRequest(): Promise<any> {
    const request_url = environment.SERVER_URL + '/chat/getcontact';
    const data = {
      token: this.global.getToken()
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => {
        this.commonService.contactList = res.json().contactData;
        return res.json(); 
      })
      .catch(this.handleError);
  }

  getMessageRequest(): Promise<any> {
    const request_url = environment.SERVER_URL + '/chat/getmessage';
    const data = {
      token: this.global.getToken()
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => {
        this.commonService.messageList = res.json().messageData;
        return res.json(); 
      })
      .catch(this.handleError);
  }

  sendMessage(senderid: String,receiverid: String, messagedata: String) {
    this.socketService.sendMessage(senderid, receiverid, messagedata);
  }

  readMessageRequest(senderid: string, receiverid: string): Promise<any> {            //I've read received message
    const request_url = environment.SERVER_URL + '/chat/readmessage';
    const data = {
      token: this.global.getToken(),
      senderid: senderid,
      receiverid: receiverid
    };
    return this.http.post(request_url, data, { headers: contentHeaders })
      .toPromise()
      .then(res => {
        return res.json(); 
      })
      .catch(this.handleError);
  }
}

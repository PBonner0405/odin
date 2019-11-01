import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export class SocketService {
    private url = environment.SOCKET_URL;
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    public sendLoginEvent(userId) {                     //send login event
        this.socket.emit('newuser', userId);
    }

    public sendActiveEvent(userId) {                     //send newconnection event(access page(include already login))
        this.socket.emit('newconnection', userId);
    }

    public sendLogoutEvent() {                          //send disconnect event
        this.socket.emit('userlogout');
    }

    public onActiveUsers() {                            //receive all active users    
        return Observable.create(observer => {
            this.socket.on('allactiveusers', msg => {
                observer.next(msg);
            });
        });
    }

    public onLoginUsers() {                            //receive all login users    
        return Observable.create(observer => {
            this.socket.on('allloginusers', msg => {
                observer.next(msg);
            });
        });
    }

    public onRegisterUsers() {                            //receive all register users    
        return Observable.create(observer => {
            this.socket.on('allregisterusers', msg => {
                observer.next(msg);
            });
        });
    }

    ////////////////////////////////////// Chatting ///////////////////////////////////////

    public sendMessage(senderid, receiverid, messagedata) {
        this.socket.emit('sendchatmessage', {senderid: senderid, receiverid: receiverid, messagedata: messagedata});
    }

    public onNewContact() {                            //receive new contact for chatting   
        return Observable.create(observer => {
            this.socket.on('newchatcontact', msg => {
                observer.next(msg);
            });
        });
    }

    public onReceiveMessage() {                            //receive message   
        return Observable.create(observer => {
            this.socket.on('receivechatmessage', msg => {
                observer.next(msg);
            });
        });
    }

    /////////////////////////////////////// Scheduling ///////////////////////////////////////

    public onReceiveEvent() {
        return Observable.create(observer => {
            this.socket.on('allevents', msg => {
                observer.next(msg);
            });
        })
    }

    ////////////////////////////////////// Live Session /////////////////////////////////////

    

    public sendLiveSessionMessage(senderid, receiverid, msgdata) {
        this.socket.emit('sessionmsgtoserver', {senderid: senderid, receiverid: receiverid, msgdata: msgdata});
    }

    public receiveLiveSessionMessage() {
        return Observable.create(observer => {
            this.socket.on('sessionmsgtoclient', msg => {
                observer.next(msg);
            });
        })
    }
}
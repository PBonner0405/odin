import { Injectable } from '@angular/core';
import { contentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlobalService } from './global.service';
import { Http } from '@angular/http';
@Injectable()
export class EventService {

    constructor(public http: Http, public global: GlobalService) { }

    public eventData: any = [];
    public allEventData: any = [];
    handleError(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

    public setEvents(data) {
        var i;
        this.eventData = [];
        this.allEventData = [];
        for (i = 0; i < data.length; i++) {
            if (this.global.getUser()._id == data[i].userid) {
                this.eventData.push(data[i]);
            }
            this.allEventData.push(data[i]);
        }
        // this.eventData.push({
        //     title:"My repeating event",
        //     start: '2019-09-25T10:00:00.000Z', 
        //     end: '2019-09-25T14:00:00.000Z',
        //     dow: [ 1,4 ]
        // });
    }

    public getEvents() {
        return Observable.create(observer => {
            let data = this.eventData;
            // let data: any = [{
            //     title: 'All Day Event',
            //     start: this.yearMonth + '-01'
            // },
            // {
            //     title: 'Long Event',
            //     start: this.yearMonth + '-07',
            //     end: this.yearMonth + '-10'
            // },
            // {
            //     id: 999,
            //     title: 'Repeating Event',
            //     start: this.yearMonth + '-09T16:00:00'
            // },
            // {
            //     id: 999,
            //     title: 'Repeating Event',
            //     start: this.yearMonth + '-16T16:00:00'
            // },
            // {
            //     title: 'Conference',
            //     start: this.yearMonth + '-11',
            //     end: this.yearMonth + '-13'
            // },
            // {
            //     title: 'Meeting',
            //     start: this.yearMonth + '-12T10:30:00',
            //     end: this.yearMonth + '-12T12:30:00'
            // },
            // {
            //     title: 'Lunch',
            //     start: this.yearMonth + '-12T12:00:00'
            // },
            // {
            //     title: 'Meeting',
            //     start: this.yearMonth + '-12T14:30:00'
            // },
            // {
            //     title: 'Happy Hour',
            //     start: this.yearMonth + '-12T17:30:00'
            // },
            // {
            //     title: 'Dinner',
            //     start: this.yearMonth + '-12T20:00:00'
            // },
            // {
            //     title: 'Birthday Party',
            //     start: this.yearMonth + '-13T07:00:00'
            // },
            // {
            //     title: 'Click for Google',
            //     url: 'http://google.com/',
            //     start: this.yearMonth + '-28'
            // }];

            observer.next(data);
        });
    }

    get yearMonth(): string {
        const dateObj = new Date();
        var month = dateObj.getUTCMonth();
        if (month + 1 >= 10) {
            return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
        }
        else {
            return dateObj.getUTCFullYear() + '-' + '0' + (dateObj.getUTCMonth() + 1);
        }
    }

    //////////    add event   //////////
    addEvent(eventitem: any): Promise<any> {
        const request_url = environment.SERVER_URL + '/schedule/addevent';

        const data = {
            token: this.global.getToken(),
            title: eventitem.title,
            start: eventitem.start,
            end: eventitem.end,
            description: eventitem.description,
            channel: eventitem.channel,
            type: eventitem.type,
            source: eventitem.source,
            partnerid: eventitem.partnerid
        };
        console.log("request url:", request_url);
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    //////////    change event   //////////
    changeEvent(eventid, eventmodel: any): Promise<any> {
        const request_url = environment.SERVER_URL + '/schedule/changeevent';

        const data = {
            token: this.global.getToken(),
            eventid: eventid,
            newtitle: eventmodel.title,
            newstart: eventmodel.start,
            newend: eventmodel.end,
            newdescription: eventmodel.description,
            newchannel: eventmodel.channel,
            newtype: eventmodel.type
        };
        console.log("request url:", request_url);
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    //////////     remove event      /////////////////
    removeEvent(eventid): Promise<any> {
        const request_url = environment.SERVER_URL + '/schedule/removeevent';

        const data = {
            token: this.global.getToken(),
            eventid: eventid
        };

        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    ///////////////////get all event request//////////////////
    sendEventRequest(): Promise<any> {
        const request_url = environment.SERVER_URL + '/schedule/eventrequest';
        const data = {
            token: this.global.getToken()
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    //////////////////// session request /////////////////////
    requestPresenterSchedule(presenterID): Promise<any> {
        const request_url = environment.SERVER_URL + '/schedule/presenterschedule';
        const data = {
            token: this.global.getToken(),
            presenterid: presenterID
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then( res => { return res.json(); })
            .catch(this.handleError);
    }
};

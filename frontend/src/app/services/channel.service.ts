import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlobalService } from './global.service';
import { PrenormalizedTemplateMetadata } from '@angular/compiler';

@Injectable()
export class ChannelService {
    constructor(public http: Http, public global: GlobalService) { }

    handleError(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

    postFile(fileToUpload: File): Promise<any> {
        const request_url = environment.SERVER_URL + '/channel/upload';
        console.log("request:", request_url);
        let formData = new FormData();

        console.log("file description:", fileToUpload);
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        formData.append('token', this.global.getToken());

        return this.http.post(request_url, formData)
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    postChannelDetail(Data: any, uploadedList: any, uploadedPrices: any): Promise<any> {
        const request_url = environment.SERVER_URL + '/channel/info';
        const data = {
            token: this.global.getToken(),
            title: Data.title,
            description: Data.description,
            level: Data.level,
            price: Data.price,
            duration: Data.duration,
            attendeecnt: Data.attendeecnt,
            paypalmail: Data.paypalmail,
            skill: Data.skill,
            station: Data.station,
            files: uploadedList,
            uploadprices: uploadedPrices
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    postSearch(keyword: any, station: any): Promise<any> {
        const request_url = environment.SERVER_URL + '/channel/search';
        const data = {
            token: this.global.getToken(),
            keyword: keyword,
            station: station
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    postViewChannel(channelid: any): Promise<any> {
        const request_url = environment.SERVER_URL + '/channel/addview';
        const data = {
            token: this.global.getToken(),
            channelid: channelid
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    postChannelReview(review: any, channelid: any): Promise<any> {
        const request_url = environment.SERVER_URL + '/channel/review';
        const data = {
            token: this.global.getToken(),
            channelid: channelid,
            rating: review.rating,
            feedback: review.feedback
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }

    postChannelRequest(channelid: String): Promise<any> {
        const request_url = environment.SERVER_URL + '/channel/channelrequest';
        const data = {
            token: this.global.getToken(),
            channelid: channelid
        };

        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }
}


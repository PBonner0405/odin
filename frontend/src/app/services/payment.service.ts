import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { contentHeaders } from '../common/headers';
import { environment } from '../../environments/environment';

import { GlobalService } from './global.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    constructor(public http: Http, public global: GlobalService) { }

    handleError(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

    paymentRequest(price: any, paymentmail: String, videoname: String, redirecturl: String): Promise<any> {
        const request_url = environment.SERVER_URL + '/payment/servicepay';
        const data = {
            token: this.global.getToken(),
            price: price,
            paymentmail: paymentmail,
            videoname: videoname,
            redirecturl: redirecturl
        };
        return this.http.post(request_url, data, { headers: contentHeaders })
            .toPromise()
            .then(res => { return res.json(); })
            .catch(this.handleError);
    }
}

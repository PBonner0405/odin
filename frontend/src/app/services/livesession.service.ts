import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlobalService } from './global.service';
import { SocketService } from './socket.service';
import { CommonService } from './common.service';
declare let RTCPeerConnection: any;

@Injectable()
export class LivesessionService {

    peerConnection: any;
    createOfferflag: any = 0;
    receiverid: any;
    senderid: any;

    mediaStream: any = [];

    constructor(public http: Http, public global: GlobalService, public socketService: SocketService, public commonService: CommonService) { }

    handleError(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

    ngOnInit() {

    }

    async inviteToVideoCall(sender, receiver) {
        // Check if we have an open connection already
        console.log("invite video call, sender:" + sender + ", receiver:" + receiver);
        // if (this.peerConnection) {
        //     console.log('You already have a call open.');
        // } else {
        this.receiverid = receiver;
        this.senderid = sender;
        console.log("receiverid:", this.receiverid);
        if (this.senderid === this.receiverid) {
            alert("You can't call yourself.");
            return;
        }

        this.peerConnection = await this.createPeerConnection();

        // Requesting webcam access...
        console.log("invite to call-----------------");
        await this.getLocalMedia(sender, receiver);
        // }
    }

    createPeerConnection() {
        //format video src
        this.commonService.srcNative = [];
        this.commonService.srcRemote = [];

        // Starts the peer connection
        const peerConnection = new RTCPeerConnection({
            'iceServers': [
                { 'urls': 'stun:stun.stunprotocol.org:3478' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        });

        // Sends out our ICE candidate through our signaling server
        peerConnection.onicecandidate = ({ candidate }) => {
            if (candidate) {
                this.socketService.sendLiveSessionMessage(
                    // type: 'ice-candidate',
                    this.senderid,
                    this.receiverid,
                    {
                        type: "ice-candidate",
                        candidate: candidate
                    }
                );
            }
        };

        // Creates an offer and sends it out through the signaling server
        peerConnection.onnegotiationneeded = () => {
            this.createOffer(this);
        }


        peerConnection.onremovestream = event => {
            console.log('Stream Ended');
        }

        peerConnection.ontrack = event => {
            console.error('-------------------------')
            console.log(event.transceiver.mid);
            console.log(event.streams);
            console.log(event);
            console.error('-------------------------')
            var checkflag = 1;
            for (var i = 0; i < this.commonService.srcRemote.length; i++) {
                if (this.commonService.srcRemote[i].id == event.streams[0].id)
                    checkflag = 0;
            }
            if (checkflag == 1) {
                if (event.transceiver.mid < this.commonService.srcRemote.length) {
                    this.commonService.srcRemote[event.transceiver.mid] = event.streams[0];
                } else {
                    this.commonService.srcRemote.push(event.streams[0]);
                }
            }

            this.commonService.sessionSRCClient.next();
        }

        // peerConnection.ontrack = event => {
        //     console.error('-------------------------')
        //     console.log(event.transceiver.mid);
        //     console.log(event.streams);
        //     console.error('-------------------------')
        //     if (event.transceiver.mid == 0) {
        //       remoteVideo.srcObject = event.streams[0]
        //     }
        //     if (event.transceiver.mid == 1) {
        //       remoteVideo2.srcObject = event.streams[0]
        //     }
        //     if (event.transceiver.mid == 2) {
        //       remoteVideo3.srcObject = event.streams[0]
        //     }
        //   };


        // this.showMe();
        return peerConnection;
    }

    async createOffer(self) {

        if (self.createOfferflag == 1) return;
        else self.createOfferflag = 1;

        console.log(this.senderid + "is creating an offer for" + self.receiverid);
        console.log("peer connection:", self.peerConnection);

        try {
            // 1. Create an offer
            const offer = await self.peerConnection.createOffer();
            // 2. set the offer as local description
            await self.peerConnection.setLocalDescription(offer);
            // Send offer to remote peer
            self.socketService.sendLiveSessionMessage(
                self.senderid,
                self.receiverid,
                {
                    type: 'offer',
                    sdp: self.peerConnection.localDescription,
                }
            );
        } catch (error) {
            console.error(`Error when creating the offer: ${error}`);
            console.log(`Error when creating the offer: ${error}`);
            console.trace('error')
        }
    }


    endPeerConnection() {
        console.log("====================peer connection closed!==================");
        console.log("mediaStream", this.mediaStream);
        //this.peerConnection.removeStream(this.mediaStream);
        //this.peerConnection.close();
        //this.peerConnection = null;

        // console.log("PEER:", this.peerConnection);

        // let tracks = this.mediaStream.getTracks();
        // for (let i = 0; i < tracks.length; i++) {
        //     tracks[i].stop();
        // }
        // // this.peerConnection.close();
        // this.peerConnection.close();
        // this.peerConnection = undefined;

        if (!this.mediaStream) return;

        this.mediaStream.forEach(function (stream) {
            stream = null;
        });

        this.commonService.srcRemote = [];
        this.commonService.srcNative = [];
        this.peerConnection.close();
        this.peerConnection = undefined;
    }

    // showMe() {
    //     navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    //         .then(stream => { this.commonService.srcNative = stream; this.commonService.sessionSRCClient.next(); })
    //         .then(stream => {
    //             this.peerConnection.addStream(stream);
    //             this.localStream = stream;
    //         });
    // }

    async addICECandidate(msg) {
        const candidate = new RTCIceCandidate(msg.msgdata.candidate);
        try {
            await this.peerConnection.addIceCandidate(candidate);
        } catch (error) {
            console.error(error);
        }
    }


    async answerOffer(msg) {
        // We save the reference of the people sending the offer

        console.log(msg.receiverid + "is creating an answer for" + msg.senderid);
        this.senderid = msg.receiverid;
        this.receiverid = msg.senderid;
        // Start the PeerConnection
        console.log('answer');
        this.peerConnection = await this.createPeerConnection();

        // 4. The recipient receives the offer and record it as the remote description
        try {
            await this.peerConnection.setRemoteDescription(msg.msgdata.sdp);
            // 5. The recipient includes its stream to the connection
            await this.getLocalMedia(this.senderid, this.receiverid);
            this.commonService.sessionSRCClient.next();
            // 6. The recipient creates an answer
            const answer = await this.peerConnection.createAnswer();
            // 7. The recipient set the answer as its local description.
            await this.peerConnection.setLocalDescription(answer);
            // 8. The recipient uses the signaling server to send the answer to the caller.
            this.socketService.sendLiveSessionMessage(
                msg.receiverid,
                msg.senderid,
                {
                    type: 'answer',
                    sdp: this.peerConnection.localDescription
                }

            );
        } catch (error) {
            console.error(`Error when creating the answer: ${error}`);
        }
    }


    async getLocalMedia(senderid, receiverid) {
        try {
            var devices = await navigator.mediaDevices.enumerateDevices();
            var realV = []
            for (var i = 0; i < devices.length; i++) {
                var device = devices[i];
                if (device.kind === 'videoinput' && device.label != "screen-capture-recorder") {
                    realV.push(device)
                }
            }
            console.log("realV:", realV);
            if (realV.length < 1) {
                alert("no device!");
                return;
            }

            this.socketService.sendLiveSessionMessage(
                receiverid,
                senderid,
                {
                    type: 'camcount',
                    data: realV.length
                }
            );
            this.commonService.myCamCount = realV.length;

            if (realV.length < 3) {
                var k = realV.length;
                for (var j = 0; j < 3 - k; j++) {
                    realV.push(realV[k - 1]);
                }
            }

            console.log("after realV:", realV);

            this.commonService.srcNative = [];
            this.mediaStream = [];
            for (var i = 0; i < 3; i++) {
                const mediaConstraints = { audio: true, video: { width: 800, height: 600, deviceId: realV[i].deviceId } };
                this.mediaStream.push(await navigator.mediaDevices.getUserMedia(mediaConstraints));
                // await navigator.mediaDevices.getUserMedia(mediaConstraints)
                //     .then(stream => this.mediaStream.push(stream))
                //     .catch(e => console.error(e));
                console.log("number" + i + ":", this.mediaStream);
            }

            for (var i = 0; i < 3; i++) {
                this.mediaStream[i].getTracks().forEach(track => {
                    this.peerConnection.addTrack(track, this.mediaStream[i]);
                });
            }
            this.commonService.srcNative = this.mediaStream;
            this.commonService.sessionSRCClient.next();
            console.log("native video source count:", this.commonService.srcNative.length);
        } catch (error) {
            console.error(error);
        }
    }

    async receiveAnswer(msg) {
        console.log('handling answer ', msg);

        // 9. The caller receives the answer.
        // 10. The caller set the answer as the remote description. It know knows the
        // configuration of both peers. Media begins to flow as configured
        await this.peerConnection.setRemoteDescription(msg.msgdata.sdp);
    }
}


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CommonService {
  actionClient = new Subject<void>();
  sessionSRCClient = new Subject<void>();
  scheduleClient = new Subject<void>();

  constructor() { }
  public navItems = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: 'Account'
    },
    {
      name: 'Profile',
      url: '/profile',
      icon: 'icon-user'
    },
    {
      title: true,
      name: 'Usage'
    },
    {
      name: 'Messages',
      url: '/message',
      icon: 'icon-speech',
      badge: {
        variant: 'info',
        text: ""
      }
    },
    {
      title: true,
      name: 'Session'
    },
    {
      name: 'Schedule',
      url: '/schedule',
      icon: 'icon-calendar',
      badge: {
        variant: 'info',
        text: ""
      }
    }];

  public stations: any[] = [
    {
      id: 100,
      text: 'Fitness',
      children: [
        { id: 101, text: 'Yoga' },
        { id: 102, text: 'Pilates' },
        { id: 103, text: 'Biking' },
        { id: 104, text: 'Boxing' },
        { id: 105, text: 'Zumba' }
      ]
    },
    {
      id: 200,
      text: 'Gaming',
      children: [
        { id: 201, text: 'Fortnite' },
        { id: 202, text: 'PUB-G' },
        { id: 203, text: 'Apex Legends' },
        { id: 204, text: 'Minecraft' },
        { id: 205, text: 'Call of Duty-Black Ops' },
        { id: 206, text: 'Grand Theft Auto' },
        { id: 207, text: 'Overwatch' },
        { id: 208, text: 'Battlefield' },
        { id: 209, text: 'Borderlands' },
        { id: 210, text: 'Danganrompa' },
        { id: 211, text: 'Bioshock' }
      ]
    },
    {
      id: 300,
      text: 'Dance',
      children: [
        { id: 301, text: 'Ballet' },
        { id: 302, text: 'Hip Hop' },
        { id: 303, text: 'Salsa' },
        { id: 304, text: 'Ballroom' },
        { id: 305, text: 'Jazz' }
      ]
    },
    {
      id: 400,
      text: 'Education',
      children: [
        { id: 401, text: 'Math' },
        { id: 402, text: 'Science' },
        { id: 403, text: 'History' },
        { id: 404, text: 'English' },
        { id: 405, text: 'Art' }
      ]
    },
    {
      id: 500,
      text: 'Life Lessons',
      children: [
        { id: 501, text: 'Work' },
        { id: 502, text: 'Friendships' },
        { id: 503, text: 'Fatherhood' },
        { id: 504, text: 'Motherhood' },
        { id: 505, text: 'Mental Health' }
      ]
    },
    {
      id: 600,
      text: 'Home and Garden',
      children: [
        { id: 601, text: 'Cooking' },
        { id: 602, text: 'DIY' },
        { id: 603, text: 'Tile' },
        { id: 604, text: 'Carpet' },
        { id: 605, text: 'Drywall' },
        { id: 606, text: 'Brick' }
      ]
    },
    {
      id: 700,
      text: 'Languages',
      children: [
        { id: 701, text: 'English' },
        { id: 702, text: 'Spanish' },
        { id: 703, text: 'French' },
        { id: 704, text: 'Italian' },
        { id: 705, text: 'German' },
        { id: 706, text: 'Chinese' },
        { id: 707, text: 'Arabic' },
      ]
    }
  ];

  public skills: any[] = [
    {
      id: 100,
      text: 'Fitness',
      children: [
        { id: 101, text: 'Yoga' },
        { id: 102, text: 'Pilates' },
        { id: 103, text: 'Biking' },
        { id: 104, text: 'Boxing' },
        { id: 105, text: 'Zumba' }
      ]
    },
    {
      id: 200,
      text: 'Gaming',
      children: [
        { id: 201, text: 'Fortnite' },
        { id: 202, text: 'PUB-G' },
        { id: 203, text: 'Apex Legends' },
        { id: 204, text: 'Minecraft' },
        { id: 205, text: 'Call of Duty-Black Ops' },
        { id: 206, text: 'Grand Theft Auto' },
        { id: 207, text: 'Overwatch' },
        { id: 208, text: 'Battlefield' },
        { id: 209, text: 'Borderlands' },
        { id: 210, text: 'Danganrompa' },
        { id: 211, text: 'Bioshock' }
      ]
    },
    {
      id: 300,
      text: 'Dance',
      children: [
        { id: 301, text: 'Ballet' },
        { id: 302, text: 'Hip Hop' },
        { id: 303, text: 'Salsa' },
        { id: 304, text: 'Ballroom' },
        { id: 305, text: 'Jazz' }
      ]
    },
    {
      id: 400,
      text: 'Education',
      children: [
        { id: 401, text: 'Math' },
        { id: 402, text: 'Science' },
        { id: 403, text: 'History' },
        { id: 404, text: 'English' },
        { id: 405, text: 'Art' }
      ]
    },
    {
      id: 500,
      text: 'Life Lessons',
      children: [
        { id: 501, text: 'Work' },
        { id: 502, text: 'Friendships' },
        { id: 503, text: 'Fatherhood' },
        { id: 504, text: 'Motherhood' },
        { id: 505, text: 'Mental Health' }
      ]
    },
    {
      id: 600,
      text: 'Home and Garden',
      children: [
        { id: 601, text: 'Cooking' },
        { id: 602, text: 'DIY' },
        { id: 603, text: 'Tile' },
        { id: 604, text: 'Carpet' },
        { id: 605, text: 'Drywall' },
        { id: 606, text: 'Brick' }
      ]
    },
    {
      id: 700,
      text: 'Languages',
      children: [
        { id: 701, text: 'English' },
        { id: 702, text: 'Spanish' },
        { id: 703, text: 'French' },
        { id: 704, text: 'Italian' },
        { id: 705, text: 'German' },
        { id: 706, text: 'Chinese' },
        { id: 707, text: 'Arabic' },
      ]
    }
  ];

  public subjectType: any[] = [
    "Fitness",
    "Gaming",
    "Dance",
    "Education",
    "Life Lessons",
    "Home and Garden",
    "Languages"
  ];

  /////////////////////Provided by Server(Dashboard)/////////////////////
  public registerUsers: any;
  public activeUsers: any;
  public loginUsers: any;
  public presenterList: any = [];

  public activeUserCount: number;
  public availableClassCount: number;
  public loginUserCount: number;
  public registerUserCount: number;

  public currentMode: String = "Observer";
  /////////////////////////////  Chating  ///////////////////////////////
  public contactList: { ids: [], lasts: [] };
  public messageList: any = [];

  public unReadMsgCnt = 0;
  /////////////////////////////  Channels  /////////////////////////////
  public channelList: any = [];
  public channelSearchStation: any = "";
  public channelSearchKeyword: any = "";
  public channelSearchStationId: any;

  public currentShowingChannel: any;

  public clientListener() {
    return this.actionClient.asObservable();
  }

  /////////////////////////// Schedule /////////////////////////////

  public presenterEventList: any = [];
  public schedulePresenter: any;
  public scheduleListener() {
    return this.scheduleClient.asObservable();
  }

  //////////////////////////// Live Session ////////////////////////
  public remoteCamCount: any = 0;
  public myCamCount: any = 0;
  public srcRemote: any = [];
  public srcNative: any = [];
  public isSessionActive: any = false;
  public initialContactId: any;
  public sessionPartnerId: any;
  public sessionRequestFlag: any = 0;    //1: session request accepted, 2: rejected.

  public sessionSRCListener() {
    return this.sessionSRCClient.asObservable();
  }
}

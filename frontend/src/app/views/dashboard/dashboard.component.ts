import { Component, OnInit, SimpleChanges, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { SocketService, CommonService, GlobalService, ChatService, EventService, ChannelService } from '../../services';
import { INgxSelectOption } from 'ngx-select-ex/ngx-select/ngx-select.interfaces';
import { environment } from '../../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('infoModal', { static: false }) public infoModal: ModalDirective;
  @ViewChild('dangerModal', null) helloModal: ModalDirective;

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A'
    }
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public registerUsers: any;
  public activeUsers: any;
  public loginUsers: any;
  public presenterList: any = [];

  public defaultAvatarPath: String;
  public activeUserCount: number;
  public availableClassCount: number;
  public loginUserCount: number;
  public registerUserCount: number;

  public modalShowUser: any;
  public modalShowSchedule: any;

  public currentUser: any;

  public currentSearchStation: any = "";
  public currentKeyword: any = "";

  ////////////////////    Dropdown    ////////////////////
  public items: any[] = [];
  public selectedStationId: any = [];
  public ngxDisabled = false;
  ////////////////////////////////////////////////////////

  constructor(private router: Router, private socketService: SocketService, public commonService: CommonService, private globalService: GlobalService, public chatService: ChatService, public eventService: EventService, public channelService: ChannelService, public ngZone: NgZone) {
    this.items = commonService.stations;
    this.currentKeyword = commonService.channelSearchKeyword;
    this.currentSearchStation = commonService.channelSearchStation;
    this.selectedStationId = commonService.channelSearchStationId;
  }

  ngOnInit(): void {
    // generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }
    this.defaultAvatarPath = environment.USER_AVATAR_PATH;
    this.loadInitialData();
    this.currentUser = this.globalService.getUser();
  }

  subscription: Subscription
  ngAfterViewInit(): void {
    console.log("dashboard init");
    this.subscription = this.commonService.clientListener().subscribe(res => {
      this.ngZone.run(() => {
        this.loadInitialData();
      });
    });
  }

  loadInitialData() {
    this.activeUsers = this.commonService.activeUsers;
    this.activeUserCount = this.commonService.activeUserCount;
    this.loginUsers = this.commonService.loginUsers;
    this.loginUserCount = this.commonService.loginUserCount;
    this.registerUsers = this.commonService.registerUsers;
    this.registerUserCount = this.commonService.registerUserCount;
    this.availableClassCount = this.commonService.availableClassCount;
    this.presenterList = this.commonService.presenterList;
  }
  opendialog(user): void {
    this.modalShowUser = user;
    var i;
    console.log("events:", this.eventService.allEventData);
    this.modalShowSchedule = [];
    for (i = 0; i < this.eventService.allEventData.length; i++) {
      if (this.modalShowUser.userdata._id == this.eventService.allEventData[i].userid) {
        if (new Date() < new Date(this.eventService.allEventData[i].start)) {
          this.modalShowSchedule.push(this.eventService.allEventData[i]);
        }
      }
    }

    var j;
    for (i = 0; i < this.modalShowSchedule.length - 1; i++) {
      for (j = i + 1; j < this.modalShowSchedule.length; j++) {
        if (new Date(this.modalShowSchedule[i].start) > new Date(this.modalShowSchedule[j].start)) {
          var temp = this.modalShowSchedule[i];
          this.modalShowSchedule[i] = this.modalShowSchedule[j];
          this.modalShowSchedule[j] = temp;
        }
      }
    }

    for (i = 0; i < this.modalShowSchedule.length; i++) {
      this.modalShowSchedule[i].start = this.modalShowSchedule[i].start.substring(0, 16);
      this.modalShowSchedule[i].end = this.modalShowSchedule[i].end.substring(0, 16);
    }
    console.log("selected user events:", this.modalShowSchedule);
    //this.modalShowSchedule
    console.log("modal data:", this.modalShowUser);
    this.infoModal.show();
  }

  contactStart(contactid): void {
    this.chatService.addContactRequest(contactid)
      .then(res => {
        console.log(res);
        if (res.success) {

        }
      }).catch(error => {
        console.log(error);
      })
  }


  doSelectStation(option: INgxSelectOption) {
    console.log('MultipleDemoComponent.doSelectOptions', option);
    this.currentSearchStation = option[0].text;
  }

  searchChannel() {
    console.log("search-channel:", this.currentSearchStation, this.currentKeyword);
    this.commonService.channelSearchKeyword = this.currentKeyword;
    this.commonService.channelSearchStation = this.currentSearchStation;
    this.commonService.channelSearchStationId = this.selectedStationId;
    this.channelService.postSearch(this.currentKeyword, this.currentSearchStation)
      .then(res => {
        console.log("success result:", res);
        this.commonService.channelList = res;
        this.router.navigate(['/channellist']);
      }).catch(error => {
        console.log(error);
      })
  }

  createAccount() {
    if(this.currentUser.ismadeprofile == false){
      this.helloModal.show();
    }
    else {
      this.router.navigate(['/channel']);
    }
  }
}


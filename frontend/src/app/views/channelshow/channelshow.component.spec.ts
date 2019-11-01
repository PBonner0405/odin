import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelshowComponent } from './channelshow.component';

describe('ChannelshowComponent', () => {
  let component: ChannelshowComponent;
  let fixture: ComponentFixture<ChannelshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

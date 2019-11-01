import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannellistComponent } from './channellist.component';

describe('ChannellistComponent', () => {
  let component: ChannellistComponent;
  let fixture: ComponentFixture<ChannellistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannellistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannellistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

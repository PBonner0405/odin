import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivesessionComponent } from './livesession.component';

describe('LivesessionComponent', () => {
  let component: LivesessionComponent;
  let fixture: ComponentFixture<LivesessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivesessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivesessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

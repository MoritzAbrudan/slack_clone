import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlackAppComponent } from './slack-app.component';

describe('SlackAppComponent', () => {
  let component: SlackAppComponent;
  let fixture: ComponentFixture<SlackAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlackAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlackAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

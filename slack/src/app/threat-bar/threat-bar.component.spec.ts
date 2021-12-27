import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatBarComponent } from './threat-bar.component';

describe('ThreatBarComponent', () => {
  let component: ThreatBarComponent;
  let fixture: ComponentFixture<ThreatBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreatBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

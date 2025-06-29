import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatsCardComponent } from './dashboard-stats-card.component';

describe('DashboardStatsCardComponent', () => {
  let component: DashboardStatsCardComponent;
  let fixture: ComponentFixture<DashboardStatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

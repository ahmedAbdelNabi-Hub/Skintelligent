import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtientsOverviewChartComponent } from './ptients-overview-chart.component';

describe('PtientsOverviewChartComponent', () => {
  let component: PtientsOverviewChartComponent;
  let fixture: ComponentFixture<PtientsOverviewChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PtientsOverviewChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtientsOverviewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

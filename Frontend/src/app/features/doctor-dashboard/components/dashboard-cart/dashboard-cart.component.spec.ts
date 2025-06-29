import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCartComponent } from './dashboard-cart.component';

describe('DashboardCartComponent', () => {
  let component: DashboardCartComponent;
  let fixture: ComponentFixture<DashboardCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

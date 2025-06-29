import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyDoctorComponent } from './recently-doctor.component';

describe('RecentlyDoctorComponent', () => {
  let component: RecentlyDoctorComponent;
  let fixture: ComponentFixture<RecentlyDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentlyDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

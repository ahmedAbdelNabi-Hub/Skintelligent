import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsTableComponent } from './doctors-table.component';

describe('DoctorsTableComponent', () => {
  let component: DoctorsTableComponent;
  let fixture: ComponentFixture<DoctorsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

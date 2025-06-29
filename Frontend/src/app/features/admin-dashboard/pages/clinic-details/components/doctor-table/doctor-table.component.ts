import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AsyncDataHandler } from '../../../../../../core/models/classes/AsyncDataHandler';
import { Doctor } from '../../../../../../core/types/Doctor';
import { DoctorService } from '../../../../../../core/services/doctor.service';
import { IPaginationParam } from '../../../../../../core/models/interface/IPaginationParam';
import { delay, Subject, takeUntil } from 'rxjs';
import { IPagination } from '../../../../../../core/models/interface/IPagination';
import { IBaseApiResponse } from '../../../../../../core/models/interface/IBaseApiResponse';
import { ClinicService } from '../../../../../../core/services/clinic.service';

@Component({
  selector: 'app-doctor-table',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './doctor-table.component.html',
  styleUrl: './doctor-table.component.scss',
})
export class DoctorTableComponent implements OnInit, OnDestroy {
  _asyncDataHandler = new AsyncDataHandler<IPagination<Doctor>>();
  Doctors = signal<Doctor[]>([]);
  private doctroService = inject(DoctorService);
  private PaginationParam!: IPaginationParam;
  private clinicService = inject(ClinicService);

  constructor() {
    this.PaginationParam = {
      PageIndex: 0,
      pageSize: 8,
    };
  }
  ngOnInit(): void {
    this.getDoctorsWithClinicId();
  }

  getDoctorsWithClinicId(): void {
    const clinicId = this.clinicService.getClinicId();
    this._asyncDataHandler.load(
      this.doctroService.getDoctorsWithClinicId(this.PaginationParam, clinicId)
    );
    this._asyncDataHandler.data$.subscribe((doctor) => {
      this.Doctors.set(doctor?.data!);
      console.log(doctor?.data);
    });
  }
  getAllDoctor(): void {
    this._asyncDataHandler.load(
      this.doctroService.getAllDoctors(this.PaginationParam)
    );
    this._asyncDataHandler.data$.subscribe((doctor) => {
      this.Doctors.set(doctor?.data!);
    });
  }

  ngOnDestroy(): void {
    this._asyncDataHandler.unsubscribe();
  }
}

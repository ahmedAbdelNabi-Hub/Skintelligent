import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorTableComponent } from "./components/doctor-table/doctor-table.component";
import { ClinicService } from '../../../../core/services/clinic.service';
import { fadeAnimation } from '../../../../core/animations/fadeAnimation';

@Component({
  selector: 'app-clinic-details',
  imports: [CommonModule, DoctorTableComponent],
  templateUrl: './clinic-details.component.html',
  styleUrl: './clinic-details.component.scss',
  standalone:true,
  animations:[fadeAnimation]
})
export class ClinicDetailsComponent  implements OnInit{
  private _clinicService = inject(ClinicService);
  activeTab: string = "doctors";
  ngOnInit(): void {
      this.activeTab = "doctors"
  }
  switchTab(tabName: string) {
    this.activeTab = tabName;
  }

  close(): void {
    this._clinicService.HiddenPageClinicDetails()
  }

}

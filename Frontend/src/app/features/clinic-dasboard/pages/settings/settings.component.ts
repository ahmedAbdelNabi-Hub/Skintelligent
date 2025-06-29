import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    MultiSelectModule,
    SliderModule,
    CalendarModule,
    ToggleButtonModule,
  ],
})
export class SettingssComponent implements OnInit {
  settingsForm!: FormGroup;
  daysOfWeek = [
    { label: 'Mon', value: 'Monday' },
    { label: 'Tue', value: 'Tuesday' },
    { label: 'Wed', value: 'Wednesday' },
    { label: 'Thu', value: 'Thursday' },
    { label: 'Fri', value: 'Friday' },
    { label: 'Sat', value: 'Saturday' },
    { label: 'Sun', value: 'Sunday' },
  ];
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.settingsForm = this.fb.group({
      workingDays: [[], Validators.required],
      timeOff: [null],
      maxAppointmentsPerDay: [
        10,
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
      slotDuration: [
        30,
        [Validators.required, Validators.min(5), Validators.max(60)],
      ],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      notifications: [true],
      maxPerHour: [
        5,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      closeBeforeMinutes: [
        15,
        [Validators.required, Validators.min(5), Validators.max(60)],
      ],
    });
  }

  get f() {
    return this.settingsForm.controls;
  }

  saveSettings() {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    // Replace '/api/clinic/settings' with your actual endpoint
    this.http.post('/api/clinic/settings', this.settingsForm.value).subscribe({
      next: () => {
        this.successMessage = 'Settings saved successfully!';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to save settings.';
        this.loading = false;
      },
    });
  }
}

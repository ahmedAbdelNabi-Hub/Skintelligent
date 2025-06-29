import { CommonModule } from '@angular/common';
import { Component, ViewChild, ChangeDetectionStrategy, inject, signal, effect, computed } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { AnalysisService } from '../../../../core/services/analysis.service';
import { AppointmentVolumeData } from '../../../../core/models/interface/IAppointmentVolumeData';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-ptients-overview-chart',
  standalone: true,
  imports: [ChartComponent, CommonModule],
  templateUrl: './ptients-overview-chart.component.html',
  styleUrl: './ptients-overview-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PtientsOverviewChartComponent {
  @ViewChild("chart") chart!: ChartComponent;

  private analysisService = inject(AnalysisService);
  private appointments = signal<AppointmentVolumeData[]>([]);
  private readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public readonly chartOptions = signal<Partial<ChartOptions>>({});

  private readonly patientsPerMonth = computed(() => {
    const map = new Map(this.appointments().map(x => [x.month, x.appointmentCount]));
    return this.months.map((_, i) => map.get(i + 1) ?? Math.floor(Math.random() * 5 + 1));
  });

  constructor() {
    this.analysisService.getCompletedAppointmentsByMonth().subscribe(data => {
      this.appointments.set(data);
    });

    effect(() => {
      this.chartOptions.set(this.createChartOptions(this.patientsPerMonth()));
    });
  }

  private createChartOptions(data: number[]): Partial<ChartOptions> {
    return {
      series: [
        {
          name: "Patients",
          data
        }
      ],
      chart: {
        height: 180,
        type: "bar",
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "40%",
          borderRadiusApplication: 'end',
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -25,
        style: {
          fontSize: "10px",
          colors: ["#eee"]
        },
        background: {
          enabled: true,
          foreColor: 'black',
          padding: 1,
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#bfdbfe',
          opacity: 0.9,
          dropShadow: {
            enabled: false
          }
        },
        formatter: val => val.toString()
      },
      xaxis: {
        categories: this.months,
        position: "bottom",
        labels: {
          style: {
            fontSize: "12px",
            colors: "#666"
          }
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        }
      },
      yaxis: {
        show: false,
        min: 0,
        max: 160,
        tickAmount: 4,
        labels: {
          style: {
            fontSize: "12px",
            colors: "#888"
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      fill: {
        colors: this.months.map((_, i) => i === 7 ? '#3B82F6' : '#D1D5DB') // Aug = blue
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: val => `${val} patients`
        }
      }
    };
  }
}

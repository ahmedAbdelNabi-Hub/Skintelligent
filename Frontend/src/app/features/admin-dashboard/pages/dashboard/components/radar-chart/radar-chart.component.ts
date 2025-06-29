import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexFill
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  colors?: string[];
};

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  standalone: true,
  imports: [ChartComponent, CommonModule],
  styleUrls: ['./radar-chart.component.scss']
})
export class RadarChartComponent implements OnChanges {
  @Input() doctorGrowth: any[] = [];
  @Input() patientGrowth: any[] = [];
  @Input() appointmentVolume: any[] = [];

  public chartOptions: Partial<ChartOptions> = {};

  private readonly months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasGrowthChanges(changes)) {
      this.prepareChart();
    }
  }

  private hasGrowthChanges(changes: SimpleChanges): boolean {
    return ['doctorGrowth', 'patientGrowth', 'appointmentVolume']
      .some(key => key in changes && changes[key].currentValue !== changes[key].previousValue);
  }

  private prepareChart(): void {
    const uniqueMonths = this.getUniqueSortedMonths();

    const labels = uniqueMonths.map(m => `${this.months[m - 1]} - ${m}`);
    const doctorData = this.mapMonthlyData(this.doctorGrowth, 'doctorCount', uniqueMonths);
    const patientData = this.mapMonthlyData(this.patientGrowth, 'patientCount', uniqueMonths);
    const appointmentData = this.mapMonthlyData(this.appointmentVolume, 'appointmentCount', uniqueMonths);

    this.chartOptions = {
      series: [
        { name: "Doctors", data: doctorData },
        { name: "Patients", data: patientData },
        { name: "Appointments", data: appointmentData }
      ],
      chart: { height: 210, type: "area", zoom: { enabled: false } },
      colors: ['#008FFB', '#00E396', '#FEB019'],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.8,
          stops: [0, 90, 100]
        }
      },
      xaxis: { type: "category", categories: labels },
      tooltip: {
        shared: true,
        y: {
          formatter: (val) => `${val}`,
          title: { formatter: (seriesName) => `${seriesName}:` }
        }
      }
    };
  }

  private getUniqueSortedMonths(): number[] {
    const all = [...this.doctorGrowth, ...this.patientGrowth, ...this.appointmentVolume]
      .map(item => item.month)
      .filter((m, i, arr) => m != null && arr.indexOf(m) === i);
    return all.sort((a, b) => a - b);
  }

  private mapMonthlyData(arr: any[], key: string, months: number[]): number[] {
    const map = new Map(arr.map(item => [item.month, item[key]]));
    return months.map(month => map.get(month) ?? 0);
  }
}

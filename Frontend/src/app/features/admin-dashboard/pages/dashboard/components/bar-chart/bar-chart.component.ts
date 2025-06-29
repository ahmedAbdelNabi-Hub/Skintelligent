import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
  selector: 'app-bar-chart',
  imports: [ChartComponent,CommonModule],
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Patients",
          data: [102, 150, 147, 15, 18, 16, 30, 60, 22, 25, 18, 20], // Bar values
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
          borderRadius: 4, // Rounded corners
          columnWidth: "40%", // Adjust bar width
          borderRadiusApplication: 'end', // Ensures rounding applies only to the top

          dataLabels: {
            position: "top"
          },
          colors: {
            ranges: [
              {
                from: 0,
                to: 10,
                color: "#eee" // Green for low values
              },
              {
                from: 10,
                to: 20,
                color: "#eee" // Red for high values
              }
            ]
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -25,
        style: {
          fontSize: "10px",
          colors: ["#eee"] // text-blue-900
        },
        background: {
          enabled: true,
          foreColor: 'black',           // text-blue-900
          padding: 1,
          borderRadius: 3,               // rounded-full
          borderWidth: 1,
          borderColor: '#bfdbfe',         // border-blue-200
          opacity: 0.9,
          dropShadow: {
            enabled: false
          }
        },
        formatter: function (val) {
          return val.toString();
        }
      }
      ,
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        colors: [
          '#D1D5DB', '#D1D5DB', '#D1D5DB', '#D1D5DB',
          '#D1D5DB', '#D1D5DB', '#D1D5DB', '#3B82F6', // Blue (August)
          '#D1D5DB', '#D1D5DB', '#D1D5DB', '#D1D5DB'
        ]
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val) {
            return val + " patients";
          }
        }
      }
    };
  }
}


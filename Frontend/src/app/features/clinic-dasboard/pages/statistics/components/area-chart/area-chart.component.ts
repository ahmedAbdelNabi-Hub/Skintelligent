import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexTheme,
  ApexTitleSubtitle,
  ApexFill
} from "ng-apexcharts";
import { AnalysisService } from "../../../../../../core/services/analysis.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  theme: ApexTheme;
  yaxis: ApexYAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, ChartComponent]
})
export class AreaChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private analysisService: AnalysisService) { }

  ngOnInit() {
    this.analysisService.getAppointmentsPerDay().subscribe((data) => {
      const seriesData = data.map(item => ({
        x: item.date,
        y: item.count
      }));

      this.chartOptions = {
        series: [
          {
            name: "Appointments",
            data: seriesData
          }
        ],
        chart: {
          type: "area",
          height: 280,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          foreColor: '#6B7280', // Tailwind gray-500 for better readability
          animations: {
            enabled: true,
            speed: 600
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: 2
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0,
            stops: [0, 90, 100]
          }
        },
        markers: {
          size: 4,
          colors: ["#3B82F6"], // Tailwind blue-500
          strokeWidth: 2,
          hover: {
            size: 6
          }
        },
        tooltip: {
          enabled: true,
          x: {
            format: "yyyy-MM-dd"
          },
          style: {
            fontSize: '13px'
          }
        },
        theme: {
          palette: "palette1"
        },
        title: {
          align: "left",
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#111827' // Tailwind gray-900
          }
        },
        xaxis: {
          type: "datetime",
          labels: {
            format: "dd MMM",
            style: {
              fontSize: '12px'
            }
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: "Count",
            style: {
              fontSize: '13px'
            }
          },
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        }
      };

    });
  }
}
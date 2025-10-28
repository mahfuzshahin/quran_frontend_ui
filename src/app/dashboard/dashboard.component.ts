import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ChartComponent, NgApexchartsModule} from "ng-apexcharts";
import {ApexOptions} from "apexcharts";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  isSidebarOpen = false;
  public chartOptions: Partial<ApexOptions> = {}; // Use Partial<ApexOptions> to define your settings
  public deptChartOptions: Partial<ApexOptions> = {};
  ngOnInit(): void {
    // 2. Initialize the chartOptions object with data and configuration
    this.chartOptions = {
      series: [ { name: "...", data: [1, 2, 3] } ], // 🛑 MUST HAVE DATA 🛑
      chart: { height: 350, type: "area" },         // 🛑 MUST HAVE height AND type 🛑
      xaxis: { categories: ["A", "B", "C"] }        // 🛑 MUST HAVE X-AXIS LABELS 🛑
    };
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

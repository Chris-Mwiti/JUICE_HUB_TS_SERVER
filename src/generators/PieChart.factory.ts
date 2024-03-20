import { ApexOptions } from "apexcharts";

export interface IPieChart {
  series: number[];
  labels: string[];
}

class PieChartFactory {
  constructor(public values: IPieChart, public options?: ApexOptions) {}

  public construct() {
    return this.options
      ? this.options
      : {
          series: this.values.series,
          options: {
            chart: {
              width: 380,
              type: "pie",
            },
            labels: this.values.labels,
            legend: {
              position: "bottom",
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 320,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
              {
                breakpoint: 1024,
                options: {
                  chart: {
                    width: 340,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
        };
  }
}

export default PieChartFactory

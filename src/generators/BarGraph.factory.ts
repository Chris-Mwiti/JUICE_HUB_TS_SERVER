import { ApexOptions } from "apexcharts";

export interface ISeries {
  name:string;
  series:IBarGraph["formatOfData"][]
}
export interface IBarGraph {
  formatOfData: {
    x: string | number | Date;
    y: number;
  };
  series: ISeries[];
}

class BarGraphFactory {
  constructor(public values: IBarGraph, public options?: ApexOptions) {}

  public construct() {
    switch (typeof this.values.formatOfData.x) {
      case "string":
        return {
          series: this.values.series,
          options: this.options
            ? this.options
            : {
                series: this.values.series,
                options: {
                  chart: {
                    type: "bar",
                    height: 350,
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 4,
                      horizontal: false,
                      dataLabels: {
                        position: "bottom",
                      },
                    },
                  },
                  datalabels: {
                    enabled: true,
                  },
                  xaxis: {
                    type: "category",
                  },
                },
              },
        };
      case "number":
        return {
          series: this.values.series,
          options: this.options
            ? this.options
            : {
                series: this.values.series,
                options: {
                  chart: {
                    type: "bar",
                    height: 350,
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 4,
                      horizontal: false,
                      dataLabels: {
                        position: "bottom",
                      },
                    },
                  },
                  datalabels: {
                    enabled: true,
                  },
                  xaxis: {
                    type: "numeric",
                  },
                },
              },
        };
    }
  }
}

export default BarGraphFactory;

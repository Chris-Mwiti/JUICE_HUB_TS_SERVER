import { ApexOptions } from "apexcharts";

export interface ILineGraph {
    series:{
        name:string,
        data:number[]
    }[],
    categories: string[] | number[] | Date[],
    color:string[],
    title: string,
    xAxisTitle:string,
    yAxisTitle:string
}
class LineGraphFactory {
    constructor(public values:ILineGraph, public options?:ApexOptions){}

    public construct(){
        return {
          series: this.values.series,
          options: this.options
            ? this.options
            : {
                chart: {
                  height: 350,
                  type: "line",
                  zoom: {
                    enabled: false,
                  },
                  toolbar: {
                    show: true,
                  },
                  dropShadow: {
                    enabled: true,
                    color: "#000",
                    top: 20,
                    left: 7,
                    blur: 10,
                    opacity: 0.3,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "smooth",
                  lineCap: "round",
                },
                colors: this.values.color,
                tooltip: {
                  theme: "dark",
                },
                title: {
                  text: this.values.title,
                  align: "left",
                  style: {
                    color: "#ad1ce2",
                  },
                },
                grid: {
                  borderColor: "#f1f9fe",
                },
                xaxis: {
                  categories: this.values.categories,
                  title: {
                    text: this.values.xAxisTitle,
                    style: {
                      color: "#74ffb3",
                    },
                    labels: {
                      style: {
                        colors: "#74ffb3",
                      },
                    },
                    axisBorder: {
                      show: false,
                    },
                  },
                },
                yaxis: {
                  title: {
                    text: this.values.yAxisTitle,
                    style: {
                      color: "#74ffb3",
                    },
                  },
                },
                legend: {
                  position: "top",
                  horizontalAlign: "left",
                  floating: true,
                  offsetY: -25,
                  offsetX: 5,
                },
              },
        };   
    }
}

export default LineGraphFactory
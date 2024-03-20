import { ApexOptions } from "apexcharts";
import BarGraphFactory, { IBarGraph } from "../generators/BarGraph.factory";
import LineGraphFactory, { ILineGraph } from "../generators/LineGraph.factory";
import PieChartFactory, { IPieChart } from "../generators/PieChart.factory";

class GraphController {

    constructor(public options?:ApexOptions){}

    public constructLineGraph(values:ILineGraph){
        return new LineGraphFactory(values,this.options);
    }

    public constructBarGraph(values:IBarGraph){
        return new BarGraphFactory(values,this.options);
    }

    public constructPieChart(values:IPieChart){
        return new PieChartFactory(values,this.options);
    }
}

export default GraphController
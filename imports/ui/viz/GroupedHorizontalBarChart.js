import React, { Component } from "react";
import * as d3 from "d3";
import "./GroupedHorizontalBarChart.css";
export default class StackedBarChart extends Component {
	constructor(props)
	{
		super(props);
	}

	componentDidMount()
	{
		const svg = d3.select(this.svg);

		this.chartWidth = 300;
		this.barHeight = 20;
		this.gapBetweenGroups = 10;
		this.spaceForLabels = 150;
		this.spaceForLegend   = 150;

		this.color =d3.scale.category20();

		
		this.update(this.props);
	}

	componentWillUpdate(newProps)
	{
		this.update(newProps);
	}

	update(props)
	{
		if(!props.data)return;
		d3.selectAll("svg > *").remove();

		let data = props.data;

		this.groupHeight = this.barHeight * data.series.length;

		let zippedData = [];
		for (var i=0; i<data.labels.length; i++) {
			for (var j=0; j<data.series.length; j++) {
				zippedData.push(data.series[j].values[i]);
			}
		}

		let chartHeight = 
			this.barHeight * 
			zippedData.length +
			this.gapBetweenGroups *
			data.labels.length;

		let x = d3.scale.linear()
			.domain([0, d3.max(zippedData)])
			.range([0, this.chartWidth]);

		let y = d3.scale.linear()
			.range([chartHeight + this.gapBetweenGroups, 0]);

		let yAxis = d3.svg.axis()
			.scale(y)
			.tickFormat("")
			.tickSize(0)
			.orient("left");
			

		var chart = d3.select(".chart")
			.attr("width", this.spaceForLabels + this.chartWidth + this.spaceForLegend)
			.attr("height", chartHeight);

			

		// Create bars
		var bar = chart.selectAll("g")
			.data(zippedData)
			.enter().append("g")
			.attr("transform", (d, i) =>{
				let ret = "translate(" + this.spaceForLabels + "," + 
				(i * this.barHeight + this.gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
				return ret;
			});

			

		// Create rectangles of the correct width
		bar.append("rect")
			.attr("fill", (d,i) =>{ return this.color(i % data.series.length); })
			.attr("class", "bar")
			.attr("width", x)
			.attr("height", this.barHeight - 1);

		// Add text label in bar
		bar.append("text")
			.attr("x", function(d) { return x(d) - 3; })
			.attr("y", this.barHeight / 2)
			.attr("fill", "red")
			.attr("dy", ".35em")
			.html(function(d) { return d; });

		//From https://bl.ocks.org/mbostock/1424037
		chart.append("foreignObject")
			.attr("y", 0)
			.attr("x", 0)
			.attr("width", 150)
			.attr("height", 100)
			.append("xhtml:body")
			.style("font", "16px 'Helvetica Neue'")
			.html(function(d,i) {
				if (i % data.series.length === 0)
					return data.labels[Math.floor(i/data.series.length)];
				else
					return "";});

		let p = "translate(" + this.spaceForLabels + ", " + -this.gapBetweenGroups/2 + ")";

		chart.append("g")
			.attr("class", "y axis")
			.attr("transform", p)
			.call(yAxis);

			

		// Draw legend
		let legendRectSize = 18;
		let  legendSpacing  = 4;

		var legend = chart.selectAll(".legend")
			.data(data.series)
			.enter()
			.append("g")
			.attr("transform",  (d, i) =>{
				var height = legendRectSize + legendSpacing;
				var offset = -this.gapBetweenGroups/2;
				var horz = this.spaceForLabels + this.chartWidth + 40 - legendRectSize;
				var vert = i * height - offset;
				let r = "translate(" + horz + "," + vert + ")";

				return r;
			});

		legend.append("rect")
			.attr("width", legendRectSize)
			.attr("height", legendRectSize)
			.style("fill",  (d, i)=>{ return this.color(i); })
			.style("stroke",  (d, i) =>{ return this.color(i); });

		legend.append("text")
			.attr("class", "legend")
			.attr("x", legendRectSize + legendSpacing)
			.attr("y", legendRectSize - legendSpacing)
			.text(function (d) { return d.label; });

	


	}

	render() {
		return (
			<div className="StackedBarChart">
				<svg
					className="chart"
					width="660"
					height="450"
					ref={(svg)=>this.svg=svg}
				></svg>

			</div>
		);
	}
}
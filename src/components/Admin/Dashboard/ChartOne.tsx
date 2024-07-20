"use client";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
	ssr: false,
});

const options: ApexOptions = {
	legend: {
		show: false,
	},
	colors: ["#635BFF"],
	chart: {
		fontFamily: "Satoshi, sans-serif",
		height: 300,
		type: "area",
		dropShadow: {
			enabled: true,
			color: "#623CEA14",
			top: 10,
			blur: 4,
			left: 0,
			opacity: 0.1,
		},

		toolbar: {
			show: false,
		},
	},
	fill: {
		gradient: {
			shade: "light",
			type: "vertical",
			shadeIntensity: 0.1,
			gradientToColors: ["#635BFF"],
			inverseColors: true,
			opacityFrom: 0.3,
			opacityTo: 0,
			stops: [0, 100],
			colorStops: [],
		},
	},
	responsive: [
		{
			breakpoint: 1024,
			options: {
				chart: {
					height: 300,
				},
			},
		},
		{
			breakpoint: 1366,
			options: {
				chart: {
					height: 320,
				},
			},
		},
	],
	stroke: {
		width: [2],
		curve: "smooth",
	},
	// labels: {
	//   show: false,
	//   position: "top",
	// },
	grid: {
		xaxis: {
			lines: {
				show: false,
			},
		},
		yaxis: {
			lines: {
				show: true,
			},
		},
	},
	dataLabels: {
		enabled: false,
	},
	markers: {
		size: 0,
		hover: {
			size: 0,
		},
	},
	xaxis: {
		type: "category",
		categories: [
			"Sep",
			"Oct",
			"Nov",
			"Dec",
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
		],
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
	},
	yaxis: {
		title: {
			style: {
				fontSize: "0px",
			},
		},
		min: 0,
		max: 100,
	},
};

interface ChartOneState {
	series: {
		name: string;
		data: number[];
	}[];
}

const ChartOne: React.FC = () => {
	const [state, setState] = useState<ChartOneState>({
		series: [
			{
				name: "Product One",
				data: [23, 11, 22, 27, 53, 62, 37, 41, 54, 72, 63, 85],
			},
		],
	});

	const handleReset = () => {
		setState((prevState) => ({
			...prevState,
		}));
	};

	handleReset;

	return (
		<div id='chartOne' className='-ml-5'>
			<ReactApexChart
				options={options}
				series={state.series}
				type='area'
				height={300}
			/>
		</div>
	);
};

export default ChartOne;

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ReusableChart = ({ chartType, title, xAxisCategories, seriesData }) => {
  const chartOptions = {
    chart: {
      type: chartType, // Use the chart type passed as a prop
    },
    title: {
      text: title, // Use the title passed as a prop
    },
    xAxis: {
      categories: xAxisCategories, // Use the categories passed as a prop
      title: {
        text: 'Year',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: chartType === 'pie' ? 'Percentage' : 'Amount ($)', // Dynamically change based on chart type
      },
    },
    plotOptions: chartType === 'pie' ? {
      pie: {
        innerSize: '50%',
        dataLabels: {
          enabled: true,
        },
      },
    } : {},
    credits: {
      enabled: false, // Disable Highcharts branding
    },
    series: seriesData, // Use the series data passed as a prop
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default ReusableChart;

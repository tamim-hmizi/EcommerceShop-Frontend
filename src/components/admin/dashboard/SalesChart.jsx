import React from 'react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions } from './chartOptions';

const SalesChart = ({ salesData }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-800">Sales Trend</h3>
        <div className="text-sm text-gray-500">Last 7 days</div>
      </div>
      <div className="h-80">
        <Line data={salesData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default SalesChart;

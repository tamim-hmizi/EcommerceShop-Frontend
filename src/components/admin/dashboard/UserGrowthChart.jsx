import React from 'react';
import { Bar } from 'react-chartjs-2';
import { lineChartOptions } from './chartOptions';

const UserGrowthChart = ({ userGrowthData }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-800">User Growth</h3>
        <div className="text-sm text-gray-500">Last 6 months</div>
      </div>
      <div className="h-80">
        <Bar data={userGrowthData} options={lineChartOptions} />
      </div>
    </div>
  );
};

export default UserGrowthChart;

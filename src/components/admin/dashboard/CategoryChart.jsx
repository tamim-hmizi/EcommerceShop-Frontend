import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { doughnutOptions } from './chartOptions';

const CategoryChart = ({ categoryData, totalCategories }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-800">Product Categories</h3>
        <div className="text-sm text-gray-500">Total: {totalCategories}</div>
      </div>
      <div className="h-80 flex items-center justify-center">
        <Doughnut data={categoryData} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default CategoryChart;

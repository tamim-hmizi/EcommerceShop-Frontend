import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { doughnutOptions } from './chartOptions';

const OrderStatusChart = ({ orderStatusData, stats }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-800">Order Status</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
            <span className="text-xs text-gray-500">Pending: {stats.pendingOrders}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>
            <span className="text-xs text-gray-500">Processing: {stats.processingOrders}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></span>
            <span className="text-xs text-gray-500">Delivered: {stats.deliveredOrders}</span>
          </div>
        </div>
      </div>
      <div className="h-80 flex items-center justify-center">
        <Doughnut data={orderStatusData} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default OrderStatusChart;

import React from 'react';
import { FiActivity, FiPackage, FiClock } from "react-icons/fi";

const PerformanceMetrics = ({ avgOrderValue, totalStock }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-medium text-gray-800 mb-6">Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg mr-4">
            <FiActivity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Order Value</p>
            <p className="font-bold text-gray-800">
              ${avgOrderValue.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg mr-4">
            <FiPackage className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Stock</p>
            <p className="font-bold text-gray-800">
              {totalStock.toLocaleString()} units
            </p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg mr-4">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Processing Time</p>
            <p className="font-bold text-gray-800">2.5 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;

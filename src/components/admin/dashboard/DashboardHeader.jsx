import React from 'react';
import { FiRefreshCw } from "react-icons/fi";
import TimeFilter from './TimeFilter';

const DashboardHeader = ({ userName, timeFilter, onTimeFilterChange, onRefresh, refreshing }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {userName || 'Admin'}!</p>
      </div>

      <div className="flex items-center gap-4">
        <TimeFilter
          currentFilter={timeFilter}
          onChange={onTimeFilterChange}
        />

        <button
          onClick={onRefresh}
          className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-indigo-600"
          disabled={refreshing}
        >
          <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

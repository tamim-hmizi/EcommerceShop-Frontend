import React from 'react';
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const StatsCard = ({ icon, title, value, change, isCurrency = false, color = 'indigo' }) => {
  const isPositive = change >= 0;
  const formattedValue = isCurrency
    ? `$${value.toLocaleString()}`
    : value.toLocaleString();

  // Color variants
  const colorVariants = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`bg-gradient-to-r ${colorVariants[color]} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
          <div className={`flex items-center ${isPositive ? 'text-green-300' : 'text-red-300'} text-sm font-medium`}>
            {isPositive ? (
              <FiArrowUp className="mr-1 h-4 w-4" />
            ) : (
              <FiArrowDown className="mr-1 h-4 w-4" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <h3 className="mt-2 text-white/90 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-1 text-white">{formattedValue}</p>
      </div>
    </div>
  );
};

export default StatsCard;

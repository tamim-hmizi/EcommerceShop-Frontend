import React from 'react';

const TimeFilter = ({ currentFilter, onChange }) => {
  const filters = [
    { id: 'all', label: 'All Time' },
    { id: 'year', label: 'Year' },
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'today', label: 'Today' }
  ];

  return (
    <div className="flex space-x-2 text-sm">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            currentFilter === filter.id
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;

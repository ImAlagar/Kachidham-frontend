import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'NEW':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          darkBg: 'bg-blue-900',
          darkText: 'text-blue-200',
          label: 'New'
        };
      case 'CONTACTED':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          darkBg: 'bg-yellow-900',
          darkText: 'text-yellow-200',
          label: 'Contacted'
        };
      case 'FOLLOW_UP':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          darkBg: 'bg-orange-900',
          darkText: 'text-orange-200',
          label: 'Follow Up'
        };
      case 'CONVERTED':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          darkBg: 'bg-green-900',
          darkText: 'text-green-200',
          label: 'Converted'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          darkBg: 'bg-red-900',
          darkText: 'text-red-200',
          label: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          darkBg: 'bg-gray-900',
          darkText: 'text-gray-200',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center ${sizeClasses} rounded-full font-medium ${config.bg} ${config.text} dark:${config.darkBg} dark:${config.darkText}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
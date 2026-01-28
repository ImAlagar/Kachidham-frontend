// components/admin/stats/DiscountStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  FiPercent,
  FiTag,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const DiscountStats = ({ stats }) => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const statCards = [
    {
      title: 'Total Discounts',
      value: stats.total || 0,
      icon: <FiTag className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Discounts',
      value: stats.active || 0,
      icon: <FiCheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Expired Discounts',
      value: stats.expired || 0,
      icon: <FiXCircle className="w-6 h-6" />,
      color: 'bg-red-500',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Total Usage',
      value: stats.usage || 0,
      icon: <FiUsers className="w-6 h-6" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Total Discount Amount',
      value: `₹${stats.amount?.toLocaleString() || 0}`,
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    }
  ];


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          variants={fadeIn}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <div className="text-white">
                {stat.icon}
              </div>
            </div>
          </div>

          {/* Progress bar for usage stats */}
          {stat.title === 'Active Discounts' && stats.totalDiscounts > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Active Rate</span>
                <span>{Math.round((stats.activeDiscounts / stats.totalDiscounts) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.activeDiscounts / stats.totalDiscounts) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DiscountStats;
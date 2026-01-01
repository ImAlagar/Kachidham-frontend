// components/admin/stats/FaqStats.jsx
import React from 'react';
import { HelpCircle, CheckCircle, XCircle, TrendingUp, Folder, BarChart3 } from 'lucide-react';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';

const FaqStats = ({ stats = {} }) => {
  const {
    totalFaqs = 0,
    activeFaqs = 0,
    inactiveFaqs = 0,
    faqsByCategory = []
  } = stats;

  const faqStatsData = [
    {
      title: "Total FAQs",
      value: totalFaqs,
      change: 12,
      icon: HelpCircle,
      color: "blue",
      description: "In system",
      trend: "up"
    },
    {
      title: "Active FAQs",
      value: activeFaqs,
      change: 8,
      icon: CheckCircle,
      color: "green",
      description: "Currently visible",
      trend: "up"
    },
    {
      title: "Inactive FAQs",
      value: inactiveFaqs,
      change: -4,
      icon: XCircle,
      color: "red",
      description: "Hidden from users",
      trend: "down"
    },
    {
      title: "Categories",
      value: faqsByCategory?.length || 0,
      change: 2,
      icon: Folder,
      color: "purple",
      description: "Active categories",
      trend: "up"
    }
  ];

  return (
    <StatsGrid columns={{ base: 1, sm: 2, lg: 4 }}>
      {faqStatsData.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
        />
      ))}
    </StatsGrid>
  );
};

export default FaqStats;
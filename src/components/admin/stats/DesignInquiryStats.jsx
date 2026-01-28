import React from 'react';
import { Calendar, Users, Phone, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import StatsGrid from '../../../shared/StatsGrid';
import StatCard from '../../../shared/StatCard';

const DesignInquiryStats = ({ stats = {} }) => {
  const {
    totalInquiries = 0,
    newInquiries = 0,
    contactedInquiries = 0,
    convertedInquiries = 0,
    conversionRate = 0,
  } = stats;

  // Format conversion rate to 2 decimal places
  const formattedConversionRate = conversionRate ? 
    parseFloat(conversionRate).toFixed(2) : 
    '0.00';

  const inquiryStatsData = [
    {
      title: "Total Inquiries",
      value: totalInquiries,
      change: 12,
      icon: Users,
      color: "blue",
      description: "All inquiries",
      trend: "up"
    },
    {
      title: "New Inquiries",
      value: newInquiries,
      change: 8,
      icon: Calendar,
      color: "orange",
      description: "Pending contact",
      trend: "up"
    },
    {
      title: "Contacted",
      value: contactedInquiries,
      change: 15,
      icon: Phone,
      color: "green",
      description: "In progress",
      trend: "up"
    },
    {
      title: "Converted",
      value: convertedInquiries,
      change: parseFloat(formattedConversionRate), // Use the formatted value for change
      icon: CheckCircle,
      color: "purple",
      description: `${formattedConversionRate}% conversion`,
      trend: parseFloat(formattedConversionRate) > 0 ? "up" : "neutral"
    }
  ];

  return (
    <StatsGrid columns={{ base: 1, sm: 2, lg: 4 }}>
      {inquiryStatsData.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
        />
      ))}
    </StatsGrid>
  );
};

export default DesignInquiryStats;
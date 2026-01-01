import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import HeroSlider from '../../components/HomeComponents/HeroSlider';

import CTASection from '../../components/HomeComponents/CTASection';
import OfferBanner from '../../components/HomeComponents/OfferBanner';
import CollectionsBanner from '../../components/HomeComponents/CollectionsBanner';
import TrendingCollections from '../../components/HomeComponents/TrendingCollections';
import BestSellingProducts from '../../components/HomeComponents/BestSellingProducts';
import CategoryCards from '../../components/HomeComponents/CategoryCards';

const Home = () => {
  const { theme } = useTheme();
  
  const bgGradient = theme === 'dark' 
    ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-b from-purple-50 via-white to-pink-50';

  return (
    <div className={`min-h-screen ${bgGradient} transition-colors duration-500 overflow-hidden`}>
      <HeroSlider />
      <CategoryCards />
      <OfferBanner />   
      <TrendingCollections />
      <CollectionsBanner />
      <BestSellingProducts />
      <CTASection />
    </div>
  );
};

export default Home;
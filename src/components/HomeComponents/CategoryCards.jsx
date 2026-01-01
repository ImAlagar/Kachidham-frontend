import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Star, Sparkles, Crown, Bed, ShoppingBag, Zap, Heart, TrendingUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import AnimatedIcon from "../../components/Common/AnimatedIcon";
import { useGetAllCategoriesQuery } from "../../redux/services/categoryService";
import { useNavigate } from "react-router-dom";

const CategoryCards = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Fetch categories from API
  const { 
    data: apiResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetAllCategoriesQuery({ limit: 8, status: 'ACTIVE' });
  
  const categories = apiResponse?.data?.categories || [];
  
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const bgColor = theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/80';
  const shadow = theme === 'dark' ? 'shadow-lg shadow-purple-900/20' : 'shadow-xl';
  const borderColor = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50';

  // Predefined category icons and colors for fallback
  const categoryConfigs = [
    { icon: Moon, color: "purple", gradient: "from-purple-500/10 to-pink-500/10", animation: "float" },
    { icon: Bed, color: "blue", gradient: "from-blue-500/10 to-indigo-500/10", animation: "pulse" },
    { icon: Sparkles, color: "amber", gradient: "from-amber-500/10 to-orange-500/10", animation: "glow" },
    { icon: Crown, color: "pink", gradient: "from-pink-500/10 to-rose-500/10", animation: "shimmer" },
    { icon: ShoppingBag, color: "emerald", gradient: "from-emerald-500/10 to-teal-500/10", animation: "bounce" },
    { icon: Zap, color: "orange", gradient: "from-orange-500/10 to-red-500/10", animation: "flash" },
    { icon: Heart, color: "rose", gradient: "from-rose-500/10 to-pink-500/10", animation: "pulse" },
    { icon: TrendingUp, color: "indigo", gradient: "from-indigo-500/10 to-purple-500/10", animation: "shimmer" },
  ];

  // Get category configuration based on category name or index
  const getCategoryConfig = (category, index) => {
    const configIndex = index % categoryConfigs.length;
    const config = categoryConfigs[configIndex];
    
    // Special cases based on category name
    if (category.name?.toLowerCase().includes('winter')) {
      return { ...categoryConfigs[1], icon: Sparkles, color: "blue" };
    }
    if (category.name?.toLowerCase().includes('kids') || category.name?.toLowerCase().includes('teen')) {
      return { ...categoryConfigs[5], icon: Heart, color: "pink" };
    }
    if (category.name?.toLowerCase().includes('robe') || category.name?.toLowerCase().includes('inner')) {
      return { ...categoryConfigs[3], icon: Crown, color: "purple" };
    }
    if (category.name?.toLowerCase().includes('night suit')) {
      return { ...categoryConfigs[2], icon: Bed, color: "amber" };
    }
    if (category.name?.toLowerCase().includes('night')) {
      return { ...categoryConfigs[0], icon: Moon, color: "indigo" };
    }
    
    return config;
  };

  // Get border color based on theme and color
  const getBorderColor = (color, theme) => {
    const borderColors = {
      purple: theme === 'dark' ? 'border-purple-700' : 'border-purple-300',
      blue: theme === 'dark' ? 'border-blue-700' : 'border-blue-300',
      amber: theme === 'dark' ? 'border-amber-700' : 'border-amber-300',
      pink: theme === 'dark' ? 'border-pink-700' : 'border-pink-300',
      emerald: theme === 'dark' ? 'border-emerald-700' : 'border-emerald-300',
      orange: theme === 'dark' ? 'border-orange-700' : 'border-orange-300',
      rose: theme === 'dark' ? 'border-rose-700' : 'border-rose-300',
      indigo: theme === 'dark' ? 'border-indigo-700' : 'border-indigo-300',
    };
    return borderColors[color] || borderColors.purple;
  };

  // Get button gradient based on color
  const getButtonGradient = (color) => {
    const gradients = {
      purple: 'from-purple-500 to-pink-500',
      blue: 'from-blue-500 to-indigo-500',
      amber: 'from-amber-500 to-orange-500',
      pink: 'from-pink-500 to-rose-500',
      emerald: 'from-emerald-500 to-teal-500',
      orange: 'from-orange-500 to-red-500',
      rose: 'from-rose-500 to-pink-500',
      indigo: 'from-indigo-500 to-purple-500',
    };
    return gradients[color] || gradients.purple;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

    const getCategorySlug = (categoryName) => {
    // Convert to lowercase and replace spaces with hyphens
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };
  // Handle category click
  const handleCategoryClick = (category) => {
    navigate(`/shop/${getCategorySlug(category.name)}`);
  };

  // Handle view all click
  const handleViewAllClick = () => {
    navigate('/shop');
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="w-full py-16 lg:py-20 bg-gradient-to-b from-white/50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="animate-pulse h-12 w-64 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="animate-pulse h-6 w-96 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse h-[400px] bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (isError) {
    console.error('Error fetching categories:', error);
    return (
      <section className="w-full py-16 lg:py-20 bg-gradient-to-b from-white/50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/10">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p className="text-red-500 text-lg mb-4">Failed to load categories</p>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </section>
    );
  }

  // Show empty state
  if (categories.length === 0) {
    return (
      <section className="w-full py-16 lg:py-20 bg-gradient-to-b from-white/50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/10">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-lg">No categories available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 xl:px-6 lg:py-20 bg-gradient-to-b from-white/50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/10">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="mb-4">
            <span className="text-sm font-medium text-purple-500 dark:text-purple-400 tracking-wider">
              SHOP BY CATEGORY
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-4`}>
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Collections
            </span>
          </h2>
          
          <p className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
            Browse through our exclusive categories to find your perfect nightwear
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {categories.map((category, index) => {
            const config = getCategoryConfig(category, index);
            const borderColor = getBorderColor(config.color, theme);
            const buttonGradient = getButtonGradient(config.color);
            
            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ 
                  rotate: 0, 
                  scale: 1.03,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                style={{ rotate: index % 2 === 0 ? -3 : 3 }}
                className="relative group cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {/* Single Border */}
                <div className={`absolute -inset-1 rounded-2xl border-2 ${borderColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Main Card */}
                <div className={`relative rounded-xl ${bgColor} backdrop-blur-sm ${shadow} overflow-hidden border ${borderColor}/30`}>
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-[280px] object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Icon Overlay */}
                    <div className="absolute top-4 right-4">
                      <AnimatedIcon 
                        icon={config.icon}
                        animation={config.animation}
                        className={`w-8 h-8 ${config.iconColor || `text-${config.color}-500`} bg-white/80 dark:bg-gray-800/80 p-2 rounded-full`}
                      />
                    </div>
                    
                    {/* Product Count Badge */}
                    {category._count?.products > 0 && (
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-bold text-gray-800 dark:text-gray-200 rounded-full uppercase tracking-wider">
                          {category._count.products} Products
                        </span>
                      </div>
                    )}
                    
                    {/* Active Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                        category.isActive 
                          ? 'bg-green-500/20 text-green-700 dark:text-green-400' 
                          : 'bg-red-500/20 text-red-700 dark:text-red-400'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`text-xl font-bold ${textPrimary} mb-2 truncate`}>
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className={`text-sm ${textSecondary} mb-4 line-clamp-2`}>
                        {category.description}
                      </p>
                    )}
                    
                    {/* Subcategory Count */}
                    {category._count?.subcategories > 0 && (
                      <div className="mb-4">
                        <p className={`text-xs ${textSecondary}`}>
                          {category._count.subcategories} subcategories
                        </p>
                      </div>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 rounded-lg bg-gradient-to-r ${buttonGradient} text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category);
                      }}
                    >
                      Shop Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 lg:mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewAllClick}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              View All Categories
            </motion.button>
            
            <p className={`text-sm ${textSecondary} mt-4`}>
              Explore our complete collection of {categories.length}+ categories
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoryCards;
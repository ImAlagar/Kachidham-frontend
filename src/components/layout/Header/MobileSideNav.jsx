import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronRight, 
  FiChevronDown,
  FiUser, 
  FiHeart, 
  FiShoppingBag, 
  FiHelpCircle,
  FiStar,
  FiPackage,
  FiLogOut,
  FiHome,
  FiPercent,
  FiFilter,
  FiGrid,
  FiChevronLeft
} from 'react-icons/fi';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import LoadingSpinner from '../../../components/Common/LoadingSpinner';
import { useGetAllCategoriesQuery } from '../../../redux/services/categoryService';

const MobileSideNav = ({
  theme,
  menuOpen,
  shopOpen,
  toggleShop,
  location,
  navigate,
  isLoggedIn,
  user,
  handleLinkClick,
  handleOrdersClick,
  handleLoginClick,
  handleLogout,
  toggleTheme,
  setSearchOpen,
  setMenuOpen,
  getUserDisplayName,
  wishlistCount
}) => {
  const [expandedSections, setExpandedSections] = useState({
    shop: false,
    categories: false,
    size: false,
    account: false
  });

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery({
    page: 1,
    limit: 20,
    status: 'ACTIVE'
  });

  // Extract categories from API response
  const categories = categoriesData?.data?.categories || [];

  // Function to convert category name to URL slug
  const getCategorySlug = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // Navigation categories (same as DesktopNav)
  const shopCategories = [
    { label: 'All Nightwear', path: '/shop', icon: '🛏️' },
    { label: 'Pajama Sets', path: '/shop/pajama-sets', icon: '👚' },
    { label: 'Nightgowns', path: '/shop/nightgowns', icon: '👗' },
    { label: 'Nightshirts', path: '/shop/nightshirts', icon: '👕' },
    { label: 'Robes', path: '/shop/robes', icon: '🧥' },
    { label: 'Sleep Masks', path: '/shop/sleep-masks', icon: '😴' },
  ];

  // Size categories with icons (same as DesktopNav)
  const sizeCategories = [
    { 
      label: 'Medium (M)', 
      path: '/shop?size=M', 
      icon: 'M',
      description: 'Bust: 34-36", Waist: 28-30"',
      range: 'Size 8-10',
      popular: true
    },
    { 
      label: 'Large (L)', 
      path: '/shop?size=L', 
      icon: 'L',
      description: 'Bust: 36-38", Waist: 30-32"',
      range: 'Size 12-14'
    },
    { 
      label: 'Extra Large (XL)', 
      path: '/shop?size=XL', 
      icon: 'XL',
      description: 'Bust: 38-40", Waist: 32-34"',
      range: 'Size 16-18'
    },
    { 
      label: '2XL', 
      path: '/shop?size=2XL', 
      icon: '2XL',
      description: 'Bust: 40-42", Waist: 34-36"',
      range: 'Size 20-22'
    },
    { 
      label: '3XL & Plus', 
      path: '/shop?size=3XL', 
      icon: '3XL+',
      description: 'Bust: 42"+',
      range: 'Size 24+'
    },
    { 
      label: 'Size Guide', 
      path: '/size-guide', 
      icon: '📏',
      special: true
    },
  ];

  const mainMenuItems = [
    { label: 'Home', path: '/', icon: <FiHome className="text-lg" /> },
    { label: 'About', path: '/about-us', icon: <FiHelpCircle className="text-lg" /> },
    { label: 'Contact', path: '/contact', icon: <FiHelpCircle className="text-lg" /> },
  ];

  const accountMenuItems = [
    { label: 'My Orders', path: '/user/orders', icon: <FiPackage className="text-lg" /> },
    { label: 'Wishlist', path: '/wishlist', icon: <FiHeart className="text-lg" /> },
    { label: 'Reviews', path: '/user/reviews', icon: <FiStar className="text-lg" /> },
  ];

  // Same isActive function as DesktopNav
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    
    // Check for shop routes - matches both /shop and /shop/*
    if (path === '/shop' || path === '/shop/all') {
      return location.pathname === '/shop' || 
             location.pathname.startsWith('/shop/');
    }
    
    // For specific shop categories (path parameters)
    if (path.startsWith('/shop/')) {
      return location.pathname === path;
    }
    
    if (path === '/size-guide' && location.pathname === '/size-guide') return true;
    if (path.startsWith('/user/') && location.pathname.startsWith('/user/')) return true;
    if (path === '/wishlist' && location.pathname === '/wishlist') return true;
    
    // For other pages
    return location.pathname === path;
  };

  // Check if current path is shop with specific size filter
  const isSizeFilterActive = (size) => {
    if (location.pathname === '/shop') {
      const params = new URLSearchParams(location.search);
      const sizeParam = params.get('size');
      if (sizeParam) {
        const sizes = sizeParam.split(',');
        return sizes.includes(size);
      }
    }
    return false;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
    handleLinkClick();
    setExpandedSections({
      shop: false,
      categories: false,
      size: false,
      account: false
    });
  };

  // Function to get category icon based on category name
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'pajama-sets': '👚',
      'nightgowns': '👗',
      'nightshirts': '👕',
      'robes': '🧥',
      'sleep-masks': '😴',
      'nighties': '👚',
      'nightwear': '🛏️',
      'winter': '❄️',
      'summer': '☀️',
      'default': '🎽'
    };
    
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('pajama') || lowerName.includes('pyjama') || lowerName.includes('nightie')) return iconMap['pajama-sets'];
    if (lowerName.includes('gown')) return iconMap['nightgowns'];
    if (lowerName.includes('shirt')) return iconMap['nightshirts'];
    if (lowerName.includes('robe')) return iconMap['robes'];
    if (lowerName.includes('mask')) return iconMap['sleep-masks'];
    if (lowerName.includes('winter')) return iconMap['winter'];
    if (lowerName.includes('summer')) return iconMap['summer'];
    if (lowerName.includes('nightwear')) return iconMap['nightwear'];
    
    return iconMap['default'];
  };

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    },
    exit: { 
      x: '100%',
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed top-0 right-0 h-screen w-80 max-w-[90vw] z-[60] flex flex-col shadow-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                : 'bg-gradient-to-b from-white to-gray-50'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className={`font-heading text-xl ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                 kachidham Fashions
                </h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  ✕
                </button>
              </div>
              
              {/* User Info */}
              <div className="mt-6 flex items-center space-x-3">
                <div className={`p-3 rounded-full ${
                  theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <FiUser className={`text-lg ${
                    theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`font-ui font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getUserDisplayName()}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {isLoggedIn ? 'Welcome back!' : 'Welcome, guest!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4">
              {/* Theme Toggle */}
              <div className={`px-6 py-3 mx-4 rounded-lg mb-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full"
                >
                  <span className={`font-ui text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <div className={`p-2 rounded-full ${
                    theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
                  }`}>
                    {theme === 'dark' ? (
                      <MdDarkMode className="text-purple-400 text-lg" />
                    ) : (
                      <MdLightMode className="text-purple-600 text-lg" />
                    )}
                  </div>
                </button>
              </div>

              {/* Main Menu Items */}
              <div className="px-4 mb-6">
                <h3 className={`font-ui text-xs uppercase tracking-wider mb-3 px-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Navigation
                </h3>
                <div className="space-y-1">
                  {mainMenuItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      variants={itemVariants}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                        theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                      } ${isActive(item.path) ? 
                        (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
                        : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="font-ui text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                      <FiChevronRight className={`text-sm ${
                        isActive(item.path) ? 
                          (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
                          : 'text-gray-400'
                      }`} />
                    </motion.button>
                  ))}
                </div>
              </div>



              {/* Categories Dropdown - FETCHED FROM API */}
              <div className="px-4 mb-6">
                <button
                  onClick={() => toggleSection('categories')}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  } ${expandedSections.categories || location.pathname.startsWith('/shop/') ? 
                    (theme === 'dark' ? 'bg-gray-800 text-purple-300' : 'bg-gray-100 text-purple-600') 
                    : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <FiGrid className="text-lg" />
                    <span className="font-ui text-sm font-medium">Categories</span>
                  </div>
                  <FiChevronRight className={`transition-transform duration-300 ${
                    expandedSections.categories ? 'rotate-90 text-purple-500' : 'text-gray-400'
                  }`} />
                </button>

                <AnimatePresence>
                  {expandedSections.categories && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-8 pt-2 space-y-1">
                        {/* All Categories Option */}
                        <button
                          onClick={() => handleNavigation('/shop')}
                          className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all duration-300 ${
                            theme === 'dark'
                              ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          } ${isActive('/shop') ? 
                            (theme === 'dark' ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-50 text-purple-600') 
                            : ''}`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-base">🛍️</span>
                            <span className="font-medium">All Categories</span>
                          </div>
                          <FiChevronRight className={`text-sm ${
                            isActive('/shop') ? 
                              (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
                              : 'text-gray-400'
                          }`} />
                        </button>

                        {/* Categories from API */}
                        {categoriesLoading ? (
                          <div className="flex justify-center items-center py-4">
                            <LoadingSpinner size="sm" />
                          </div>
                        ) : categories.length > 0 ? (
                          categories.map((category) => {
                            const categorySlug = getCategorySlug(category.name);
                            const categoryPath = `/shop/${categorySlug}`;
                            
                            return (
                              <button
                                key={category._id || category.id}
                                onClick={() => handleNavigation(categoryPath)}
                                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all duration-300 ${
                                  theme === 'dark'
                                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                } ${isActive(categoryPath) ? 
                                  (theme === 'dark' ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-50 text-purple-600') 
                                  : ''}`}
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-base">
                                    {category.icon || getCategoryIcon(category.name)}
                                  </span>
                                  <span className="font-medium">{category.name}</span>
                                </div>
                                <FiChevronRight className={`text-sm ${
                                  isActive(categoryPath) ? 
                                    (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
                                    : 'text-gray-400'
                                }`} />
                              </button>
                            );
                          })
                        ) : (
                          <div className={`text-center py-4 px-3 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <p className="text-sm">No categories found</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* By Size Dropdown */}
              <div className="px-4 mb-6">
                <button
                  onClick={() => toggleSection('size')}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  } ${expandedSections.size || (location.pathname === '/shop' && location.search.includes('size=')) ? 
                    (theme === 'dark' ? 'bg-gray-800 text-purple-300' : 'bg-gray-100 text-purple-600') 
                    : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <FiFilter className="text-lg" />
                    <span className="font-ui text-sm font-medium">By Size</span>
                  </div>
                  <FiChevronRight className={`transition-transform duration-300 ${
                    expandedSections.size ? 'rotate-90 text-purple-500' : 'text-gray-400'
                  }`} />
                </button>

                <AnimatePresence>
                  {expandedSections.size && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-2 space-y-1">
                        {/* Size Grid Header */}
                        <div className="px-4 mb-3">
                          <h3 className={`font-ui font-medium text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Filter by Size
                          </h3>
                          <p className={`text-xs mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Find your perfect fit
                          </p>
                        </div>

                        {/* Size Grid */}
                        <div className="grid grid-cols-3 gap-2 px-4 mb-4">
                          {sizeCategories.slice(0, 5).map((item) => (
                            <button
                              key={item.label}
                              onClick={() => handleNavigation(item.path)}
                              className={`group relative p-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-800 border-gray-800'
                                  : 'hover:bg-gray-50 border-gray-200'
                              } border ${isSizeFilterActive(item.icon) ? 
                                (theme === 'dark' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200') 
                                : ''}`}
                            >
                              {/* Size Badge */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 text-base font-bold transition-all duration-200 ${
                                isSizeFilterActive(item.icon)
                                  ? (theme === 'dark' 
                                      ? 'bg-purple-600 text-white' 
                                      : 'bg-purple-500 text-white')
                                  : (theme === 'dark' 
                                      ? 'bg-gray-800 text-gray-300 group-hover:bg-gray-700' 
                                      : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200')
                              }`}>
                                {item.icon}
                              </div>
                              
                              {/* Size Label */}
                              <span className={`text-xs font-medium mb-0.5 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {item.label.split(' ')[0]}
                              </span>
                              
                              {/* Size Range */}
                              <span className={`text-[10px] ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {item.range}
                              </span>
                              
                              {/* Popular Badge */}
                              {item.popular && (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] bg-green-500 text-white rounded-full">
                                  Popular
                                </span>
                              )}
                              
                              {/* Active Indicator */}
                              {isSizeFilterActive(item.icon) && (
                                <div className={`absolute bottom-0.5 w-5 h-0.5 rounded-full ${
                                  theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                                }`} />
                              )}
                            </button>
                          ))}
                          
                          {/* Size Guide */}
                          <button
                            onClick={() => handleNavigation('/size-guide')}
                            className={`group relative p-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                              theme === 'dark'
                                ? 'hover:bg-gray-800 border-gray-800'
                                : 'hover:bg-gray-50 border-gray-200'
                            } border ${isActive('/size-guide') ? 
                              (theme === 'dark' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200') 
                              : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 text-lg transition-all duration-200 ${
                              isActive('/size-guide')
                                ? (theme === 'dark' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-purple-500 text-white')
                                : (theme === 'dark' 
                                    ? 'bg-gray-800 text-gray-300 group-hover:bg-gray-700' 
                                    : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200')
                            }`}>
                              📏
                            </div>
                            <span className={`text-xs font-medium ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Size Guide
                            </span>
                          </button>
                        </div>

                        {/* Advanced Filter Link */}
                        <div className="mt-4 px-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                          <button
                            onClick={() => handleNavigation('/shop')}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                              theme === 'dark'
                                ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                            } ${isActive('/shop') ? 
                              (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
                              : ''}`}
                          >
                            <div className="flex items-center space-x-3">
                              <FiFilter className="text-lg" />
                              <div className="text-left">
                                <div className="font-medium text-sm">Advanced Size Filter</div>
                                <div className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Filter by multiple sizes
                                </div>
                              </div>
                            </div>
                            <FiChevronRight className={`text-sm ${
                              isActive('/shop') ? 
                                (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
                                : 'text-gray-400'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account Dropdown (for logged in users) */}
              {isLoggedIn && (
                <div className="px-4 mb-6">
                  <button
                    onClick={() => toggleSection('account')}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                    } ${expandedSections.account || isActive('/user/') || isActive('/wishlist') ? 
                      (theme === 'dark' ? 'bg-gray-800 text-purple-300' : 'bg-gray-100 text-purple-600') 
                      : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <FiUser className="text-lg" />
                      <span className="font-ui text-sm font-medium">Account</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Wishlist count badge */}
                      {wishlistCount > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                      <FiChevronRight className={`transition-transform duration-300 ${
                        expandedSections.account ? 'rotate-90 text-purple-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedSections.account && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 pt-2 space-y-1">
                          {accountMenuItems.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => handleNavigation(item.path)}
                              className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all duration-300 ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                              } ${isActive(item.path) ? 
                                (theme === 'dark' ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-50 text-purple-600') 
                                : ''}`}
                            >
                              <div className="flex items-center space-x-3">
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {item.label === 'Wishlist' && wishlistCount > 0 && (
                                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                    {wishlistCount}
                                  </span>
                                )}
                                <FiChevronRight className={`text-sm ${
                                  isActive(item.path) ? 
                                    (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
                                    : 'text-gray-400'
                                }`} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-6 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className={`flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-300 font-ui text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-red-900/30 text-red-400 hover:text-red-300'
                      : 'bg-gray-100 hover:bg-red-50 text-red-500 hover:text-red-600'
                  }`}
                >
                  <FiLogOut className="mr-2" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick();
                    setMenuOpen(false);
                  }}
                  className={`flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-300 font-ui text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 hover:text-purple-200'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700'
                  }`}
                >
                  <FiUser className="mr-2" />
                  Sign In / Register
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSideNav;
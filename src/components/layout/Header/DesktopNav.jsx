import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronRight,
  FiChevronDown,
  FiHome,
  FiPercent,
  FiHelpCircle,
  FiStar,
  FiPackage,
  FiHeart,
  FiFilter,
  FiUser,
  FiShoppingBag,
  FiGrid
} from 'react-icons/fi';
import { useGetAllCategoriesQuery } from '../../../redux/services/categoryService';
import LoadingSpinner from '../../../components/Common/LoadingSpinner';

const DesktopNav = ({ 
  theme, 
  location, 
  navigate, 
  shopOpen, 
  toggleShop, 
  handleLinkClick,
  isLoggedIn,
  user,
  wishlistCount
}) => {
  const [expandedSections, setExpandedSections] = useState({
    shop: false,
    categories: false,
    size: false,
    account: false
  });
  const navRef = useRef(null);

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery({
    page: 1,
    limit: 20,
    status: 'ACTIVE'
  });

  // Extract categories from API response
  const categories = categoriesData?.data?.categories || [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setExpandedSections({
          shop: false,
          categories: false,
          size: false,
          account: false
        });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const handleNavigation = (path) => {
    navigate(path);
    handleLinkClick();
    setExpandedSections({
      shop: false,
      categories: false,
      size: false,
      account: false
    });
  };

  // Function to convert category name to URL slug
  const getCategorySlug = (categoryName) => {
    // Convert to lowercase and replace spaces with hyphens
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };


  // Size categories with icons
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

  // Handle category navigation - FIXED: Use path parameters
  const handleCategoryNavigation = (category) => {
    // Convert category name to URL slug
    const categorySlug = getCategorySlug(category.name);
    // Navigate to shop with category path parameter
    navigate(`/shop/${categorySlug}`);
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

  return (
    <nav ref={navRef} className="hidden xl:flex items-center justify-center flex-1">
      <div className="flex items-center space-x-1">
        {/* Main Menu Items */}
        {mainMenuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={(e) => {
              handleLinkClick();
              if (item.path === '/shop') {
                e.preventDefault();
                handleNavigation('/shop');
              }
            }}
            className={`group relative flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
            } ${isActive(item.path) ? 
              (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
              : ''}`}
          >
            {item.icon}
            <span className={`font-ui text-sm font-medium ${
              item.highlight ? 'text-red-500' : ''
            }`}>
              {item.label}
            </span>
            {item.highlight && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                SALE
              </span>
            )}
            
            {/* Active indicator */}
            {isActive(item.path) && (
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full ${
                theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
              }`} />
            )}
          </Link>
        ))}



        {/* Categories Dropdown - FETCHED FROM API */}
        <div className="relative">
          <button
            onClick={() => toggleSection('categories')}
            className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
            } ${expandedSections.categories || location.pathname.startsWith('/shop/') ? 
              (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
              : ''}`}
          >
            <FiGrid className="text-base" />
            <span className="font-ui text-sm font-medium">Categories</span>
            <FiChevronDown className={`transition-transform duration-300 ${
              expandedSections.categories ? 'rotate-180' : ''
            } ${expandedSections.categories || location.pathname.startsWith('/shop/') ? 
              (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
              : 'text-gray-400'}`} />
            
            {/* Active indicator */}
            {location.pathname.startsWith('/shop/') && !expandedSections.categories && (
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full ${
                theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
              }`} />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.categories && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-full left-0 mt-2 w-64 py-3 rounded-lg shadow-xl z-50 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {categoriesLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : categories.length > 0 ? (
                  <div className="space-y-1">
                    {/* All Categories Option */}
                    <button
                      onClick={() => handleNavigation('/shop')}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all duration-200 ${
                        theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                      } ${location.pathname === '/shop' ? 
                        (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
                        : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-base">🛍️</span>
                        <span className="font-medium">All Categories</span>
                      </div>
                      <FiChevronRight className={`text-sm ${
                        location.pathname === '/shop' ? 
                          (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
                          : 'text-gray-400'
                      }`} />
                    </button>

                    {/* Categories from API */}
                    {categories.map((category) => {
                      const categorySlug = getCategorySlug(category.name);
                      const categoryPath = `/shop/${categorySlug}`;
                      
                      return (
                        <button
                          key={category._id || category.id}
                          onClick={() => handleNavigation(categoryPath)}
                          className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all duration-200 ${
                            theme === 'dark'
                              ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                          } ${isActive(categoryPath) ? 
                            (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
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
                    })}
                  </div>
                ) : (
                  <div className={`text-center py-4 px-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <p className="text-sm">No categories found</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* By Size Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleSection('size')}
            className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
            } ${expandedSections.size || (location.pathname === '/shop' && location.search.includes('size=')) ? 
              (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
              : ''}`}
          >
            <FiFilter className="text-base" />
            <span className="font-ui text-sm font-medium">By Size</span>
            <FiChevronDown className={`transition-transform duration-300 ${
              expandedSections.size ? 'rotate-180' : ''
            } ${expandedSections.size || (location.pathname === '/shop' && location.search.includes('size=')) ? 
              (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
              : 'text-gray-400'}`} />
            
            {/* Active indicator */}
            {location.pathname === '/shop' && location.search.includes('size=') && !expandedSections.size && (
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full ${
                theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
              }`} />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.size && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-full left-0 mt-2 w-80 py-4 rounded-xl shadow-2xl z-50 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border border-gray-800'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {/* Size Grid Header */}
                <div className="px-5 mb-3">
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
                <div className="grid grid-cols-3 gap-2 px-4">
                  {sizeCategories.slice(0, 5).map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      className={`group relative p-3 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                        theme === 'dark'
                          ? 'hover:bg-gray-800 border-gray-800'
                          : 'hover:bg-gray-50 border-gray-200'
                      } border ${isSizeFilterActive(item.icon) ? 
                        (theme === 'dark' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200') 
                        : ''}`}
                    >
                      {/* Size Badge */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-lg font-bold transition-all duration-200 ${
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
                      <span className={`text-xs font-medium mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {item.label.split(' ')[0]}
                      </span>
                      
                      {/* Size Range */}
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {item.range}
                      </span>
                      
                      {/* Popular Badge */}
                      {item.popular && (
                        <span className="absolute -top-1 -right-1 px-2 py-0.5 text-[10px] bg-green-500 text-white rounded-full">
                          Popular
                        </span>
                      )}
                      
                      {/* Active Indicator */}
                      {isSizeFilterActive(item.icon) && (
                        <div className={`absolute bottom-1 w-6 h-0.5 rounded-full ${
                          theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                        }`} />
                      )}
                    </button>
                  ))}
                  
                  {/* Size Guide */}
                  <button
                    onClick={() => handleNavigation('/size-guide')}
                    className={`group relative p-3 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800 border-gray-800'
                        : 'hover:bg-gray-50 border-gray-200'
                    } border ${isActive('/size-guide') ? 
                      (theme === 'dark' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200') 
                      : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-lg transition-all duration-200 ${
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
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account Dropdown (for logged in users) */}
        {isLoggedIn && (
          <div className="relative">
            <button
              onClick={() => toggleSection('account')}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-800/50 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              } ${expandedSections.account || isActive('/user/') || isActive('/wishlist') ? 
                (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
                : ''}`}
            >
              <FiUser className="text-lg" />
              <span className="font-ui text-sm font-medium">Account</span>
              <FiChevronDown className={`transition-transform duration-300 ${
                expandedSections.account ? 'rotate-180' : ''
              } ${expandedSections.account || isActive('/user/') || isActive('/wishlist') ? 
                (theme === 'dark' ? 'text-purple-400' : 'text-purple-500') 
                : 'text-gray-400'}`} />
              
              {/* Wishlist count badge */}
              {wishlistCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {wishlistCount}
                </span>
              )}
              
              {/* Active indicator */}
              {(isActive('/user/') || isActive('/wishlist')) && !expandedSections.account && (
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full ${
                  theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                }`} />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.account && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full right-0 mt-2 w-64 py-3 rounded-lg shadow-xl z-50 ${
                    theme === 'dark'
                      ? 'bg-gray-900 border border-gray-800'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="space-y-1">
                    {accountMenuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigation(item.path)}
                        className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all duration-200 ${
                          theme === 'dark'
                            ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                        } ${isActive(item.path) ? 
                          (theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-600') 
                          : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </div>
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
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DesktopNav;
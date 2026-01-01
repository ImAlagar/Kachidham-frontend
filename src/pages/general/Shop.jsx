import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  X,
  Star,
  ShoppingBag,
  Heart,
  Tag,
  Search,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGetAllProductsQuery } from '../../redux/services/productService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ProductCard from '../../components/ProductCard/ProductCard';
import CartSidebar from '../../components/layout/CartSidebar';

const Shop = () => {
  const { theme } = useTheme();
  const { category } = useParams(); // Get category from URL
  const location = useLocation(); // Get query parameters
  const navigate = useNavigate(); // For navigation
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [likedProducts, setLikedProducts] = useState({});
  const [categoryName, setCategoryName] = useState('');
    const [showCartSidebar, setShowCartSidebar] = useState(false);


  // Theme-based styling
  const themeStyles = {
    light: {
      bg: {
        primary: 'bg-white',
        secondary: 'bg-gray-50',
        card: 'bg-white'
      },
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        muted: 'text-gray-500'
      },
      border: 'border-gray-200',
      shadow: 'shadow-md'
    },
    dark: {
      bg: {
        primary: 'bg-gray-900',
        secondary: 'bg-gray-800',
        card: 'bg-gray-800'
      },
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        muted: 'text-gray-400'
      },
      border: 'border-gray-700',
      shadow: 'shadow-lg shadow-gray-900/50'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Parse size parameter (can be single or comma-separated)
    const sizeParam = params.get('size');
    if (sizeParam) {
      const sizes = sizeParam.split(',').filter(Boolean);
      setSelectedSizes(sizes);
    }
    
    // Parse other query parameters if needed
    const priceMin = params.get('price_min');
    const priceMax = params.get('price_max');
    if (priceMin && priceMax) {
      setSelectedPriceRange([parseInt(priceMin), parseInt(priceMax)]);
    }
    
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
    
    const sort = params.get('sort');
    if (sort) {
      setSortBy(sort);
    }
  }, [location.search]);

  // Update URL when filters change
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    
    if (selectedSizes.length > 0) {
      params.set('size', selectedSizes.join(','));
    }
    
    if (selectedPriceRange[0] > 0) {
      params.set('price_min', selectedPriceRange[0].toString());
    }
    
    if (selectedPriceRange[1] < 10000) {
      params.set('price_max', selectedPriceRange[1].toString());
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (sortBy !== 'newest') {
      params.set('sort', sortBy);
    }
    
    // Only update if there are any params
    const queryString = params.toString();
    const newUrl = category ? `/shop/${category}` : '/shop';
    navigate(`${newUrl}${queryString ? `?${queryString}` : ''}`, { replace: true });
  };

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams();
  }, [selectedSizes, selectedPriceRange, searchQuery, sortBy]);

  // Fetch all products
  const { data: apiData, isLoading, error } = useGetAllProductsQuery();
  
  // Safely extract products from API response
  const extractProductsFromResponse = () => {
    if (!apiData) return [];
    
    if (Array.isArray(apiData)) {
      return apiData;
    }
    
    if (apiData.data) {
      if (Array.isArray(apiData.data)) {
        return apiData.data;
      }
      if (apiData.data.data && Array.isArray(apiData.data.data)) {
        return apiData.data.data;
      }
      if (apiData.data.products && Array.isArray(apiData.data.products)) {
        return apiData.data.products;
      }
    }
    
    return [];
  };

  const allProducts = extractProductsFromResponse();

  // Extract unique sizes and categories
  const allSizes = [...new Set(
    allProducts.reduce((acc, product) => {
      if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach(variant => {
          if (variant.size) {
            acc.push(variant.size);
          }
        });
      }
      return acc;
    }, []).filter(Boolean)
  )].sort();

  const allCategories = [...new Set(
    allProducts.map(p => p.category?.name).filter(Boolean)
  )];

  // Map URL category param to display name
  const categoryDisplayNames = {
    'pajama-sets': 'Pajama Sets',
    'nightgowns': 'Nightgowns',
    'nightshirts': 'Nightshirts',
    'robes': 'Robes',
    'sleep-masks': 'Sleep Masks',
    'all': 'All Nightwear'
  };

  // Update category name based on URL param
  useEffect(() => {
    if (category) {
      const displayName = categoryDisplayNames[category] || 
                         category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      setCategoryName(displayName);
      setSelectedCategory(displayName);
    } else {
      setCategoryName('All Nightwear');
      setSelectedCategory('');
    }
  }, [category]);

  // Available sizes for filtering
  const sizeOptions = ['M', 'L', 'XL', '2XL', '3XL'];
  const priceRanges = [
    { label: 'Under ₹500', range: [0, 500] },
    { label: '₹500 - ₹1000', range: [500, 1000] },
    { label: '₹1000 - ₹2000', range: [1000, 2000] },
    { label: '₹2000 - ₹5000', range: [2000, 5000] },
    { label: 'Over ₹5000', range: [5000, 10000] }
  ];

  // Transform API data for ProductCard
  const transformApiProduct = (product) => {
    const primaryVariant = product.variants?.[0];
    const primaryImage = primaryVariant?.variantImages?.find(img => img.isPrimary) || primaryVariant?.variantImages?.[0];
    
    const discount = product.offerPrice && product.normalPrice
      ? Math.round(((product.normalPrice - product.offerPrice) / product.normalPrice) * 100)
      : 0;

    // Extract sizes from variants
    const sizes = product.variants?.map(v => v.size).filter(Boolean) || [];

    return {
      id: product.id,
      name: product.name,
      productCode: product.productCode,
      category: product.category?.name || 'Uncategorized',
      price: `₹${product.offerPrice || product.normalPrice}`,
      originalPrice: product.offerPrice ? `₹${product.normalPrice}` : '',
      discount: discount > 0 ? `${discount}% OFF` : '',
      image: primaryImage?.imageUrl || 'https://via.placeholder.com/300x400',
      isNew: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      featured: product.featured,
      variants: product.variants,
      avgRating: product.avgRating || 0,
      totalRatings: product.totalRatings || 0,
      colors: Array.from(new Set(product.variants?.map(v => v.color) || [])),
      inStock: product.variants?.some(v => v.stock > 0) || false,
      // Additional fields for filtering
      sizes: sizes,
      normalPriceValue: product.normalPrice,
      offerPriceValue: product.offerPrice,
      createdAt: product.createdAt
    };
  };

  const transformedProducts = allProducts.map(transformApiProduct);

  // Filter products based on criteria
  const filteredProducts = transformedProducts.filter(product => {
    // Category filter from URL param
    if (category && category !== 'all') {
      const productCategory = product.category?.toLowerCase().replace(/\s+/g, '-');
      if (productCategory !== category) return false;
    }
    
    // Selected category filter from UI
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    // Size filter (COMPULSORY - only show products with selected sizes)
    if (selectedSizes.length > 0) {
      const hasSelectedSize = selectedSizes.some(size => 
        product.sizes.includes(size)
      );
      if (!hasSelectedSize) return false;
    }

    // Price range filter
    const price = product.offerPriceValue || product.normalPriceValue;
    if (price < selectedPriceRange[0] || price > selectedPriceRange[1]) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.productCode.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.offerPriceValue || a.normalPriceValue) - (b.offerPriceValue || b.normalPriceValue);
      case 'price-high':
        return (b.offerPriceValue || b.normalPriceValue) - (a.offerPriceValue || a.normalPriceValue);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'rating':
        return (b.avgRating || 0) - (a.avgRating || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handlers
  const toggleSize = (size) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    setCurrentPage(1);
  };

  const toggleLike = (productId) => {
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleAddToCart = (product) => {
    // Add to cart logic here
    
    // Open cart sidebar after adding
    setShowCartSidebar(true);
  };


  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedCategory(category ? categoryDisplayNames[category] || '' : '');
    setSelectedPriceRange([0, 10000]);
    setSearchQuery('');
    setCurrentPage(1);
    navigate(category ? `/shop/${category}` : '/shop');
  };

  const handlePriceRangeSelect = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1);
  };

  const handleCategorySelect = (cat) => {
    if (cat === '') {
      navigate('/shop');
    } else {
      // Convert display name back to URL param
      const urlParam = Object.keys(categoryDisplayNames).find(
        key => categoryDisplayNames[key] === cat
      ) || cat.toLowerCase().replace(/\s+/g, '-');
      navigate(`/shop/${urlParam}`);
    }
    setCurrentPage(1);
  };

  const handleBackToAll = () => {
    navigate('/shop');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.bg.primary}`}>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${currentTheme.bg.primary}`}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className={`text-2xl font-bold ${currentTheme.text.primary} mb-4`}>
            Error Loading Products
          </h2>
          <p className={currentTheme.text.secondary}>
            Please try again later or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg.primary}`}>
      {/* Header with Breadcrumb */}
      <div className={`border-b ${currentTheme.border} ${currentTheme.bg.secondary}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {category && (
                <button
                  onClick={handleBackToAll}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className={currentTheme.text.muted}>Shop</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className={currentTheme.text.primary}>
                {categoryName}
              </span>
            </div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl md:text-4xl font-bold font-italiana ${currentTheme.text.primary}`}
          >
            {categoryName} Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`text-lg mt-2 font-instrument ${currentTheme.text.secondary}`}
          >
            {category ? 
              `Discover premium ${categoryName.toLowerCase()}` :
              'Discover premium comfort and style in every piece'
            }
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className={`lg:w-1/4 ${currentTheme.bg.card} ${currentTheme.shadow} rounded-xl p-6 h-fit lg:sticky lg:top-8 ${currentTheme.border}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-lg font-semibold font-instrument ${currentTheme.text.primary}`}>
                    <Filter className="w-5 h-5 inline-block mr-2" />
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium font-instrument mb-2 ${currentTheme.text.secondary}`}>
                    Search Products
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by name or code..."
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg.primary} ${currentTheme.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                {/* Size Filter (COMPULSORY) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-semibold font-instrument ${currentTheme.text.primary}`}>
                      Size <span className="text-red-500">*</span>
                    </h4>
                    {selectedSizes.length > 0 && (
                      <button
                        onClick={() => setSelectedSizes([])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {sizeOptions.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`py-2 text-sm font-medium rounded-lg transition-all ${
                          selectedSizes.includes(size)
                            ? 'bg-blue-600 text-white'
                            : `${currentTheme.bg.secondary} ${currentTheme.text.secondary} hover:bg-gray-200 dark:hover:bg-gray-700`
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className={`text-xs mt-2 ${currentTheme.text.muted}`}>
                    {selectedSizes.length > 0 
                      ? `${selectedSizes.length} size${selectedSizes.length > 1 ? 's' : ''} selected`
                      : 'Select sizes to filter products'}
                  </div>
                </div>

                {/* Category Filter */}
                {allCategories.length > 0 && (
                  <div className="mb-6">
                    <h4 className={`text-sm font-semibold font-instrument mb-3 ${currentTheme.text.primary}`}>
                      Categories
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleCategorySelect('')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          !category
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : `${currentTheme.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                        }`}
                      >
                        All Categories
                      </button>
                      {allCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleCategorySelect(cat)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedCategory === cat
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              : `${currentTheme.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold font-instrument mb-3 ${currentTheme.text.primary}`}>
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <button
                        key={index}
                        onClick={() => handlePriceRangeSelect(range.range)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedPriceRange[0] === range.range[0] && selectedPriceRange[1] === range.range[1]
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : `${currentTheme.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className={`text-xs ${currentTheme.text.muted} mb-2`}>
                      Selected: ₹{selectedPriceRange[0]} - ₹{selectedPriceRange[1]}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={selectedPriceRange[0]}
                        onChange={(e) => {
                          setSelectedPriceRange([parseInt(e.target.value), selectedPriceRange[1]]);
                          setCurrentPage(1);
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={selectedPriceRange[1]}
                        onChange={(e) => {
                          setSelectedPriceRange([selectedPriceRange[0], parseInt(e.target.value)]);
                          setCurrentPage(1);
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(selectedSizes.length > 0 || selectedCategory || selectedPriceRange[0] > 0 || selectedPriceRange[1] < 10000 || searchQuery) && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className={`mb-6 p-4 rounded-xl ${currentTheme.bg.card} ${currentTheme.shadow} ${currentTheme.border}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Left: Results count and filter button */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters {showFilters ? '(Hide)' : '(Show)'}
                  </button>
                  <div className={`text-sm ${currentTheme.text.secondary}`}>
                    Showing {Math.min(productsPerPage, currentProducts.length)} of {sortedProducts.length} products
                    {category && ` in ${categoryName}`}
                  </div>
                </div>

                {/* Right: View mode and sort */}
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`appearance-none pl-4 pr-10 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg.primary} ${currentTheme.text.primary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronLeft className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* View Mode Toggle */}
                  <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                    >
                      <Grid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-blue-600' : currentTheme.text.muted}`} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                    >
                      <List className={`w-5 h-5 ${viewMode === 'list' ? 'text-blue-600' : currentTheme.text.muted}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedSizes.length > 0 || selectedCategory || searchQuery) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {selectedSizes.map(size => (
                      <span
                        key={size}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm"
                      >
                        Size: {size}
                        <button
                          onClick={() => toggleSize(size)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm">
                        Category: {selectedCategory}
                        <button
                          onClick={() => handleCategorySelect('')}
                          className="ml-1 hover:text-green-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:text-purple-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Products Display */}
            {currentProducts.length > 0 ? (
              <>
                {/* Grid View */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        liked={!!likedProducts[product.id]}
                        onToggleLike={() => toggleLike(product.id)}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-4">
                    {currentProducts.map(product => (
                      <div
                        key={product.id}
                        className={`p-4 rounded-xl ${currentTheme.bg.card} ${currentTheme.shadow} ${currentTheme.border}`}
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Image */}
                          <div className="md:w-1/4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className={`text-lg font-semibold font-instrument ${currentTheme.text.primary} mb-1`}>
                                  {product.name}
                                </h3>
                                <p className={`text-sm ${currentTheme.text.muted} mb-2`}>
                                  Code: {product.productCode} | Category: {product.category}
                                </p>
                                {product.avgRating > 0 && (
                                  <div className="flex items-center gap-1 mb-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm">{product.avgRating.toFixed(1)}</span>
                                    <span className={`text-xs ${currentTheme.text.muted}`}>
                                      ({product.totalRatings} reviews)
                                    </span>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => toggleLike(product.id)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                              >
                                <Heart
                                  className={`w-5 h-5 ${
                                    likedProducts[product.id]
                                      ? 'fill-red-500 text-red-500'
                                      : currentTheme.text.muted
                                  }`}
                                />
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {product.sizes.slice(0, 5).map(size => (
                                <span
                                  key={size}
                                  className={`px-2 py-1 text-xs rounded ${
                                    selectedSizes.includes(size)
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {size}
                                </span>
                              ))}
                              {product.sizes.length > 5 && (
                                <span className={`px-2 py-1 text-xs rounded ${currentTheme.text.muted}`}>
                                  +{product.sizes.length - 5} more
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                {product.discount && (
                                  <span className="inline-block px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs rounded mr-2">
                                    {product.discount}
                                  </span>
                                )}
                                {product.isNew && (
                                  <span className="inline-block px-2 py-1 bg-black text-white text-xs rounded mr-2">
                                    NEW
                                  </span>
                                )}
                                {product.isBestSeller && (
                                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded">
                                    BEST SELLER
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                {product.originalPrice && (
                                  <div className={`text-sm line-through ${currentTheme.text.muted}`}>
                                    {product.originalPrice}
                                  </div>
                                )}
                                <div className={`text-xl font-bold font-instrument ${currentTheme.text.primary}`}>
                                  {product.price}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart
                              </button>
                              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${
                        currentPage === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : `${currentTheme.bg.secondary} ${currentTheme.text.secondary} hover:bg-gray-200 dark:hover:bg-gray-700`
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg ${
                        currentPage === totalPages
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className={`text-sm ${currentTheme.text.secondary} ml-4`}>
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* No Products Found */
              <div className={`text-center py-16 rounded-xl ${currentTheme.bg.card} ${currentTheme.shadow}`}>
                <Filter className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className={`text-xl font-semibold font-instrument mb-2 ${currentTheme.text.primary}`}>
                  No Products Found
                </h3>
                <p className={`mb-6 ${currentTheme.text.secondary}`}>
                  {category 
                    ? `No ${categoryName.toLowerCase()} found with your current filters`
                    : 'Try adjusting your filters or search terms'
                  }
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Summary Footer */}
            <div className={`mt-12 p-6 rounded-xl ${currentTheme.bg.card} ${currentTheme.shadow} ${currentTheme.border}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className={`text-2xl font-bold font-instrument ${currentTheme.text.primary} mb-1`}>
                    {filteredProducts.length}
                  </div>
                  <div className={`text-sm ${currentTheme.text.secondary}`}>
                    {category ? `${categoryName} Products` : 'Total Products'}
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold font-instrument ${currentTheme.text.primary} mb-1`}>
                    {allCategories.length}
                  </div>
                  <div className={`text-sm ${currentTheme.text.secondary}`}>
                    Categories
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold font-instrument ${currentTheme.text.primary} mb-1`}>
                    {allSizes.length}
                  </div>
                  <div className={`text-sm ${currentTheme.text.secondary}`}>
                    Available Sizes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

            {/* Cart Sidebar */}
        <CartSidebar 
          isOpen={showCartSidebar} 
          onClose={() => setShowCartSidebar(false)} 
        />
    </div>
  );
};

export default Shop;
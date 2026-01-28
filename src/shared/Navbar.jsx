import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { API_BASE_URL } from '../config/api';
import logo from '../assets/logo with line.png'
import { VscAccount } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { CiMenuFries } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Memoized static messages
const STATIC_MESSAGES = [
  { 
    message: "Book an appointment for customisation", 
    type: "APPOINTMENT",
    id: "static-1"
  },
  { 
    message: "Express delivery available!", 
    type: "SERVICE",
    id: "static-2"
  },
  { 
    message: "24/7 customer support", 
    type: "SERVICE",
    id: "static-3"
  },
];

export default function Navbar() {
  const [openNav, setOpenNav] = useState(false);
  const [user, setUser] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);
  const [discountIndex, setDiscountIndex] = useState(0);
  
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const isMounted = useRef(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Single useEffect for all data fetching
  useEffect(() => {
    isMounted.current = true;
    
    const fetchAllData = async () => {
      try {
        // Fetch user data from localStorage (sync)
        const storedUser = localStorage.getItem('token');
        if (isMounted.current) setUser(storedUser);
        
        // Fetch categories and discounts in parallel
        const [categoriesRes, discountsRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/category`),
          fetch(`${API_BASE_URL}/api/discounts`)
        ]);
        
        // Process categories
        if (categoriesRes.status === 'fulfilled' && isMounted.current) {
          const data = await categoriesRes.value.json();
          if (data.success) {
            setCategories(data.data.filter(cat => cat.isActive));
          }
        }
        
        // Process discounts
        if (discountsRes.status === 'fulfilled' && isMounted.current) {
          const data = await discountsRes.value.json();
          if (data.success && data.data.discounts) {
            const filteredDiscounts = data.data.discounts.filter(discount => 
              discount.isActive === true && 
              new Date(discount.validFrom) <= new Date() && 
              new Date(discount.validUntil) >= new Date()
            );
            setActiveDiscounts(filteredDiscounts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (!error.message?.includes('AbortError')) {
          toast.error("Failed to load navigation data");
        }
      } finally {
        if (isMounted.current) {
          setLoadingCategories(false);
          setLoadingDiscounts(false);
        }
      }
    };
    
    fetchAllData();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoized discount messages
  const discountMessages = useMemo(() => {
    return activeDiscounts.map(discount => {
      const discountType = discount.discountType;
      const discountValue = discount.discountValue;
      const productName = discount.product?.name || "";
      const categoryName = discount.category?.name || "";
      const subcategoryName = discount.subcategory?.name || "";
      const minQuantity = discount.minQuantity;
      const minOrderAmount = discount.minOrderAmount;
      const maxDiscount = discount.maxDiscount;
      const code = discount.name || "";
      
      let message = "";
      
      switch(discountType) {
        case 'PERCENTAGE':
          message = `${discountValue}% OFF`;
          if (categoryName) {
            message += ` on ${categoryName}`;
          } else if (subcategoryName) {
            message += ` on ${subcategoryName}`;
          } else if (productName) {
            message += ` on ${productName}`;
          } else {
            message += ` Sitewide`;
          }
          if (maxDiscount) {
            message += ` (Upto ₹${maxDiscount})`;
          }
          break;
          
        case 'FIXED_AMOUNT':
          message = `FLAT ₹${discountValue} OFF`;
          if (categoryName) {
            message += ` on ${categoryName}`;
          } else if (subcategoryName) {
            message += ` on ${subcategoryName}`;
          } else if (productName) {
            message += ` on ${productName}`;
          } else {
            message += ` Sitewide`;
          }
          break;
          
        case 'BUY_X_GET_Y':
          message = `Buy ${minQuantity} ${productName ? productName : "items"} & Get ₹${discountValue} OFF`;
          break;
          
        default:
          message = discount.description || "Special Offer";
          break;
      }
      
      if (minOrderAmount && minOrderAmount > 0) {
        message += ` | Min. Order: ₹${minOrderAmount}`;
      }
      
      if (code) {
        message += ` | Use Code: ${code}`;
      }
      
      return {
        message,
        type: discountType,
        id: discount.id,
        discount
      };
    });
  }, [activeDiscounts]);

  // Memoized combined messages
  const messages = useMemo(() => {
    return [...discountMessages, ...STATIC_MESSAGES];
  }, [discountMessages]);

  // Optimized message rotation
  useEffect(() => {
    if (messages.length <= 1) return;
    
    const interval = setInterval(() => {
      setDiscountIndex(prev => (prev + 1) % messages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [messages.length]);

  // Search suggestions with debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchQuery?.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      try {
        setLoadingSuggestions(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(
          `${API_BASE_URL}/api/products/search?query=${encodeURIComponent(debouncedSearchQuery)}`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        const json = await res.json();
        
        if (json.success && isMounted.current) {
          const products = json.data.products || json.data || [];
          setSuggestions(products.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted.current) {
          console.error("Search suggestion error", err);
        }
      } finally {
        if (isMounted.current) {
          setLoadingSuggestions(false);
        }
      }
    };
    
    fetchSuggestions();
  }, [debouncedSearchQuery]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoized event handlers
  const handleDiscountClick = useCallback(() => {
    if (messages.length === 0) return;
    
    const currentMessage = messages[discountIndex];
    
    if (currentMessage?.discount) {
      navigate('/shop');
      
      let toastMessage = "";
      const discount = currentMessage.discount;
      
      if (discount.product?.name) {
        toastMessage = `🎁 ${discount.product.name} Offer: ${discount.name || "Use Code"}`;
      } else if (discount.category?.name) {
        toastMessage = `🏷️ ${discount.category.name} Category Offer: ${discount.name || "Use Code"}`;
      } else {
        toastMessage = `🔥 Sitewide Offer: ${discount.name || "Use Code"}`;
      }
      
      toast.info(
        <div>
          <p className="font-semibold">{toastMessage}</p>
          <p className="text-sm">{currentMessage.message}</p>
        </div>,
        { autoClose: 4000 }
      );
    } else {
      navigate('/shop');
    }
  }, [messages, discountIndex, navigate]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  }, [searchQuery, navigate]);

  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleSuggestionClick = useCallback((id) => {
    navigate(`/product-details/${id}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setOpenNav(false);
  }, [navigate]);

  const handleCategoryClick = useCallback((id) => {
    navigate(`/shop/category/${id}`);
    setOpenNav(false);
  }, [navigate]);

  // Memoized rendered elements
  const currentOffer = useMemo(() => {
    if (messages.length === 0) {
      return {
        message: "All orders ship free!",
        type: "SERVICE",
        id: "default"
      };
    }
    return messages[discountIndex];
  }, [messages, discountIndex]);

  const TopOfferBar = useMemo(() => (
    <div className="bg-primary">
      <div className="h-fit py-2 text-center overflow-hidden flex justify-center items-center">
        {loadingDiscounts && discountMessages.length === 0 ? (
          <div className="animate-pulse bg-secondary/30 h-4 w-48 rounded"></div>
        ) : (
          <button
            onClick={handleDiscountClick}
            className="w-full h-full flex justify-center items-center hover:bg-primary/90 transition group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentOffer.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center text-center gap-1 sm:gap-2 px-4 w-full"
              >
                {/* Icon */}
                {currentOffer.type === 'PERCENTAGE' && (
                  <span className="text-secondary">🎁</span>
                )}
                {currentOffer.type === 'FIXED_AMOUNT' && (
                  <span className="text-secondary">💰</span>
                )}
                {currentOffer.type === 'BUY_X_GET_Y' && (
                  <span className="text-secondary">🎯</span>
                )}
                {currentOffer.type === 'FREE_SHIPPING' && (
                  <span className="text-secondary">🚚</span>
                )}
                {(!currentOffer.type || currentOffer.type === 'SERVICE') && (
                  <span className="text-secondary">⭐</span>
                )}
                
                <p className="font-baijamjuree text-secondary tracking-widest text-center text-sm">
                  {currentOffer.message}
                </p>
                
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  Click to shop →
                </span>
              </motion.div>
            </AnimatePresence>
          </button>
        )}
      </div>
    </div>
  ), [loadingDiscounts, discountMessages.length, handleDiscountClick, currentOffer]);

  const DesktopCategories = useMemo(() => (
    <div className="hidden px-5 md:flex w-full shadow-md shadow-black/60">
      <div className="w-full overflow-x-auto no-scrollbar">
        <ul className="flex items-center gap-10 font-josefin py-3 text-base tracking-widest whitespace-nowrap w-max mx-auto">
          <li>
            <Link to="/shop" className="hover:text-primary transition">
              Shop All
            </Link>
          </li>
          {loadingCategories ? (
            [...Array(5)].map((_, i) => (
              <li key={i} className="animate-pulse h-6 w-24 bg-gray-300 rounded" />
            ))
          ) : (
            <>
              {categories.map(category => (
                <li key={category.id}>
                  <Link
                    to={`/shop/category/${category.id}`}
                    className="hover:text-primary transition"
                  >
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                  </Link>
                </li>
              ))}
            </>
          )}
          <li>
            <Link to="/faqs" className="hover:text-primary transition">
              FAQs?
            </Link>
          </li>
          <li>
            <Link to="/book-an-appointment" className="hover:text-primary transition">
              Book an appointment
            </Link>
          </li>
        </ul>
      </div>
    </div>
  ), [loadingCategories, categories]);

  const MobileMenu = useMemo(() => (
    <AnimatePresence>
      {openNav && (
        <motion.div
          key="mobile-menu"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed lg:hidden z-[1000] top-[30%] inset-0 bg-white shadow-lg"
        >
          <ul className="flex flex-col font-josefin tracking-widest text-xl gap-6 pt-6 px-6">
            <li key="shop-all">
              <Link
                to="/shop"
                onClick={() => setOpenNav(false)}
                className="hover:text-primary transition block py-2"
              >
                Shop All
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/shop/category/${category.id}`}
                  onClick={() => setOpenNav(false)}
                  className="hover:text-primary transition block py-2"
                >
                  {category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
                </Link>
              </li>
            ))}
            <li>
              <Link 
                to="/faqs" 
                onClick={() => setOpenNav(false)}
                className="hover:text-primary transition block py-2"
              >
                FAQs?
              </Link>
            </li>
            <li>
              <Link 
                to="/book-an-appointment" 
                onClick={() => setOpenNav(false)}
                className="hover:text-primary transition block py-2"
              >
                Book an appointment
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  ), [openNav, categories]);

  const SearchSuggestions = useMemo(() => {
    if (!showSuggestions || !searchQuery.trim()) return null;
    
    return (
      <div 
        ref={suggestionsRef}
        className="absolute top-10 left-0 w-full bg-primary shadow-lg rounded-md mt-2 z-50 max-h-60 overflow-y-auto"
      >
        {loadingSuggestions ? (
          <div className="px-4 py-3">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-secondary/20 rounded"></div>
                <div className="h-4 bg-secondary/20 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSuggestionClick(item.id)}
              className="w-full text-left px-4 py-3 text-white font-josefin text-base tracking-widest hover:bg-secondary/20 border-b border-secondary/10 last:border-b-0 transition-colors"
            >
              {item.name}
            </button>
          ))
        ) : (
          <p className="block px-4 py-3 font-josefin text-base tracking-widest text-gray-300">
            No results found
          </p>
        )}
      </div>
    );
  }, [showSuggestions, searchQuery, loadingSuggestions, suggestions, handleSuggestionClick]);

  return (
    <section className='relative mb-5 lg:mb-0 bg-white'>
      {/* TOP BAR - ROTATING OFFERS */}
      {TopOfferBar}

      {/* DESKTOP NAV */}
      <div className='border-b hidden lg:flex bg-prim border-primary'>
        <div className='flex w-full py-4 px-10 lg:px-20 justify-between items-center'>
          {/* Logo */}
          <Link to={'/'} className='flex items-center gap-1'>
            <img 
              className='h-10 w-auto' 
              src={logo} 
              alt="Kachidham logo" 
              loading="eager"
              width={40}
              height={40}
            />
            <h1 className='tracking-[10px] mt-2 font-josefin text-sm font-semibold'>
              KACHIDHAM
            </h1>
          </Link>

          <div className='flex items-center gap-10'>
            {/* Search bar */}
            <div className='flex relative items-center gap-3 px-4 rounded-full border-gray-400 h-fit border w-fit'>
              <input
                ref={searchInputRef}
                className='outline-none font-josefin py-1 border-gray-400 placeholder:text-black placeholder:font-josefin placeholder:tracking-widest rounded-xl w-48'
                placeholder='search...'
                type='search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
              />
              <button
                onClick={handleSearch}
                className='text-2xl cursor-pointer hover:text-primary transition-colors'
                aria-label="Search"
              >
                <CiSearch />
              </button>
              {SearchSuggestions}
            </div>

            {/* Account */}
            <Link 
              to={user ? "/my-account" : "/login"} 
              className='flex cursor-pointer text-xl items-center gap-3 hover:text-primary transition-colors'
            >
              <span><VscAccount /></span>
              <span className='font-josefin tracking-widest font-medium'>
                {user ? "Account" : "Login"}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP CATEGORIES */}
      {DesktopCategories}

      {/* MOBILE NAV */}
      <div className='flex flex-col justify-center items-center lg:hidden border-primary'>
        <div className='flex w-full py-4 px-2 lg:px-20 justify-between items-center'>
          {/* Logo */}
          <Link to={'/'} className='flex items-center gap-1'>
            <img 
              className='h-10 w-auto' 
              src={logo} 
              alt="Kachidham logo" 
              loading="eager"
              width={40}
              height={40}
            />
            <h1 className='tracking-[10px] mt-2 font-josefin text-sm font-semibold'>
              KACHIDHAM
            </h1>
          </Link>
          
          {/* Account and menu */}
          <div className='lg:hidden flex text-3xl items-center gap-7'>
            <Link to={user ? "/my-account" : "/login"} className="hover:text-primary transition-colors">
              <VscAccount />
            </Link>
            <button 
              onClick={() => setOpenNav(prev => !prev)}
              className="hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {openNav ? <RxCross2 /> : <CiMenuFries />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search bar */}
        <div className='flex relative items-center gap-3 px-4 rounded-full border-gray-400 h-fit border w-fit mb-4'>
          <input 
            ref={searchInputRef}
            className='outline-none font-josefin py-1 bg-transparent border-gray-400 placeholder:text-black placeholder:font-josefin placeholder:tracking-widest rounded-xl w-48'
            placeholder='search...' 
            type='search' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <button
            onClick={handleSearch}
            className='text-2xl cursor-pointer hover:text-primary transition-colors'
            aria-label="Search"
          >
            <CiSearch />
          </button>
          {SearchSuggestions}
        </div>
      </div>

      {/* MOBILE MENU */}
      {MobileMenu}
    </section>
  );
}
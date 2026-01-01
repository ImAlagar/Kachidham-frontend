import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useGetProductBySlugQuery } from '../../redux/services/productService';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorState from '../../components/productsDetailsPage/ErrorState';
import Breadcrumb from '../../components/productsDetailsPage/Breadcrumb';
import ProductImages from '../../components/productsDetailsPage/ProductImages';
import ProductInfo from '../../components/productsDetailsPage/ProductInfo';
import ProductTabs from '../../components/productsDetailsPage/ProductTabs';
import RelatedProducts from './RelatedProducts';
import CartSidebar from '../../components/layout/CartSidebar';
import { toast } from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  // Get user and wishlist from Redux
  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);

  // Function to get query parameter from URL
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  // Get color from URL query parameter
  const colorFromUrl = getQueryParam('color');

  // Fetch product
  const { 
    data: productData, 
    isLoading, 
    error, 
    isError,
    isFetching 
  } = useGetProductBySlugQuery(productId, {
    skip: !productId,
    refetchOnMountOrArgChange: true
  });

  // Redirect if no productId
  useEffect(() => {
    if (!productId) {
      navigate('/shop');
    }
  }, [productId, navigate]);

  // Process product data
  const product = React.useMemo(() => {
    if (!productData) return {};
    return productData.data || productData;
  }, [productData]);

  // Helper function to safely extract string values
  const getStringValue = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // Handle object with name property
      if (value.name) return String(value.name);
      // Handle object with title property
      if (value.title) return String(value.title);
      // Handle any other object
      return String(value);
    }
    return String(value);
  };

  // Safely get product name and category
  const productName = getStringValue(product?.name);
  const productCategory = getStringValue(product?.category);

  // Check if product data is valid
  const hasProductData = product && (product._id || product.id) && productName;

  // State
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  // Extract product data
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const availableSizes = [...new Set(variants.map(v => v?.size).filter(Boolean))];
  const availableColors = [...new Set(variants.map(v => v?.color).filter(Boolean))];
  const totalStock = variants.reduce((sum, variant) => sum + (variant?.stock || 0), 0);
  const isInStock = totalStock > 0;

  // Check if product is in wishlist
  const isLiked = wishlistItems.some(item => 
    item.product._id === product._id || item.product.id === product._id
  );

  // Helper functions
  const getColorStock = (color) => {
    if (!color) return 0;
    if (selectedSize) {
      const variant = variants.find(v => 
        v?.color?.toLowerCase() === color.toLowerCase() && 
        v?.size === selectedSize
      );
      return variant?.stock || 0;
    }
    const colorVariants = variants.filter(v => 
      v?.color?.toLowerCase() === color.toLowerCase()
    );
    return colorVariants.reduce((sum, v) => sum + (v?.stock || 0), 0);
  };

  const getSizeStock = (size) => {
    if (!size) return 0;
    if (selectedColor) {
      const variant = variants.find(v => 
        v?.size === size && 
        v?.color?.toLowerCase() === selectedColor.toLowerCase()
      );
      return variant?.stock || 0;
    }
    const sizeVariants = variants.filter(v => v?.size === size);
    return sizeVariants.reduce((sum, v) => sum + (v?.stock || 0), 0);
  };

  // Find selected variant
  const getSelectedVariant = () => {
    return variants.find(v => 
      v?.color?.toLowerCase() === selectedColor?.toLowerCase() && 
      v?.size === selectedSize
    );
  };

  // Check if item is in cart
  const isItemInCart = () => {
    if (!selectedColor && !selectedSize) return false;
    
    const variant = getSelectedVariant();
    if (!variant) return false;
    
    return cartItems.some(item => 
      item.product._id === product._id && 
      item.variant._id === variant._id
    );
  };

  // Wishlist handlers
  const handleToggleWishlist = () => {
    if (!product._id) return;

    const wishlistItem = {
      product: {
        _id: product._id,
        name: productName,
        image: product.image || (product.images && product.images[0]) || '',
        price: product.offerPrice || product.normalPrice || 0,
        category: productCategory
      },
      addedAt: new Date().toISOString()
    };

    if (isLiked) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(wishlistItem));
      toast.success('Added to wishlist');
    }
  };

// Add to cart handler - FIXED VERSION
const handleAddToCart = () => {
  if (!selectedColor && availableColors.length > 0) {
    toast.error('Please select color');
    return;
  }

  if (!selectedSize && availableSizes.length > 0) {
    toast.error('Please select size');
    return;
  }

  const variant = getSelectedVariant();
  if (!variant) {
    toast.error('Please select valid options');
    return;
  }

  if (variant.stock < quantity) {
    toast.error(`Only ${variant.stock} items available`);
    return;
  }
  // 🔥 FIX: Check if we have proper MongoDB IDs
  // If _id is undefined, try other possible ID fields
  const productId = product._id || product.id || product.productId;
  const variantId = variant._id || variant.id || variant.variantId;

  if (!productId) {
    console.error('❌ No product ID found!', product);
    toast.error('Product information incomplete');
    return;
  }

  if (!variantId) {
    console.error('❌ No variant ID found!', variant);
    toast.error('Variant information incomplete');
    return;
  }

  const cartPayload = {
    product: {
      _id: productId, // 🔥 Use the validated ID
      name: productName,
      description: product.description || '',
      category: productCategory,
      images: product.images || [],
      image: product.image || (product.images && product.images[0]) || '',
      normalPrice: product.normalPrice || 0,
      offerPrice: product.offerPrice || null,
      // Add price for compatibility
      price: variant.price || product.offerPrice || product.normalPrice || 0
    },
    variant: {
      _id: variantId, // 🔥 Use the validated ID
      color: selectedColor,
      size: selectedSize,
      price: variant.price || product.offerPrice || product.normalPrice || 0,
      stock: variant.stock || 0,
      sku: variant.sku || '',
      image: variant.variantImages?.[0]?.imageUrl || product.image || '',
      variantImages: variant.variantImages || []
    },
    quantity
  };

  
  dispatch(addToCart(cartPayload));
  toast.success('Added to cart');
  setShowCartSidebar(true);
};

  // Buy now handler
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  // Auto-select first available options and handle URL color parameter
  useEffect(() => {
    if (variants.length > 0) {
      // First, try to set color from URL parameter if available and valid
      if (colorFromUrl && availableColors.includes(colorFromUrl)) {
        const colorStock = getColorStock(colorFromUrl);
        if (colorStock > 0) {
          setSelectedColor(colorFromUrl);
        }
      }
      
      // If no color from URL or invalid, auto-select first available color
      if (!selectedColor && availableColors.length > 0) {
        const firstAvailableColor = availableColors.find(color => getColorStock(color) > 0);
        if (firstAvailableColor) setSelectedColor(firstAvailableColor);
      }
      
      // Auto-select first available size
      if (!selectedSize && availableSizes.length > 0) {
        const firstAvailableSize = availableSizes.find(size => getSizeStock(size) > 0);
        if (firstAvailableSize) setSelectedSize(firstAvailableSize);
      }
    }
  }, [variants, availableColors, availableSizes, colorFromUrl]);

  // Adjust quantity if exceeds stock
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = variants.find(v => 
        v?.color?.toLowerCase() === selectedColor.toLowerCase() && 
        v?.size === selectedSize
      );
      if (variant?.stock && quantity > variant.stock) {
        setQuantity(Math.min(variant.stock, quantity));
      }
    }
  }, [selectedColor, selectedSize, variants, quantity]);

  // Loading state
  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
            <span className="ml-4 text-gray-900 dark:text-white">
              Loading product details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !hasProductData) {
    return <ErrorState error={error} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Breadcrumb 
        productName={productName} 
        productCategory={productCategory} 
      />

      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          <ProductImages 
            product={product}
            productName={productName}
            variants={variants}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            showZoomModal={showZoomModal}
            setShowZoomModal={setShowZoomModal}
            zoomedImage={zoomedImage}
            setZoomedImage={setZoomedImage}
            isInStock={isInStock}
            discount={product.offerPrice && product.normalPrice 
              ? Math.round(((product.normalPrice - product.offerPrice) / product.normalPrice) * 100)
              : 0
            }
          />

          <ProductInfo 
            product={product}
            productName={productName}
            variants={variants}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            quantity={quantity}
            setQuantity={setQuantity}
            isLiked={isLiked}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isItemInCart={isItemInCart()}
            availableSizes={availableSizes}
            availableColors={availableColors}
            getColorStock={getColorStock}
            getSizeStock={getSizeStock}
            totalStock={totalStock}
            isInStock={isInStock}
            setShowCartSidebar={setShowCartSidebar}
            colorFromUrl={colorFromUrl}
              setSelectedImageIndex={setSelectedImageIndex} // Add this line

          />
        </div>

        {/* Product Tabs */}
        <ProductTabs 
          product={product}
          productName={productName}
          productCategory={productCategory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          availableSizes={availableSizes}
        />

        {/* Related Products */}
        <RelatedProducts 
          currentProduct={product}
          category={productCategory}
        />

        {/* Support CTA */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              Need Help Choosing?
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Our customer service team is here to help you find the perfect fit.
            </p>
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <CartSidebar 
        isOpen={showCartSidebar} 
        onClose={() => setShowCartSidebar(false)} 
      />
    </div>
  );
};

export default ProductDetailsPage;
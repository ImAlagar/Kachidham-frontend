import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEffect, useState } from 'react';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { Heart, Trash2, ShoppingBag, AlertCircle } from "lucide-react";
import CartSidebar from '../../../components/layout/CartSidebar';
import { useSelector } from 'react-redux';
import placeholderimage from "../../../assets/images/placeholder.jpg";

const UserWishlist = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { 
    wishlistItems, 
    clearAllWishlist, 
    removeItemFromWishlist,
    wishlistCount 
  } = useWishlist();

  const [showCartSidebar, setShowCartSidebar] = useState(false);




  // Dynamic styles based on theme
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const subText = isDark ? "text-gray-400" : "text-gray-600";

  // Cart update handler
  const handleCartUpdate = () => {
      setShowCartSidebar(true);
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = (productId) => {
    removeItemFromWishlist(productId);
  };

  // Enhanced transformation with debugging
  const transformWishlistItem = (wishlistItem, index) => {
    if (!wishlistItem?.product) {
      console.warn('Invalid wishlist item:', wishlistItem);
      return null;
    }

    const product = wishlistItem.product;
    const variant = wishlistItem.variant;
    
    
    // Get the correct product ID
    const productId = product._id || product.id;
    
    // Get all available images for the product
    const getProductImages = () => {
      const allImages = [];
      
      // Add variant image if available
      if (variant?.image) {
        allImages.push(variant.image);
      }
      
      // Add product images from images array
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((img, idx) => {
          if (typeof img === 'string') {
            allImages.push(img);
          } else if (img?.imageUrl) {
            allImages.push(img.imageUrl);
          } else if (img?.url) {
            allImages.push(img.url);
          }
        });
      }
      
      // Add main product image if available
      if (product.image && !allImages.includes(product.image)) {
        allImages.push(product.image);
      }
      
      // Remove duplicates by URL
      const uniqueImages = [...new Set(allImages)];
      
      // If no images found, use placeholder
      if (uniqueImages.length === 0) {
        uniqueImages.push(placeholderimage);
      }
      
      return uniqueImages;
    };

    const productImages = getProductImages();



    // Determine the correct price
    const getCorrectPrice = () => {
      // Try in this order: variant price -> product offer price -> product normal price -> product price -> 0
      const price = variant?.price || 
                    product?.offerPrice || 
                    product?.normalPrice || 
                    product?.price || 
                    0;
      return price;
    };

    const correctPrice = getCorrectPrice();

    // Build variants array for ProductCard
    const buildVariants = () => {
      if (variant) {
        const variantData = {
          _id: variant._id || `${productId}-${variant.color || 'default'}`,
          color: variant.color || 'Default',
          size: variant.size || 'N/A',
          price: correctPrice, // Use the correct price
          stock: variant.stock || product.stock || 0,
          variantImages: productImages.map(image => ({ imageUrl: image })),
          sku: variant.sku || '',
          image: variant.image || productImages[0]
        };
        return [variantData];
      }
      
      // If no variant, create a default one
      const defaultVariant = {
        _id: productId,
        color: product.color || 'Default',
        size: 'N/A',
        price: correctPrice,
        stock: product.stock || 0,
        variantImages: productImages.map(image => ({ imageUrl: image })),
        sku: product.sku || '',
        image: productImages[0]
      };
      return [defaultVariant];
    };

    const variants = buildVariants();
    
    // Determine if product is new
    const isNew = product.createdAt ? 
      (Date.now() - new Date(product.createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000) : false;
    
    // Calculate discount percentage if applicable
    const calculateDiscount = () => {
      if (product.normalPrice && product.offerPrice && product.offerPrice < product.normalPrice) {
        const discount = ((product.normalPrice - product.offerPrice) / product.normalPrice * 100).toFixed(0);
        return `${discount}% OFF`;
      }
      return null;
    };

    const transformedProduct = {
      id: productId,
      _id: productId,
      name: product.name || 'Product Name',
      title: product.name || 'Product Name',
      category: product.category || 'Uncategorized',
      price: `${correctPrice}`, // Use the correct price
      originalPrice: product.normalPrice && product.offerPrice && product.offerPrice < product.normalPrice 
        ? `₹${product.normalPrice}` 
        : null,
      discount: calculateDiscount(),
      image: productImages[0] || placeholderimage,
      variants: variants,
      colors: [...new Set(variants.map(v => v.color).filter(Boolean))],
      inStock: variants.some(v => v.stock > 0),
      normalPrice: product.normalPrice || 0,
      offerPrice: product.offerPrice || 0,
      wholesalePrice: product.wholesalePrice || 0,
      isWholesaleUser: user?.role === 'WHOLESALER',
      avgRating: product.avgRating || 0,
      totalRatings: product.totalRatings || 0,
      isFeatured: product.featured || false,
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
      isNew: isNew,
      color: variant?.color || product.color || '',
      baseProductId: product.baseProductId || productId,
      description: product.description || '',
      stock: product.stock || 0,
      // Add raw data for debugging
      _rawProduct: product,
      _rawVariant: variant
    };

    return transformedProduct;
  };

  // Filter out invalid products
  const transformedProducts = wishlistItems
    .map(transformWishlistItem)
    .filter(product => product !== null && (product.id || product._id));


  // Debug cart add function



  return (
    <section className={`py-12 transition-colors duration-500 ${bgColor} min-h-screen`}>
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className={`text-4xl md:text-5xl font-italiana tracking-widest font-bold ${textColor}`}>
          MY WISHLIST
        </h2>
        <div className="w-20 h-[2px] bg-red-500 mx-auto mt-2"></div>
        
        {/* Wishlist Stats */}
        <div className="mt-4 flex justify-center items-center gap-6">
          <p className={`${textColor} text-lg`}>
            {transformedProducts.length} {transformedProducts.length === 1 ? 'item' : 'items'}
          </p>
          {transformedProducts.length > 0 && (
            <button
              onClick={clearAllWishlist}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {transformedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 px-6 md:px-16">
          {transformedProducts.map((product, index) => (
            <div key={product.id || product._id || index} className="relative group">

              <ProductCard 
                product={product} 
                onCartUpdate={handleCartUpdate}
              />

            
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <Heart size={64} className="text-gray-300" />
          </div>
          <p className={`${textColor} text-xl mb-2`}>
            {wishlistCount > 0 ? 'Some wishlist items could not be loaded' : 'Your wishlist is empty'}
          </p>
          <p className={`${subText} text-sm mb-6`}>
            {wishlistCount > 0 
              ? 'There might be issues with some products in your wishlist'
              : 'Start adding products you love to your wishlist'
            }
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ShoppingBag size={18} />
            Browse Products
          </button>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCartSidebar} 
        onClose={() => setShowCartSidebar(false)} 
      />

    </section>
  );
}

export default UserWishlist;
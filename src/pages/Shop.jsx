import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/CommonComponents/ProductCard";
import { API_BASE_URL } from "../config/api";
import Loader from "../components/HomeComponents/SkeletonLoader";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import shopBorder from '../assets/shopBorder.png'

export default function Shop() {
  const { categoryId, subcategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 16;

  // Memoize parameters to prevent unnecessary fetches
  const memoizedParams = useMemo(() => ({
    categoryId,
    subcategoryId,
    searchQuery,
    page
  }), [categoryId, subcategoryId, searchQuery, page]);

  // Single optimized fetch function
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build URL efficiently
      let url = `${API_BASE_URL}/api/products?page=${page}&limit=${LIMIT}`;

      if (searchQuery?.trim()) {
        url = `${API_BASE_URL}/api/products/search?query=${encodeURIComponent(searchQuery)}&page=${page}&limit=${LIMIT}`;
      } else if (subcategoryId) {
        url = `${API_BASE_URL}/api/products?subcategoryId=${subcategoryId}&page=${page}&limit=${LIMIT}`;
      } else if (categoryId) {
        url = `${API_BASE_URL}/api/products?categoryId=${categoryId}&page=${page}&limit=${LIMIT}`;
      }

      // Fetch in parallel when possible
      const [productsRes, categoryRes, subcategoryRes] = await Promise.allSettled([
        fetch(url),
        categoryId && !searchQuery ? fetch(`${API_BASE_URL}/api/category/${categoryId}`) : Promise.resolve(null),
        subcategoryId ? fetch(`${API_BASE_URL}/api/subcategory/${subcategoryId}`) : Promise.resolve(null)
      ]);

      // Process products response
      if (productsRes.status === 'fulfilled') {
        const res = productsRes.value;
        if (!res.ok) throw new Error("API failed");
        
        const json = await res.json();
        if (json.success) {
          const allProducts = Array.isArray(json.data?.products)
            ? json.data.products
            : Array.isArray(json.data)
              ? json.data
              : json.data
                ? [json.data]
                : [];

          // Only filter if needed
          setProducts(
            allProducts.filter(product => product.status === "ACTIVE")
          );
          setTotalPages(json.data.pagination?.pages || 1);
        }
      } else {
        throw new Error("Failed to fetch products");
      }

      // Process category name
      if (categoryRes.status === 'fulfilled' && categoryRes.value) {
        const json = await categoryRes.value.json();
        if (json.success) setCategoryName(json.data.name);
      }

      // Process subcategory name
      if (subcategoryRes.status === 'fulfilled' && subcategoryRes.value) {
        const json = await subcategoryRes.value.json();
        if (json.success) setSubcategoryName(json.data.name);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedParams]);

  // Single useEffect for all data fetching
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [categoryId, subcategoryId, searchQuery]);

  // Optimized pagination component
  const Pagination = useMemo(() => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-full border transition-colors ${
            page === i
              ? "bg-primary text-white border-primary"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-12 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="w-10 h-10 flex justify-center items-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous page"
        >
          <MdOutlineNavigateBefore className="text-xl" />
        </button>

        {pages}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="w-10 h-10 flex justify-center items-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next page"
        >
          <MdOutlineNavigateNext className="text-xl" />
        </button>
      </div>
    );
  }, [page, totalPages]);

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="py-20 text-center flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <p className="py-20 min-h-screen text-center text-red-600 tracking-widest">
        {error}
      </p>
    );
  }

  // Animation variants
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="px-4 md:px-6 lg:px-20 py-8 bg-secondary/10">
      {/* Page Title */}
      <div className="flex flex-col mb-8 gap-3 justify-center items-center">
        <h1 className="text-2xl md:text-3xl text-center text-secondary font-semibold font-baijamjuree tracking-widest">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : subcategoryId
              ? subcategoryName || "Loading..."
              : categoryId
                ? categoryName || "Loading..."
                : "Shop All"}
        </h1>
        <img 
          className="w-32 md:w-40" 
          src={shopBorder} 
          alt="Border image for title"
          loading="lazy"
        />
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                variants={cardVariant}
                initial="hidden"
                animate="visible"
                transition={{ 
                  duration: 0.4, 
                  ease: "easeOut",
                  delay: index * 0.05 // Stagger animation
                }}
                style={{ willChange: 'transform, opacity' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          {Pagination}
        </>
      ) : (
        <p className="text-center tracking-widest py-20">
          No products found
        </p>
      )}
    </section>
  );
}
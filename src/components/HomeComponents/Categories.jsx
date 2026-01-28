import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "./SkeletonLoader";
import ProductCard from "../CommonComponents/ProductCard";
import { API_BASE_URL } from "../../config/api";
import { Link } from "react-router-dom";
import heading from '../../assets/heading.png'

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoriesWithProducts();
  }, []);

  const fetchCategoriesWithProducts = async () => {
    try {
      const catRes = await fetch(`${API_BASE_URL}/api/category`);
      const catJson = await catRes.json();

      if (!catJson.success) throw new Error("Category API failed");

      const categoriesWithProducts = await Promise.all(
        catJson.data
          .filter((category) => category._count.products > 0) // ✅ ONLY categories with products
          .map(async (category) => {
            const prodRes = await fetch(
              `${API_BASE_URL}/api/products?categoryId=${category.id}`
            );
            const prodJson = await prodRes.json();

            return {
              ...category,
              products: prodJson.data?.products || []
            };
          })
      );

      setCategories(categoriesWithProducts);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-20 text-center text-red-500 tracking-widest">
        {error}
      </p>
    );
  }

  return (
    <motion.section
      className="px-6 lg:px-20 py-10 bg-primary lg:py-20 pb-10 space-y-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {/* CATEGORY HEADER */}
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              className="text-2xl md:text-3xl text-secondary font-semibold tracking-widest font-baijamjuree"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              {category.name}
            </motion.h2>

            <Link
              to={`/shop/category/${category.id}`}
              className="text-sm text-secondary underline tracking-widest"
            >
              View All
            </Link>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <img className="md:w-[20%] w-[50%]" src={heading} alt="" />
            <div className="w-full h-[1px] bg-secondary"></div>
          </div>

          {/* PRODUCTS */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {category.products.slice(0, 8).map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </motion.section>
  );
}

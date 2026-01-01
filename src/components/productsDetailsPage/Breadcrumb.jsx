import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ productName, productCategory }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center text-sm">
          <Link 
            to="/" 
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link 
            to="/shop" 
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Shop
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          {productCategory && (
            <>
              <Link 
                to={`/shop?category=${encodeURIComponent(productCategory)}`}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {productCategory}
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            </>
          )}
          <span className="font-medium text-gray-900 dark:text-white truncate">
            {productName || 'Product'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
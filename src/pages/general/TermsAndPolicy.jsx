import React from 'react';
import { Scale, ShoppingBag, CreditCard, Shield, FileText, Globe, Clock, Mail, MapPin, Phone, AlertCircle, BookOpen, CheckCircle, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedIcon from '../../components/Common/AnimatedIcon';
import { motion } from 'framer-motion';
import { PAGE_TRANSITIONS } from '../../constants/animationConstants';

const TermsAndPolicy = () => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={PAGE_TRANSITIONS.page}
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-50 to-blue-50'
      } py-12 px-4 sm:px-6`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={PAGE_TRANSITIONS.item}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
          }`}>
            <AnimatedIcon 
              icon={Scale}
              animation="pulse"
              size={32}
              className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
            />
          </div>
          <h1 className="text-4xl font-bold font-heading mb-3 transition-colors duration-300">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              Terms and Conditions
            </span>
          </h1>
          <p className={`text-lg font-body transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Welcome to kachidham Fashions Girls Nightwear
          </p>
          <div className={`mt-4 text-sm font-ui transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          variants={PAGE_TRANSITIONS.item}
          className={`rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          } border`}
        >
          <div className="p-8 md:p-12">
            <motion.div 
              variants={PAGE_TRANSITIONS.container}
              className="space-y-10"
            >
              {/* Section 1 */}
              <motion.section 
                variants={PAGE_TRANSITIONS.item}
                className="border-b pb-10 transition-colors duration-300" 
                style={{
                  borderColor: theme === 'dark' ? '#374151' : '#f3f4f6'
                }}
              >
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <AnimatedIcon 
                      icon={FileText}
                      animation="float"
                      size={24}
                      className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      1. Agreement to Terms
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      By accessing and using kachidham Fashions Girls Nightwear's website and services, you accept 
                      and agree to be bound by the terms and provisions of this agreement. 
                      If you do not agree to these terms, please do not use our services.
                    </p>
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded-lg font-body transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-blue-50 text-gray-700'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={AlertCircle}
                      animation="pulse"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                    />
                    <p className="text-sm">
                      <strong className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>
                        Note:
                      </strong> These terms apply to all users of our website, including browsers, 
                      vendors, customers, merchants, and content contributors.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 2 */}
              <motion.section 
                variants={PAGE_TRANSITIONS.item}
                className="border-b pb-10 transition-colors duration-300" 
                style={{
                  borderColor: theme === 'dark' ? '#374151' : '#f3f4f6'
                }}
              >
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <AnimatedIcon 
                      icon={ShoppingBag}
                      animation="bounce"
                      size={24}
                      className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      2. Products and Pricing
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-4 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      We offer premium girls' nightwear products through our online platform:
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={AlertCircle}
                        animation="shimmer"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                      }`}>Product Information</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>All products are subject to availability</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>We reserve the right to discontinue products</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Product colors may vary slightly from images</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={BookOpen}
                        animation="float"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                      }`}>Pricing Policy</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Prices are in Indian Rupees (₹)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Prices subject to change without notice</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Not responsible for typographical errors</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </motion.section>

              {/* Section 3 */}
              <motion.section 
                variants={PAGE_TRANSITIONS.item}
                className="border-b pb-10 transition-colors duration-300" 
                style={{
                  borderColor: theme === 'dark' ? '#374151' : '#f3f4f6'
                }}
              >
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <AnimatedIcon 
                      icon={CreditCard}
                      animation="heartbeat"
                      size={24}
                      className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      3. Orders and Payment
                    </h2>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={CheckCircle}
                        animation="glow"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                      />
                      <h3 className={`text-lg font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                      }`}>Order Processing</h3>
                    </div>
                    <ul className={`space-y-2 pl-5 font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>All orders are subject to acceptance and availability</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Orders processed only after payment authorization</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>We'll send order confirmation via email/SMS</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Shipping times vary by location</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Shield}
                        animation="rotateSlow"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                      />
                      <h3 className={`text-lg font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                      }`}>Payment Methods</h3>
                    </div>
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                      <p className={`font-body transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        We accept various payment methods including credit/debit cards, 
                        UPI, net banking, and popular digital wallets. All transactions 
                        are secured with SSL encryption.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 4 */}
              <motion.section 
                variants={PAGE_TRANSITIONS.item}
                className="border-b pb-10 transition-colors duration-300" 
                style={{
                  borderColor: theme === 'dark' ? '#374151' : '#f3f4f6'
                }}
              >
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Shield}
                      animation="glow"
                      size={24}
                      className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      4. Intellectual Property
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-4 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      All content included on this site, such as text, graphics, logos, 
                      images, product designs, and software, is the property of kachidham Fashions Girls Nightwear 
                      and protected by copyright laws.
                    </p>
                  </div>
                </div>
                
                <div className={`mt-4 p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-blue-50'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={AlertCircle}
                      animation="pulse"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                    />
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <strong className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>
                        Important:
                      </strong> You may not reproduce, distribute, modify, or create derivative 
                      works from any content on this website without our express written permission.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 5 */}
              <motion.section 
                variants={PAGE_TRANSITIONS.item}
                className="border-b pb-10 transition-colors duration-300" 
                style={{
                  borderColor: theme === 'dark' ? '#374151' : '#f3f4f6'
                }}
              >
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Scale}
                      animation="heartbeat"
                      size={24}
                      className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      5. Limitation of Liability
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-4 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      kachidham Fashions Girls Nightwear shall not be liable for any indirect, incidental, 
                      special, consequential, or punitive damages resulting from your use of 
                      or inability to use our services or products.
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Shield}
                        animation="float"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                      }`}>Our Responsibility</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>We ensure product quality and descriptions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Timely order processing and shipping</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Secure payment processing</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={User}
                        animation="shimmer"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                      }`}>Customer Responsibility</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Provide accurate delivery information</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Check product suitability before purchase</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Follow care instructions for products</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </motion.section>

              {/* Section 6 */}
              <motion.section 
                variants={PAGE_TRANSITIONS.item}
                className="border-b pb-10 transition-colors duration-300" 
                style={{
                  borderColor: theme === 'dark' ? '#374151' : '#f3f4f6'
                }}
              >
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Globe}
                      animation="rotateSlow"
                      size={24}
                      className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      6. Governing Law
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-4`}>
                      These terms shall be governed by and construed in accordance with the laws of India.
                      Any disputes shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
                    </p>
                  </div>
                </div>
                
                <div className={`mt-4 p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-blue-50'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={Info}
                      animation="pulse"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}
                    />
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      For international customers, these terms are governed by Indian law, 
                      and any legal proceedings must be initiated in Indian courts.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 7 - Contact Information */}
              <motion.section variants={PAGE_TRANSITIONS.item}>
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Clock}
                      animation="float"
                      size={24}
                      className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      7. Contact Information
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-8 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      For any questions, concerns, or clarifications regarding these terms, 
                      please contact us using the information below:
                    </p>
                  </div>
                </div>
                
                <div className={`rounded-xl p-8 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50'
                }`}>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Details */}
                    <div className="space-y-6">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-start"
                      >
                        <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-blue-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Mail}
                            animation="bounce"
                            size={20}
                            className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                          }`}>Email</h3>
                          <a 
                            href="mailto:kachidham Fashionsclothing25@gmail.com"
                            className={`text-base font-body transition-colors duration-300 hover:text-blue-600 ${
                              theme === 'dark' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-700'
                            }`}
                          >
                            kachidham Fashionsclothing25@gmail.com
                          </a>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-start"
                      >
                        <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-blue-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Phone}
                            animation="pulse"
                            size={20}
                            className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                          }`}>Phone</h3>
                          <a 
                            href="tel:+919940334421"
                            className={`text-base font-body transition-colors duration-300 hover:text-blue-600 ${
                              theme === 'dark' ? 'text-gray-300 hover:text-blue-300' : 'text-gray-700'
                            }`}
                          >
                            +91 99403 34421
                          </a>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-start"
                      >
                        <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-blue-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Clock}
                            animation="rotateSlow"
                            size={20}
                            className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                          }`}>Business Hours</h3>
                          <p className={`text-base font-body transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Mon–Sun: 9AM – 8PM IST
                          </p>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Address */}
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-blue-900/30' : 'bg-white'
                      }`}>
                        <AnimatedIcon 
                          icon={MapPin}
                          animation="float"
                          size={20}
                          className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}
                        />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                          theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                        }`}>Address</h3>
                        <address className={`not-italic text-base leading-relaxed font-body transition-colors duration-300 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Andiappan Street<br />
                          Old Washermenpet<br />
                          Chennai - 600021<br />
                          Tamil Nadu, India
                        </address>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className={`mt-8 pt-8 border-t text-sm italic font-body transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-400 border-gray-600' : 'text-gray-600 border-gray-200'
                  }`}>
                    We typically respond to terms-related inquiries within 24-48 hours during business days.
                  </div>
                </div>
              </motion.section>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          variants={PAGE_TRANSITIONS.item}
          className={`mt-8 text-center text-sm font-ui transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          These Terms and Conditions are effective from the date stated above and may be updated periodically.
          <br />
          © {new Date().getFullYear()} kachidham Fashions Girls Nightwear. All rights reserved.
        </motion.div>
      </div>
    </motion.div>
  );
};

// Add missing import for Info icon
import { Info } from 'lucide-react';

export default TermsAndPolicy;
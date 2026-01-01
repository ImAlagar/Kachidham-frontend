import React from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  AlertCircle,
  Shield,
  Tag,
  Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedIcon from '../../components/Common/AnimatedIcon';
import { motion } from 'framer-motion';
import { PAGE_TRANSITIONS } from '../../constants/animationConstants';

const ReturnsAndRefunds = () => {
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
          : 'bg-gradient-to-br from-gray-50 to-amber-50'
      } py-12 px-4 sm:px-6`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={PAGE_TRANSITIONS.item}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'
          }`}>
            <AnimatedIcon 
              icon={RefreshCw}
              animation="rotateSlow"
              size={32}
              className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
            />
          </div>
          <h1 className="text-4xl font-bold font-heading mb-3 transition-colors duration-300">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              Returns & Refunds Policy
            </span>
          </h1>
          <p className={`text-lg font-body transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Hassle-free returns for kachidham Fashions Girls Nightwear
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
                    theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Shield}
                      animation="pulse"
                      size={24}
                      className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      1. Return Policy
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Your satisfaction is our priority at kachidham Fashions Girls Nightwear. If you're not completely happy 
                      with your purchase, we accept returns within 30 days of delivery for eligible items.
                    </p>
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-amber-50'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={Clock}
                      animation="rotateSlow"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}
                    />
                    <p className="text-sm font-body">
                      <strong className={theme === 'dark' ? 'text-amber-200' : 'text-amber-700'}>
                        Return Window:
                      </strong> 30 days from the date of delivery
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
                    theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50'
                  }`}>
                    <AnimatedIcon 
                      icon={CheckCircle}
                      animation="heartbeat"
                      size={24}
                      className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      2. Eligibility for Returns
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-4 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      To qualify for a return, your item must meet the following conditions:
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-green-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={CheckCircle}
                        animation="float"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-green-200' : 'text-green-700'
                      }`}>Return Requirements</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Original condition with no signs of wear</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Unwashed and unworn</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Original tags still attached</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Original packaging intact</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={XCircle}
                        animation="pulse"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-red-200' : 'text-red-700'
                      }`}>Non-Returnable Items</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">✗</span>
                        <span>Innerwear and intimate apparel</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✗</span>
                        <span>Customized or personalized items</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✗</span>
                        <span>Gift cards or vouchers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✗</span>
                        <span>Discounted/final sale items</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
                
                <div className={`mt-6 p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={AlertCircle}
                      animation="heartbeat"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}
                    />
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                    }`}>
                      <strong>Hygiene Note:</strong> Due to hygiene concerns, we cannot accept returns on 
                      innerwear, nightwear that has been tried on without protective lining, or any 
                      items where the hygiene seal is broken.
                    </p>
                  </div>
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
                    theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Package}
                      animation="shimmer"
                      size={24}
                      className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      3. Return Process
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-6 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Follow these simple steps to initiate your return:
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { step: "Contact Customer Service", desc: "Reach out within 30 days of delivery", icon: Phone, animation: "pulse" },
                    { step: "Provide Order Details", desc: "Share order number and return reason", icon: Tag, animation: "shimmer" },
                    { step: "Receive Return Authorization", desc: "We'll email return instructions and label", icon: Mail, animation: "heartbeat" },
                    { step: "Ship Item Back", desc: "Pack securely and ship using provided label", icon: Truck, animation: "float" },
                    { step: "Receive Refund/Exchange", desc: "Processed after item inspection", icon: CreditCard, animation: "bounce" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'
                      }`}>
                        <span className={`font-bold font-ui transition-colors duration-300 ${
                          theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <AnimatedIcon 
                            icon={item.icon}
                            animation={item.animation}
                            size={18}
                            className={`mr-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}
                          />
                          <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                          }`}>{item.step}</h3>
                        </div>
                        <p className={`text-sm font-body transition-colors duration-300 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
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
                    theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50'
                  }`}>
                    <AnimatedIcon 
                      icon={CreditCard}
                      animation="glow"
                      size={24}
                      className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      4. Refund Policy
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-4 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Our refund process is designed to be transparent and efficient:
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={CheckCircle}
                        animation="pulse"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}
                      />
                      <h3 className={`text-lg font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                      }`}>Refund Details</h3>
                    </div>
                    <ul className={`space-y-2 pl-5 font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Refund to original payment method</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Processing: 5-7 business days after return receipt</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Bank processing may take additional 3-5 days</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Shipping charges are non-refundable</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Info}
                        animation="heartbeat"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}
                      />
                      <h3 className={`text-lg font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                      }`}>Shipping Charges</h3>
                    </div>
                    <div className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-amber-50'
                    }`}>
                      <p className={`font-body transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Return shipping costs are the customer's responsibility unless the return 
                        is due to our error (wrong item, defective product, etc.).
                      </p>
                    </div>
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
                    theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50'
                  }`}>
                    <AnimatedIcon 
                      icon={RefreshCw}
                      animation="rotateSlow"
                      size={24}
                      className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      5. Exchanges
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      We're happy to exchange items for a different size or color, subject to availability. 
                      If the requested item is not available, we will issue a refund to your original payment method.
                    </p>
                  </div>
                </div>
                
                <div className={`mt-4 p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-amber-50'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={Info}
                      animation="pulse"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}
                    />
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <strong className={theme === 'dark' ? 'text-amber-200' : 'text-amber-700'}>
                        Exchange Process:
                      </strong> Follow the same return process, and specify your exchange preference. 
                      We'll ship the replacement item once we receive your return.
                    </p>
                  </div>
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
                    theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50'
                  }`}>
                    <AnimatedIcon 
                      icon={AlertCircle}
                      animation="glow"
                      size={24}
                      className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      6. Damaged or Defective Items
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Your satisfaction is guaranteed. If you receive a damaged or defective item, 
                      please contact us immediately:
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Clock}
                        animation="pulse"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-red-200' : 'text-red-700'
                      }`}>Time Frame</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Report within 48 hours of delivery</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Provide photos of the issue</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Include your order number</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-green-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Truck}
                        animation="float"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-green-200' : 'text-green-700'
                      }`}>Our Response</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Free return shipping label</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Priority replacement processing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>No additional charges for replacement</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </motion.section>

              {/* Section 7 - Contact Information */}
              <motion.section variants={PAGE_TRANSITIONS.item}>
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Mail}
                      animation="bounce"
                      size={24}
                      className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      7. Contact Us
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-8 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      For return requests, exchange inquiries, or any questions about our policy, 
                      please contact our customer support team:
                    </p>
                  </div>
                </div>
                
                <div className={`rounded-xl p-8 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-amber-50'
                }`}>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Details */}
                    <div className="space-y-6">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-start"
                      >
                        <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-amber-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Mail}
                            animation="pulse"
                            size={20}
                            className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                          }`}>Email</h3>
                          <a 
                            href="mailto:kachidham Fashionsclothing25@gmail.com"
                            className={`text-base font-body transition-colors duration-300 hover:text-amber-600 ${
                              theme === 'dark' ? 'text-gray-300 hover:text-amber-300' : 'text-gray-700'
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
                          theme === 'dark' ? 'bg-amber-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Phone}
                            animation="heartbeat"
                            size={20}
                            className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                          }`}>Phone</h3>
                          <a 
                            href="tel:+919940334421"
                            className={`text-base font-body transition-colors duration-300 hover:text-amber-600 ${
                              theme === 'dark' ? 'text-gray-300 hover:text-amber-300' : 'text-gray-700'
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
                          theme === 'dark' ? 'bg-amber-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Clock}
                            animation="rotateSlow"
                            size={20}
                            className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
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
                        theme === 'dark' ? 'bg-amber-900/30' : 'bg-white'
                      }`}>
                        <AnimatedIcon 
                          icon={MapPin}
                          animation="float"
                          size={20}
                          className={theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}
                        />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                          theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                        }`}>Return Address</h3>
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
                    Our returns team typically processes requests within 24 hours during business days. 
                    Please allow 1-2 business days for email response during peak periods.
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
          This Returns & Refunds Policy is effective from the date stated above and may be updated periodically.
          <br />
          © {new Date().getFullYear()} kachidham Fashions Girls Nightwear. All rights reserved.
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReturnsAndRefunds;
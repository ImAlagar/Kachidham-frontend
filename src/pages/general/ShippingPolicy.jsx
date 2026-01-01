import React from 'react';
import { 
  Truck, 
  Clock, 
  Package, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Shield,
  CheckCircle,
  AlertCircle,
  Calendar,
  Tag,
  Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedIcon from '../../components/Common/AnimatedIcon';
import { motion } from 'framer-motion';
import { PAGE_TRANSITIONS } from '../../constants/animationConstants';

const ShippingPolicy = () => {
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
          : 'bg-gradient-to-br from-gray-50 to-purple-50'
      } py-12 px-4 sm:px-6`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={PAGE_TRANSITIONS.item}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
          }`}>
            <AnimatedIcon 
              icon={Truck}
              animation="float"
              size={32}
              className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
            />
          </div>
          <h1 className="text-4xl font-bold font-heading mb-3 transition-colors duration-300">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              Shipping Policy
            </span>
          </h1>
          <p className={`text-lg font-body transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Fast and reliable delivery for kachidham Fashions Girls Nightwear
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
                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <AnimatedIcon 
                      icon={MapPin}
                      animation="pulse"
                      size={24}
                      className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      1. Shipping Areas
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      kachidham Fashions Girls Nightwear ships to all major cities and towns across India. 
                      We're committed to expanding our reach to serve you better in more locations.
                    </p>
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-purple-50'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={CheckCircle}
                      animation="heartbeat"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                    />
                    <p className="text-sm font-body">
                      <strong className={theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}>
                        Coverage:
                      </strong> We currently deliver to over 5000+ pin codes across India with reliable courier partners.
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
                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Clock}
                      animation="rotateSlow"
                      size={24}
                      className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      2. Processing Time
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-4 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      We work diligently to process and dispatch your orders as quickly as possible:
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Package}
                        animation="float"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                      }`}>Regular Orders</h3>
                    </div>
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Processed within 1-2 business days after order confirmation
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Calendar}
                        animation="shimmer"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                      }`}>Weekend/Holidays</h3>
                    </div>
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Orders placed on weekends or holidays processed next business day
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/30' : 'bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Tag}
                        animation="pulse"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                      }`}>Sale Periods</h3>
                    </div>
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Processing may take 2-3 business days during special promotions
                    </p>
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
                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Truck}
                      animation="bounce"
                      size={24}
                      className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      3. Shipping Time & Costs
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-6 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Choose from our flexible shipping options tailored to your needs:
                    </p>
                  </div>
                </div>
                
                <div className={`overflow-hidden rounded-lg border transition-colors duration-300 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-purple-50'
                    }`}>
                      <tr>
                        <th className={`py-3 px-4 text-left font-ui font-semibold transition-colors duration-300 ${
                          theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                        }`}>
                          Service Type
                        </th>
                        <th className={`py-3 px-4 text-left font-ui font-semibold transition-colors duration-300 ${
                          theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                        }`}>
                          Delivery Time
                        </th>
                        <th className={`py-3 px-4 text-left font-ui font-semibold transition-colors duration-300 ${
                          theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                        }`}>
                          Shipping Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y transition-colors duration-300 ${
                      theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                    }`}>
                      {[
                        { service: "Standard Shipping", time: "5-7 business days", cost: "₹49" },
                        { service: "Express Shipping", time: "2-3 business days", cost: "₹99" },
                        { service: "Free Shipping", time: "5-7 business days", cost: "Free on orders above ₹999" }
                      ].map((row, index) => (
                        <tr key={index} className={`transition-colors duration-300 hover:${
                          theme === 'dark' ? 'bg-gray-700/30' : 'bg-purple-50/50'
                        }`}>
                          <td className={`py-3 px-4 font-body transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {row.service}
                          </td>
                          <td className={`py-3 px-4 font-body transition-colors duration-300 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {row.time}
                          </td>
                          <td className={`py-3 px-4 font-body font-semibold transition-colors duration-300 ${
                            theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
                          }`}>
                            {row.cost}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className={`mt-6 p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-purple-50'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={Info}
                      animation="glow"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                    />
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <strong className={theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}>
                        Note:
                      </strong> Delivery times are estimates and may vary based on location and courier service. 
                      Free shipping applies automatically at checkout for eligible orders.
                    </p>
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
                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Package}
                      animation="shimmer"
                      size={24}
                      className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      4. Order Tracking
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Stay updated on your order's journey from our warehouse to your doorstep:
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Mail}
                        animation="pulse"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                      }`}>Tracking Updates</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Email/SMS confirmation upon dispatch</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Real-time tracking link provided</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Delivery attempt notifications</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Shield}
                        animation="rotateSlow"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                      }`}>Tracking Methods</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Track via our website order history</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Use tracking number on courier website</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Contact customer support for assistance</span>
                      </li>
                    </ul>
                  </motion.div>
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
                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <AnimatedIcon 
                      icon={AlertCircle}
                      animation="heartbeat"
                      size={24}
                      className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      5. Shipping Restrictions & Considerations
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-4 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Important information to ensure smooth delivery:
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 font-ui transition-colors duration-300 ${
                      theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                    }`}>Delivery Restrictions</h3>
                    <ul className={`space-y-2 pl-5 font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>No delivery to PO boxes or APO/FPO addresses</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Remote locations may have extended delivery times</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Signature may be required upon delivery</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 font-ui transition-colors duration-300 ${
                      theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                    }`}>Potential Delays</h3>
                    <ul className={`space-y-2 pl-5 font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>During festivals and peak seasons</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Adverse weather conditions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Local restrictions or lockdowns</span>
                      </li>
                    </ul>
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
                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Globe}
                      animation="float"
                      size={24}
                      className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      6. International Shipping
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Currently, we only ship within India. We're working diligently to expand our 
                      international shipping services. Subscribe to our newsletter for updates on 
                      when we start shipping to your country.
                    </p>
                  </div>
                </div>
                
                <div className={`mt-4 p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-purple-50'
                }`}>
                  <div className="flex items-start">
                    <AnimatedIcon 
                      icon={Info}
                      animation="pulse"
                      size={18}
                      className={`mr-2 mt-0.5 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}
                    />
                    <p className={`text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <strong className={theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}>
                        Coming Soon:
                      </strong> We're actively working on expanding to international markets. 
                      Expected launch for select countries in the coming months.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 7 - Contact Information */}
              <motion.section variants={PAGE_TRANSITIONS.item}>
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Phone}
                      animation="bounce"
                      size={24}
                      className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
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
                      For any shipping-related queries, tracking issues, or delivery concerns, 
                      please contact our dedicated customer support team:
                    </p>
                  </div>
                </div>
                
                <div className={`rounded-xl p-8 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-purple-50'
                }`}>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Details */}
                    <div className="space-y-6">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-start"
                      >
                        <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-purple-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Mail}
                            animation="pulse"
                            size={20}
                            className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                          }`}>Email</h3>
                          <a 
                            href="mailto:kachidham Fashionsclothing25@gmail.com"
                            className={`text-base font-body transition-colors duration-300 hover:text-purple-600 ${
                              theme === 'dark' ? 'text-gray-300 hover:text-purple-300' : 'text-gray-700'
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
                          theme === 'dark' ? 'bg-purple-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Phone}
                            animation="heartbeat"
                            size={20}
                            className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                          }`}>Phone</h3>
                          <a 
                            href="tel:+919940334421"
                            className={`text-base font-body transition-colors duration-300 hover:text-purple-600 ${
                              theme === 'dark' ? 'text-gray-300 hover:text-purple-300' : 'text-gray-700'
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
                          theme === 'dark' ? 'bg-purple-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Clock}
                            animation="rotateSlow"
                            size={20}
                            className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
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
                        theme === 'dark' ? 'bg-purple-900/30' : 'bg-white'
                      }`}>
                        <AnimatedIcon 
                          icon={MapPin}
                          animation="float"
                          size={20}
                          className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}
                        />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                          theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
                        }`}>Warehouse Address</h3>
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
                    Our customer support team typically responds within 2-4 hours during business hours 
                    for shipping-related inquiries.
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
          This Shipping Policy is effective from the date stated above and may be updated periodically.
          <br />
          © {new Date().getFullYear()} kachidham Fashions Girls Nightwear. All rights reserved.
        </motion.div>
      </div>
    </motion.div>
  );
};


export default ShippingPolicy;
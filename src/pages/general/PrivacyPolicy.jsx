import React from 'react';
import { Shield, Mail, MapPin, Phone, FileText, User, Server, Lock, Cookie, Bell, Truck, CreditCard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AnimatedIcon from '../../components/Common/AnimatedIcon';
import { motion } from 'framer-motion';
import { PAGE_TRANSITIONS } from '../../constants/animationConstants';

const PrivacyPolicy = () => {
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
          : 'bg-gradient-to-br from-gray-50 to-pink-50'
      } py-12 px-4 sm:px-6`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={PAGE_TRANSITIONS.item}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-100'
          }`}>
            <AnimatedIcon 
              icon={Shield}
              animation="pulse"
              size={32}
              className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
            />
          </div>
          <h1 className="text-4xl font-bold font-heading mb-3 transition-colors duration-300">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              Privacy Policy
            </span>
          </h1>
          <p className={`text-lg font-body transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your privacy is important to us at kachidham Fashions Girls Nightwear
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
                    theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-50'
                  }`}>
                    <AnimatedIcon 
                      icon={FileText}
                      animation="float"
                      size={24}
                      className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      Information We Collect
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-4`}>
                      At kachidham Fashions Girls Nightwear, we are committed to protecting your privacy. 
                      We collect information to provide you with the best possible shopping experience 
                      for our premium girls' nightwear collection.
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className={`p-4 rounded-lg transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-pink-50'
                  }`}>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={User}
                        animation="shimmer"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                      }`}>Information You Provide</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Name and contact details</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Shipping and billing addresses</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Payment information</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Size and preference details</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className={`p-4 rounded-lg transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-gray-700/50' : 'bg-pink-50'
                  }`}>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Server}
                        animation="rotateSlow"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}
                      />
                      <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                      }`}>Automated Collection</h3>
                    </div>
                    <ul className={`space-y-2 text-sm font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Device and browser information</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Website usage data</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Cookies and similar technologies</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Order history and preferences</span>
                      </li>
                    </ul>
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
                    theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Bell}
                      animation="heartbeat"
                      size={24}
                      className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      How We Use Your Information
                    </h2>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-6`}>
                      We use your personal information only for the following purposes:
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Order Processing", desc: "Process and deliver your nightwear orders", icon: Truck, animation: "pulse" },
                    { title: "Customer Service", desc: "Provide personalized support and assistance", icon: Phone, animation: "float" },
                    { title: "Personalization", desc: "Recommend products based on preferences", icon: User, animation: "shimmer" },
                    { title: "Communication", desc: "Send order updates and service notifications", icon: Bell, animation: "heartbeat" },
                    { title: "Marketing", desc: "Send promotions (only with your consent)", icon: Mail, animation: "bounce" },
                    { title: "Improvements", desc: "Enhance our products and shopping experience", icon: Server, animation: "rotateSlow" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.03, y: -3 }}
                      className={`p-4 rounded-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-pink-50'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <AnimatedIcon 
                          icon={item.icon}
                          animation={item.animation}
                          size={18}
                          className={`mr-2 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}
                        />
                        <h3 className={`font-semibold font-ui transition-colors duration-300 ${
                          theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                        }`}>{item.title}</h3>
                      </div>
                      <p className={`text-sm font-body transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{item.desc}</p>
                    </motion.div>
                  ))}
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
                    theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Lock}
                      animation="glow"
                      size={24}
                      className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      Information Sharing & Protection
                    </h2>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Truck}
                        animation="pulse"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}
                      />
                      <h3 className={`text-lg font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                      }`}>When We Share</h3>
                    </div>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-3`}>
                      We respect your privacy and do not sell your personal information. 
                      We only share data in these specific circumstances:
                    </p>
                    <ul className={`space-y-2 pl-5 font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>With shipping partners for order delivery</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Payment processors for transaction completion</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>When required by law or legal process</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>To protect rights, property, or safety</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Shield}
                        animation="heartbeat"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}
                      />
                      <h3 className={`text-lg font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                      }`}>Data Security</h3>
                    </div>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      We implement industry-standard security measures including encryption, 
                      secure servers, and regular security audits to protect your personal 
                      information from unauthorized access.
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
                    theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Cookie}
                      animation="bounce"
                      size={24}
                      className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      Your Rights & Choices
                    </h2>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={User}
                        animation="shimmer"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}
                      />
                      <h3 className={`text-lg font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                      }`}>Your Control</h3>
                    </div>
                    <ul className={`space-y-3 font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <li className="flex items-start">
                        <AnimatedIcon 
                          animation="heartbeat"
                          style={{ display: 'inline-block', marginRight: '8px' }}
                        >
                          <span className="text-green-500">✓</span>
                        </AnimatedIcon>
                        <span>Access and update your personal information</span>
                      </li>
                      <li className="flex items-start">
                        <AnimatedIcon 
                          animation="heartbeat"
                          style={{ display: 'inline-block', marginRight: '8px' }}
                        >
                          <span className="text-green-500">✓</span>
                        </AnimatedIcon>
                        <span>Opt-out of marketing communications</span>
                      </li>
                      <li className="flex items-start">
                        <AnimatedIcon 
                          animation="heartbeat"
                          style={{ display: 'inline-block', marginRight: '8px' }}
                        >
                          <span className="text-green-500">✓</span>
                        </AnimatedIcon>
                        <span>Request data deletion (where applicable)</span>
                      </li>
                      <li className="flex items-start">
                        <AnimatedIcon 
                          animation="heartbeat"
                          style={{ display: 'inline-block', marginRight: '8px' }}
                        >
                          <span className="text-green-500">✓</span>
                        </AnimatedIcon>
                        <span>Manage cookie preferences</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-3">
                      <AnimatedIcon 
                        icon={Cookie}
                        animation="rotateSlow"
                        size={20}
                        className={`mr-2 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}
                      />
                      <h3 className={`text-lg font-semibold font-ui transition-colors duration-300 ${
                        theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                      }`}>Cookies & Tracking</h3>
                    </div>
                    <p className={`text-base leading-relaxed font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-3`}>
                      We use cookies to enhance your shopping experience. 
                      You can control cookies through your browser settings.
                    </p>
                    <div className={`text-sm italic font-body transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      By using our website, you consent to our use of cookies.
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 5 - Contact Information */}
              <motion.section variants={PAGE_TRANSITIONS.item}>
                <div className="flex items-start mb-6">
                  <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-50'
                  }`}>
                    <AnimatedIcon 
                      icon={Mail}
                      animation="float"
                      size={24}
                      className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
                    />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold font-subheading transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    } mb-3`}>
                      Contact Us
                    </h2>
                    <p className={`text-base leading-relaxed font-body mb-8 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      If you have any questions about this Privacy Policy or how we handle your information, 
                      please reach out to us. We're here to help!
                    </p>
                  </div>
                </div>
                
                <div className={`rounded-xl p-8 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-pink-50'
                }`}>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-start"
                      >
                        <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-pink-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Mail}
                            animation="bounce"
                            size={24}
                            className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                          }`}>Email</h3>
                          <a 
                            href="mailto:kachidham Fashionsclothing25@gmail.com"
                            className={`text-base font-body transition-colors duration-300 hover:text-pink-600 ${
                              theme === 'dark' ? 'text-gray-300 hover:text-pink-300' : 'text-gray-700'
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
                          theme === 'dark' ? 'bg-pink-900/30' : 'bg-white'
                        }`}>
                          <AnimatedIcon 
                            icon={Phone}
                            animation="pulse"
                            size={24}
                            className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                            theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
                          }`}>Phone</h3>
                          <a 
                            href="tel:+919940334421"
                            className={`text-base font-body transition-colors duration-300 hover:text-pink-600 ${
                              theme === 'dark' ? 'text-gray-300 hover:text-pink-300' : 'text-gray-700'
                            }`}
                          >
                            +91 99403 34421
                          </a>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Address */}
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-start"
                    >
                      <div className={`p-3 rounded-lg mr-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-pink-900/30' : 'bg-white'
                      }`}>
                        <AnimatedIcon 
                          icon={MapPin}
                          animation="float"
                          size={24}
                          className={theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}
                        />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 font-ui transition-colors duration-300 ${
                          theme === 'dark' ? 'text-pink-200' : 'text-pink-700'
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
                    We typically respond to privacy-related inquiries within 24-48 hours.
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
          This Privacy Policy is effective from the date stated above and may be updated periodically.
          <br />
          © {new Date().getFullYear()} kachidham Fashions Girls Nightwear. All rights reserved.
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
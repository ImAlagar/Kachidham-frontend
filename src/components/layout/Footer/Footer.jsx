import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useThemeColors } from '../../../components/Common/ThemeProviderUtils';
import {
  CONTACT_DATA,
  SOCIAL_MEDIA,
  CATEGORIES,
  TRUST_BADGES,
  QUICK_LINKS,
  POLICY_LINKS
} from '../../../constants/footerData';
import {
  ContactItem,
  SocialIcon,
  SimpleLink,
  BrandLogo,
  ExploreButton
} from '../../../components/layout/Footer/FooterComponents';
import AnimatedIcon from '../../Common/AnimatedIcon';
import { 
  Crown, 
  Heart, 
  ShoppingBag, 
  Mail, 
  Shield,
  Sparkles,
  Star
} from 'lucide-react';

const Footer = React.memo(() => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const colors = useThemeColors(theme);
  const currentYear = new Date().getFullYear();

  // ✅ FIXED: Removed problematic useEffect that was causing scroll issues

  return (
    <footer
      className={`${colors.bgColor} ${colors.textColor} transition-colors duration-500 relative`}
    >
      {/* Trust Badges Section */}
      <div className={`border-b ${colors.borderColor} ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TRUST_BADGES.map((badge, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-2 p-3 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <div className={`p-2 rounded-lg ${colors.iconBgColor}`}>
                  <AnimatedIcon
                    icon={badge.icon}
                    animation={badge.animation}
                    className={colors.accentColor}
                  />
                </div>
                <span className={`text-xs font-medium font-inter ${colors.textColor}`}>
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Brand Section */}
          <BrandSection 
            colors={colors} 
            socialMedia={SOCIAL_MEDIA} 
            theme={theme} 
            borderColor={colors.borderColor}
          />

          {/* Collections Section */}
          <CollectionsSection 
            colors={colors} 
            categories={CATEGORIES} 
            navigate={navigate} 
            goldGradient={colors.goldGradient}
          />

          {/* Quick Links Section */}
          <QuickLinksSection 
            colors={colors} 
            quickLinks={QUICK_LINKS} 
            navigate={navigate}
          />

          {/* Contact Section */}
          <ContactSection 
            colors={colors} 
            contactData={CONTACT_DATA}
          />

        </div>
      </div>

      {/* Bottom Footer */}
      <BottomFooter 
        colors={colors} 
        theme={theme} 
        currentYear={currentYear} 
        policyLinks={POLICY_LINKS}
      />

    </footer>
  );
});

// Sub-components
const BrandSection = React.memo(({ colors, socialMedia, theme, borderColor }) => (
  <div className="md:col-span-2 lg:col-span-1">
    <BrandLogo 
      theme={theme}
      iconBgColor={colors.iconBgColor}
      accentColor={colors.accentColor}
      headingColor={colors.headingColor}
      textColor={colors.textColor}
    />
    
    <p className="text-sm leading-relaxed mb-6 font-inter">
      Crafting exceptional apparel experiences with unmatched quality, style, 
      and elegance. Redefining fashion with every stitch.
    </p>

    <div className="space-y-4">
      <h4 className={`text-sm font-semibold font-poppins ${colors.headingColor}`}>
        Connect With Us
      </h4>
      <div className="flex space-x-3">
        {socialMedia.map((social) => (
          <SocialIcon 
            key={social.id} 
            {...social} 
            theme={theme}
            borderColor={borderColor}
          />
        ))}
      </div>
    </div>
  </div>
));

BrandSection.displayName = 'BrandSection';

const CollectionsSection = React.memo(({ colors, categories, navigate, goldGradient }) => (
  <div>
    <SectionHeader 
      icon={ShoppingBag}
      title="Collections" 
      animation="float" 
      colors={colors}
    />
    
    <div className="grid grid-cols-2 gap-2">
      {categories.map((category, index) => (
        <button
          key={index}
          className={`text-sm font-inter ${colors.textColor} hover:text-amber-600 transition py-2 text-left hover:translate-x-1 duration-300`}
          onClick={() => {
            // ✅ FIXED: Prevent default and use proper navigation
            navigate(`/collection/${category.toLowerCase().replace(/ /g, '-')}`, {
              replace: false, // Changed from true to false for proper history
              state: { fromFooter: true }
            });
          }}
        >
          {category}
        </button>
      ))}
    </div>

    <div className="mt-8">
      <ExploreButton goldGradient={goldGradient} navigate={navigate} />
    </div>
  </div>
));

CollectionsSection.displayName = 'CollectionsSection';

const QuickLinksSection = React.memo(({ colors, quickLinks, navigate }) => (
  <div>
    <SectionHeader 
      icon={Heart}
      title="Quick Links" 
      animation="heartbeat" 
      colors={colors}
    />
    
    <div className="space-y-4">
      {quickLinks.map((link, index) => (
        <SimpleLink 
          key={index}
          onClick={() => navigate(link.path, { replace: false })}
          icon={link.icon}
          textColor={colors.textColor}
          accentColor={colors.accentColor}
        >
          {link.label}
        </SimpleLink>
      ))}
    </div>
  </div>
));

QuickLinksSection.displayName = 'QuickLinksSection';

const ContactSection = React.memo(({ colors, contactData }) => (
  <div className="md:col-span-2 lg:col-span-1">
    <SectionHeader 
      icon={Mail}
      title="Contact Us" 
      animation="pulse" 
      colors={colors}
    />
    
    <ul className="space-y-0 mb-8">
      {contactData.map((item) => (
        <ContactItem 
          key={item.id} 
          {...item} 
          iconBgColor={colors.iconBgColor}
          accentColor={colors.accentColor}
          headingColor={colors.headingColor}
          textColor={colors.textColor}
        />
      ))}
    </ul>
  </div>
));

ContactSection.displayName = 'ContactSection';

const BottomFooter = React.memo(({ colors, theme, currentYear, policyLinks }) => (
  <div className={`border-t ${colors.borderColor} ${theme === "dark" ? "bg-gray-800/50" : "bg-white"}`}>
    <div className="mx-auto mb-5 px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <CopyrightSection colors={colors} currentYear={currentYear} />
      <PolicyLinks policyLinks={policyLinks} colors={colors} />
    </div>
  </div>
));

BottomFooter.displayName = 'BottomFooter';

const CopyrightSection = React.memo(({ colors, currentYear }) => (
  <div 
    className={`
       text-sm font-inter ${colors.textColor}
      flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center
    `}
  >
    <div className="flex items-center gap-1">
      <AnimatedIcon 
        icon={Crown}
        animation="rotateSlow"
        className="text-amber-500"
        size={14}
      />
      <span>© {currentYear} kachidham Fashions. All rights reserved.</span>
    </div>

    <span className="hidden sm:inline">•</span>

    <div className="flex items-center gap-1">
      <span>Crafted with</span>
      <AnimatedIcon 
        icon={Heart}
        animation="heartbeat"
        className="text-rose-500"
        size={16}
      />
      <span>by our team</span>
    </div>
  </div>
));

CopyrightSection.displayName = 'CopyrightSection';

const PolicyLinks = React.memo(({ policyLinks, colors }) => (
  <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-inter">
    {policyLinks.map((policy, index) => (
      <Link 
        key={index}
        to={policy.path} 
        className={`${colors.textColor} hover:text-amber-600 transition-colors flex items-center`}
        // ✅ FIXED: Add prevent scroll reset
        state={{ preventScrollReset: true }}
      >
        {policy.icon && (
          <AnimatedIcon 
            icon={policy.icon}
            animation="pulse"
            className="mr-1"
            size={12}
          />
        )}
        {policy.label}
      </Link>
    ))}
  </div>
));

PolicyLinks.displayName = 'PolicyLinks';

const SectionHeader = ({ icon: Icon, title, animation, colors }) => {
  if (!Icon) return null;
  
  return (
    <div className="flex items-center space-x-2 mb-6">
      <AnimatedIcon 
        icon={Icon}
        animation={animation}
        className={colors.accentColor}
        size={18}
      />
      <h4 className={`text-sm font-semibold font-poppins ${colors.headingColor} uppercase`}>
        {title}
      </h4>
    </div>
  );
};

Footer.displayName = 'Footer';    
export default Footer;
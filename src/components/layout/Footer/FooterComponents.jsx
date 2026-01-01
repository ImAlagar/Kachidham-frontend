import React from 'react';
import AnimatedIcon from '../../Common/AnimatedIcon';
import { SOCIAL_MEDIA_COLORS } from '../../../constants/themeConstants';
import { Crown, Sparkles, Star } from 'lucide-react';

// Contact Item Component
export const ContactItem = React.memo(({ icon, title, content, animation, iconBgColor, accentColor, headingColor, textColor }) => (
  <li className="flex items-start space-x-3 mb-4">
    <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${iconBgColor}`}>
      <AnimatedIcon 
        icon={icon} 
        animation={animation} 
        className={accentColor}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`font-semibold text-sm font-poppins ${headingColor} mb-1`}>{title}</p>
      <p className={`text-sm font-inter ${textColor}`}>{content}</p>
    </div>
  </li>
));

ContactItem.displayName = 'ContactItem';

// Social Icon Component
export const SocialIcon = React.memo(({ icon: Icon, name, url, color, animation, theme, borderColor }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      p-3 rounded-xl transition-all duration-300 font-inter
      ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"}
      ${SOCIAL_MEDIA_COLORS[color] || ''} hover:text-white border ${borderColor} 
      shadow-sm hover:shadow-lg hover:scale-110 active:scale-95
    `}
    aria-label={name}
    // ✅ FIXED: Prevent scroll issues for external links
    onClick={(e) => e.stopPropagation()}
  >
    <Icon size={20} />
  </a>
));

SocialIcon.displayName = 'SocialIcon';

// Simple Link Component
export const SimpleLink = React.memo(({ children, onClick, icon: Icon, textColor, accentColor }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center space-x-2 text-sm font-inter ${textColor} hover:text-amber-600 transition py-2 w-full text-left group hover:translate-x-1 duration-300`}
    type="button"
  >
    <Icon size={14} className={`${accentColor} group-hover:scale-110 transition-transform`} />
    <span>{children}</span>
  </button>
));

SimpleLink.displayName = 'SimpleLink';

// Brand Logo Component
export const BrandLogo = React.memo(({ theme, iconBgColor, accentColor, headingColor, textColor }) => (
  <div className="flex items-center space-x-3 mb-6">
    <div className={`p-3 rounded-2xl ${iconBgColor} relative`}>
      <Crown className={accentColor} size={28} />
      <div className="absolute -top-1 -right-1">
        <Sparkles size={12} className="text-yellow-300" />
      </div>
    </div>
    <div>
      <h3 className={`text-2xl font-bold font-poppins ${headingColor}`}>kachidham Fashions</h3>
      <div className={`text-sm font-inter ${textColor} flex items-center`}>
        <Star size={12} className="text-amber-500 mr-1" fill="currentColor" />
        Premium Fashion & Elegance
      </div>
    </div>
  </div>
));

BrandLogo.displayName = 'BrandLogo';

// Explore Button Component
export const ExploreButton = React.memo(({ goldGradient, navigate }) => (
  <button
    className={`w-full py-3 rounded-lg font-medium font-poppins ${goldGradient} hover:opacity-90 text-white transition-all shadow-md hover:shadow-lg active:scale-95 duration-300`}
    onClick={(e) => {
      e.preventDefault();
      navigate("/shop", { 
        replace: false,
        state: { preventScrollReset: true }
      });
    }}
    type="button"
  >
    <span>Explore All Collections</span>
  </button>
));

ExploreButton.displayName = 'ExploreButton';
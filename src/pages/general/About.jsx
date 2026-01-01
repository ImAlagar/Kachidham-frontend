import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import AnimatedIcon from '../../components/Common/AnimatedIcon'
import { 
  PAGE_TRANSITIONS, 
  ICON_ANIMATIONS, 
  HOVER_ANIMATIONS 
} from '../../constants/animationConstants'
import { 
  Moon, 
  Sun, 
  Star, 
  Sparkles, 
  Shield, 
  Heart, 
  Leaf, 
  Package,
  ChevronRight,
  Sparkle,
  BedDouble,
  Users,
  Crown,
  ShoppingBag,
  Mail,
  TrendingUp,
  Award,
  Globe,
  Clock,
  Zap,
  Coffee,
  Moon as MoonIcon,
  Sunrise,
  Cloud,
  Droplets
} from 'lucide-react'

import video from "../../assets/videos/about-video.mp4"
import { Link } from 'react-router-dom'

const About = () => {
  const { theme, toggleTheme } = useTheme()

  const features = [
    {
      icon: Sparkles,
      title: "Luxurious Fabrics",
      description: "Premium materials for ultimate comfort",
      animation: "pulse"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Sustainable and responsibly sourced",
      animation: "float"
    },
    {
      icon: Heart,
      title: "Designed with Love",
      description: "Every piece crafted with care",
      animation: "heartbeat"
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Built to last with premium craftsmanship",
      animation: "glow"
    }
  ]

  const values = [
    {
      icon: Sparkle,
      text: "Comfort as a priority",
      animation: "shimmer"
    },
    {
      icon: BedDouble,
      text: "Restful sleep guaranteed",
      animation: "float"
    },
    {
      icon: Users,
      text: "Community focused",
      animation: "pulse"
    },
    {
      icon: Package,
      text: "Ethical packaging",
      animation: "rotateSlow"
    }
  ]

  const achievements = [
    {
      icon: Award,
      value: "10K+",
      label: "Happy Customers",
      color: "text-amber-500",
      animation: "heartbeat"
    },
    {
      icon: Globe,
      value: "50+",
      label: "Countries",
      color: "text-emerald-500",
      animation: "rotateSlow"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Satisfaction",
      color: "text-purple-500",
      animation: "pulse"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Support",
      color: "text-blue-500",
      animation: "shimmer"
    }
  ]

  const sleepRituals = [
    {
      icon: MoonIcon,
      title: "Moonlit Comfort",
      description: "Designed for your most peaceful nights",
      color: "text-indigo-400"
    },
    {
      icon: Sunrise,
      title: "Morning Refresh",
      description: "Wake up feeling rejuvenated",
      color: "text-orange-400"
    },
    {
      icon: Cloud,
      title: "Cloud-Like Softness",
      description: "Experience unmatched softness",
      color: "text-sky-400"
    },
    {
      icon: Droplets,
      title: "Breathable Fabrics",
      description: "Natural moisture-wicking materials",
      color: "text-cyan-400"
    }
  ]

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={PAGE_TRANSITIONS.page}
      className="min-h-screen bg-gradient-to-b from-primary/30 via-white to-primary/10 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={ICON_ANIMATIONS.float}
          className="absolute top-1/4 left-10 w-8 h-8 text-purple-300/20"
        >
          <Star size={32} />
        </motion.div>
        <motion.div 
          animate={ICON_ANIMATIONS.float}
          transition={{ delay: 0.5 }}
          className="absolute bottom-1/4 right-10 w-6 h-6 text-pink-300/20"
        >
          <Heart size={24} />
        </motion.div>
        <motion.div 
          animate={ICON_ANIMATIONS.float}
          transition={{ delay: 1 }}
          className="absolute top-1/3 right-1/4 w-4 h-4 text-blue-300/20"
        >
          <Sparkle size={16} />
        </motion.div>
      </div>

      {/* Header with Theme Toggle */}
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-end mb-8"
        >
          <motion.button
            whileHover={HOVER_ANIMATIONS.button}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-full bg-primary dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group backdrop-blur-sm bg-white/10 dark:bg-gray-800/50 border border-white/20"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <>
                <AnimatedIcon 
                  icon={Moon}
                  animation="pulse"
                  size={20}
                  className="text-gray-700 dark:text-gray-200"
                />
                <span className="font-ui text-sm text-gray-700 dark:text-gray-200 hidden sm:inline">Dark Mode</span>
              </>
            ) : (
              <>
                <AnimatedIcon 
                  icon={Sun}
                  animation="pulse"
                  size={20}
                  className="text-gray-200"
                />
                <span className="font-ui text-sm text-gray-200 hidden sm:inline">Light Mode</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={PAGE_TRANSITIONS.container}
          className="text-center mb-16 relative"
        >
          <motion.div 
            variants={PAGE_TRANSITIONS.item}
            className="inline-block mb-6"
          >
            <div className="relative">
              <motion.div 
                animate={ICON_ANIMATIONS.rotateSlow}
                className="absolute -inset-4"
              >
                <div className="w-full h-full border-2 border-purple-300/30 dark:border-purple-500/30 rounded-full"></div>
              </motion.div>
              <AnimatedIcon 
                icon={Crown}
                animation="glow"
                className="w-16 h-16 text-purple-500 dark:text-purple-400 mx-auto"
              />
            </div>
          </motion.div>
          
          <motion.h1 
            variants={PAGE_TRANSITIONS.item}
            className="font-heading text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            About <span className="text-purple-600 dark:text-purple-400">kachidham Fashions</span>
          </motion.h1>
          
          <motion.div 
            variants={PAGE_TRANSITIONS.item}
            className="inline-flex items-center gap-4 mb-8"
          >
            <AnimatedIcon 
              icon={Star}
              animation="float"
              className="text-amber-400"
              size={24}
              fill="currentColor"
            />
            <AnimatedIcon 
              icon={Star}
              animation="float"
              transition={{ delay: 0.2 }}
              className="text-amber-400"
              size={24}
              fill="currentColor"
            />
            <AnimatedIcon 
              icon={Star}
              animation="float"
              transition={{ delay: 0.4 }}
              className="text-amber-400"
              size={24}
              fill="currentColor"
            />
          </motion.div>
          
          <motion.p 
            variants={PAGE_TRANSITIONS.item}
            className="font-subheading text-xl md:text-2xl text-gray-600 dark:text-gray-300 italic max-w-3xl mx-auto"
          >
            Where dreams are woven into the fabric of night
          </motion.p>
        </motion.div>

        {/* Achievements Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={PAGE_TRANSITIONS.container}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {achievements.map((achievement, index) => (
            <motion.div 
              key={index}
              variants={PAGE_TRANSITIONS.item}
              whileHover={HOVER_ANIMATIONS.card}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <AnimatedIcon 
                    icon={achievement.icon}
                    animation={achievement.animation}
                    className={achievement.color}
                    size={32}
                  />
                </div>
                <div className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2">
                  {achievement.value}
                </div>
                <div className="text-sm font-ui text-gray-600 dark:text-gray-400">
                  {achievement.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Mission Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={PAGE_TRANSITIONS.scale}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-12 transition-all duration-300 hover:shadow-3xl border border-white/20"
          >
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={PAGE_TRANSITIONS.slideLeft}
              className="flex items-center gap-3 mb-6"
            >
              <div className="relative">
                <AnimatedIcon 
                  icon={Sparkles}
                  animation="glow"
                  className="w-8 h-8 text-purple-500 dark:text-purple-400"
                />
                <motion.div 
                  animate={ICON_ANIMATIONS.float}
                  className="absolute -top-1 -right-1"
                >
                  <Star size={12} className="text-yellow-300" />
                </motion.div>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-gray-900 dark:text-white">
                Our Mission
              </h2>
            </motion.div>
            
            <motion.p 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={PAGE_TRANSITIONS.fade}
              className="font-body text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
            >
              At kachidham Fashions, we believe that the night is a sacred time for restoration and dreams. 
              We craft nightwear that transforms bedtime into a luxurious ritual, combining 
              elegant design with unparalleled comfort. Each piece is thoughtfully designed 
              to make you feel beautiful, comfortable, and truly yourself.
            </motion.p>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={PAGE_TRANSITIONS.container}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              {values.map((value, index) => (
                <motion.div 
                  key={index} 
                  variants={PAGE_TRANSITIONS.item}
                  whileHover={HOVER_ANIMATIONS.card}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <AnimatedIcon 
                    icon={value.icon}
                    animation={value.animation}
                    className="text-purple-500 dark:text-purple-400"
                  />
                  <span className="font-ui text-sm text-gray-600 dark:text-gray-400">
                    {value.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={PAGE_TRANSITIONS.container}
            className="mb-16"
          >
            <motion.h2 
              variants={PAGE_TRANSITIONS.item}
              className="font-heading text-3xl md:text-4xl text-center text-gray-900 dark:text-white mb-12"
            >
              Why Choose kachidham Fashions
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={PAGE_TRANSITIONS.item}
                  whileHover={HOVER_ANIMATIONS.card}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                >
                  <motion.div 
                    whileHover={HOVER_ANIMATIONS.icon}
                    className="mb-4"
                  >
                    <AnimatedIcon 
                      icon={feature.icon}
                      animation={feature.animation}
                      className="w-10 h-10 text-purple-500 dark:text-purple-400"
                    />
                  </motion.div>
                  <h3 className="font-subheading text-xl text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Story Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={PAGE_TRANSITIONS.container}
            className="grid md:grid-cols-2 gap-12 items-center mb-16"
          >

            {/* LEFT SIDE — TEXT CONTENT */}
            <motion.div variants={PAGE_TRANSITIONS.slideRight}>
              <div className="flex items-center gap-3 mb-6">
                <AnimatedIcon 
                  icon={Coffee}
                  animation="float"
                  className="w-8 h-8 text-amber-500"
                />
                <h2 className="font-heading text-3xl md:text-4xl text-gray-900 dark:text-white">
                  Our Story
                </h2>
              </div>

              <div className="space-y-4">
                <motion.p variants={PAGE_TRANSITIONS.item} className="font-body text-gray-700 dark:text-gray-300">
                  Founded with a vision to redefine nighttime luxury, kachidham Fashions began as a 
                  simple idea: why should beautiful, comfortable nightwear be a luxury?
                </motion.p>

                <motion.p variants={PAGE_TRANSITIONS.item} className="font-body text-gray-700 dark:text-gray-300">
                  We started with locally sourced fabrics and a small collection, growing 
                  through word-of-mouth recommendations from customers who experienced 
                  the difference quality sleepwear makes.
                </motion.p>

                <motion.button 
                  whileHover={HOVER_ANIMATIONS.button}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white font-ui rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  <AnimatedIcon 
                    icon={ShoppingBag}
                    animation="shimmer"
                    size={20}
                  />
                   <Link to={'/shop'}>Explore Collections</Link>
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>

            {/* RIGHT SIDE — VIDEO SECTION */}
            <motion.div 
              variants={PAGE_TRANSITIONS.slideLeft}
              className="relative"
            >
              {/* VIDEO CONTAINER */}
              <motion.div
                whileHover={HOVER_ANIMATIONS.image}
                className="aspect-square rounded-3xl overflow-hidden shadow-xl bg-black"
              >
                <video
                  src={video}  // ← replace with your video path
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* TOP RIGHT FLOATING ICON */}
              <motion.div 
                animate={ICON_ANIMATIONS.bounce}
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <AnimatedIcon 
                  icon={Heart}
                  animation="heartbeat"
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                />
              </motion.div>

              {/* BOTTOM LEFT FLOATING ICON */}
              <motion.div 
                animate={ICON_ANIMATIONS.float}
                className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
              >
                <AnimatedIcon 
                  icon={Zap}
                  animation="pulse"
                  className="w-8 h-8 text-white"
                />
              </motion.div>
            </motion.div>

          </motion.div>


          {/* Sleep Rituals Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={PAGE_TRANSITIONS.container}
            className="mb-16"
          >
            <motion.h2 
              variants={PAGE_TRANSITIONS.item}
              className="font-heading text-3xl md:text-4xl text-center text-gray-900 dark:text-white mb-12"
            >
              The kachidham Fashions Sleep Ritual
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sleepRituals.map((ritual, index) => (
                <motion.div 
                  key={index}
                  variants={PAGE_TRANSITIONS.item}
                  whileHover={HOVER_ANIMATIONS.card}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 text-center"
                >
                  <motion.div 
                    whileHover={HOVER_ANIMATIONS.icon}
                    className="mb-4"
                  >
                    <AnimatedIcon 
                      icon={ritual.icon}
                      animation="float"
                      className={`w-10 h-10 ${ritual.color}`}
                    />
                  </motion.div>
                  <h3 className="font-subheading text-lg text-gray-900 dark:text-white mb-2">
                    {ritual.title}
                  </h3>
                  <p className="font-body text-sm text-gray-600 dark:text-gray-400">
                    {ritual.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={PAGE_TRANSITIONS.fade}
            className="text-center py-12 relative"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-purple-500/20 rounded-3xl -m-4"></div>
            
            <div className="relative z-10">
              <motion.div 
                animate={ICON_ANIMATIONS.shimmer}
                className="inline-flex items-center gap-2 mb-4"
              >
                <AnimatedIcon 
                  icon={Star}
                  animation="float"
                  className="text-purple-500 dark:text-purple-400"
                  size={24}
                  fill="currentColor"
                />
                <AnimatedIcon 
                  icon={Star}
                  animation="float"
                  transition={{ delay: 0.2 }}
                  className="text-pink-500 dark:text-pink-400"
                  size={24}
                />
                <AnimatedIcon 
                  icon={Star}
                  animation="float"
                  transition={{ delay: 0.4 }}
                  className="text-purple-500 dark:text-purple-400"
                  size={24}
                  fill="currentColor"
                />
              </motion.div>
              
              <h3 className="font-heading text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
                Experience the kachidham Fashions Difference
              </h3>
              
              <p className="font-body text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Join thousands of women who have transformed their sleep experience 
                with our thoughtfully designed nightwear collection.
              </p>
              
              <motion.button 
                whileHover={HOVER_ANIMATIONS.button}
                whileTap={{ scale: 0.95 }}
                animate={ICON_ANIMATIONS.glow}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 dark:from-purple-600 dark:via-pink-600 dark:to-purple-600 dark:hover:from-purple-700 dark:hover:via-pink-700 dark:hover:to-purple-700 text-white font-ui rounded-full transition-all duration-300 hover:shadow-2xl shadow-lg backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <AnimatedIcon 
                    icon={Sparkles}
                    animation="pulse"
                    size={20}
                  />
                  <Link to={'/shop'}>Shop Now</Link>
                  <AnimatedIcon 
                    icon={ShoppingBag}
                    animation="shimmer"
                    size={20}
                  />
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default About
import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='relative w-full h-[85vh] min-h-[600px] flex items-center justify-center bg-white mt-4 mb-16'>
      
      <div className='relative z-10 flex flex-col md:flex-row items-center w-full max-w-7xl mx-auto h-full px-6 sm:px-12 lg:px-20'>
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center py-10 md:py-0 md:pr-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4"
          >
            <p className='font-semibold text-xs md:text-sm tracking-widest text-[#333333] uppercase'>Our Bestsellers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="overflow-hidden"
          >
            <h1 className='font-sans font-medium text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-[#111111] mb-6'>
              Elevate your <br/>
              everyday.
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='text-gray-500 text-lg mb-10 max-w-md leading-relaxed'
          >
            Discover our latest collection of premium essentials designed for the modern lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link 
              to="/collection"
              className='inline-flex items-center gap-3 bg-[#111111] text-white px-8 py-4 rounded-full font-medium hover:bg-black transition-all group'
            >
              <span className='tracking-wide'>Shop Collection</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='w-full md:w-1/2 h-[50vh] md:h-[80%] relative hidden md:block'
        >
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(17,17,17,0.1)]">
            <img 
              className='w-full h-full object-cover object-center' 
              src={assets.hero_img} 
              alt="Latest Arrivals" 
            />
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Hero

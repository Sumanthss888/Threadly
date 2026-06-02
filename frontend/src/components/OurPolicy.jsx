import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { RefreshCw, CheckCircle, Headphones } from 'lucide-react'

const OurPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-6 text-center py-20'
    >
      
      <motion.div variants={itemVariants} className='flex flex-col items-center group'>
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 text-apple-textMuted group-hover:bg-apple-text group-hover:text-white transition-colors duration-300 shadow-apple-sm">
            <RefreshCw size={28} strokeWidth={1.5} />
        </div>
        <p className='font-semibold text-apple-text mb-1'>Easy Exchange Policy</p>
        <p className='text-apple-textMuted text-sm'>We offer a seamless exchange experience</p>
      </motion.div>

      <motion.div variants={itemVariants} className='flex flex-col items-center group'>
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 text-apple-textMuted group-hover:bg-apple-text group-hover:text-white transition-colors duration-300 shadow-apple-sm">
            <CheckCircle size={28} strokeWidth={1.5} />
        </div>
        <p className='font-semibold text-apple-text mb-1'>7 Days Return Policy</p>
        <p className='text-apple-textMuted text-sm'>Free returns within 7 days of delivery</p>
      </motion.div>

      <motion.div variants={itemVariants} className='flex flex-col items-center group'>
        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 text-apple-textMuted group-hover:bg-apple-text group-hover:text-white transition-colors duration-300 shadow-apple-sm">
            <Headphones size={28} strokeWidth={1.5} />
        </div>
        <p className='font-semibold text-apple-text mb-1'>Premium Support</p>
        <p className='text-apple-textMuted text-sm'>24/7 dedicated customer service</p>
      </motion.div>

    </motion.div>
  )
}

export default OurPolicy

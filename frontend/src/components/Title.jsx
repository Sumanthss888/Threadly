import React from 'react'
import { motion } from 'framer-motion'

const Title = ({text1, text2}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className='inline-flex gap-3 items-center mb-6'
    >
      <h2 className='text-3xl sm:text-4xl font-light text-apple-textMuted tracking-tight'>
        {text1} <span className='text-apple-text font-medium'>{text2}</span>
      </h2>
      <div className='w-12 sm:w-20 h-[2px] bg-apple-blue rounded-full opacity-80'></div>
    </motion.div>
  )
}

export default Title

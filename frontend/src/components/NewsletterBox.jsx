import React from 'react'
import { motion } from 'framer-motion'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='text-center py-20'
    >
      <div className='max-w-2xl mx-auto bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-apple-sm'>
        <h3 className='text-3xl font-medium text-apple-text mb-4'>Stay in the loop</h3>
        <p className='text-apple-textMuted text-lg mb-8'>
          Subscribe to receive updates, access to exclusive deals, and more.
        </p>
        <form onSubmit={onSubmitHandler} className='w-full flex flex-col sm:flex-row items-center gap-3'>
          <input 
            className='w-full flex-1 px-6 py-4 rounded-full border border-gray-200 outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue transition-all bg-white text-apple-text shadow-sm' 
            type="email" 
            placeholder='Enter your email address' 
            required
          />
          <button type='submit' className='w-full sm:w-auto bg-apple-text text-white font-medium px-8 py-4 rounded-full hover:bg-black transition-all shadow-md hover:shadow-apple-md hover:-translate-y-0.5 active:translate-y-0'>
            Subscribe
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default NewsletterBox

import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='border-t border-apple-border/30 pt-10 mt-20'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mb-10 text-sm'>

        <div>
            <img src={assets.logo} className='mb-6 w-32 mix-blend-multiply' alt="" />
            <p className='w-full md:w-2/3 text-apple-textMuted leading-relaxed'>
            Elevating your everyday style with premium essentials. Crafted with precision, designed for modern living.
            </p>
        </div>

        <div>
            <p className='text-lg font-medium mb-6 text-apple-text'>COMPANY</p>
            <ul className='flex flex-col gap-3 text-apple-textMuted'>
                <li className='hover:text-apple-text cursor-pointer transition-colors'>Home</li>
                <li className='hover:text-apple-text cursor-pointer transition-colors'>About us</li>
                <li className='hover:text-apple-text cursor-pointer transition-colors'>Delivery</li>
                <li className='hover:text-apple-text cursor-pointer transition-colors'>Privacy policy</li>
            </ul>
        </div>

        <div>
            <p className='text-lg font-medium mb-6 text-apple-text'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-3 text-apple-textMuted'>
                <li className='hover:text-apple-text cursor-pointer transition-colors'>+1-212-456-7890</li>
                <li className='hover:text-apple-text cursor-pointer transition-colors'>hello@threadly.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr className='border-apple-border/30' />
            <p className='py-6 text-sm text-center text-apple-textMuted'>Copyright 2024 @ threadly.com - All Rights Reserved.</p>
        </div>

    </div>
  )
}

export default Footer

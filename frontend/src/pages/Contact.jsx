import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px] object-cover rounded-2xl shadow-apple-md' src={assets.contact_img} alt="Contact Threadly" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-apple-text'>Our Studio</p>
          <p className=' text-apple-textMuted'>54709 Design District <br /> Suite 350, New York, USA</p>
          <p className=' text-apple-textMuted'>Tel: (415) 555-0132 <br /> Email: hello@threadly.com</p>
          <p className='font-semibold text-xl text-apple-text'>Careers at Threadly</p>
          <p className=' text-apple-textMuted'>Learn more about our teams and job openings.</p>
          <button className='border border-apple-border px-8 py-4 text-sm font-medium rounded-full text-apple-text hover:bg-black hover:text-white hover:shadow-apple-md transition-all duration-300'>Explore Opportunities</button>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact

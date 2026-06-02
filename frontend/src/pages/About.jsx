import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px] object-cover rounded-2xl shadow-apple-md' src={assets.about_img} alt="About Threadly" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-apple-textMuted'>
              <p>Threadly was born from a singular vision: to redefine modern fashion by combining timeless elegance with contemporary design. Our journey began with a dedication to craftsmanship, ensuring every piece tells a story of quality and refined taste.</p>
              <p>Since our inception, we have meticulously curated collections that transcend fast fashion. From elevated everyday essentials to statement pieces, Threadly focuses on sustainable, high-quality garments that become the cornerstone of your personal style.</p>
              <b className='text-apple-text text-lg mt-2'>Our Mission</b>
              <p>At Threadly, our mission is to empower individuals to express their unique identity through thoughtfully designed clothing. We are dedicated to providing a seamless, premium shopping experience—where impeccable style meets uncompromising quality.</p>
          </div>
      </div>

      <div className=' text-xl py-4 mt-10'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-6'>
          <div className='border border-apple-border/50 rounded-2xl px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 hover:shadow-apple-md transition-shadow bg-gray-50'>
            <b className='text-apple-text'>Premium Quality:</b>
            <p className=' text-apple-textMuted'>We source only the finest materials, ensuring every garment offers exceptional durability and a luxurious feel.</p>
          </div>
          <div className='border border-apple-border/50 rounded-2xl px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 hover:shadow-apple-md transition-shadow bg-gray-50'>
            <b className='text-apple-text'>Curated Collections:</b>
            <p className=' text-apple-textMuted'>Our design team carefully crafts seasonal collections that blend modern trends with enduring elegance.</p>
          </div>
          <div className='border border-apple-border/50 rounded-2xl px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 hover:shadow-apple-md transition-shadow bg-gray-50'>
            <b className='text-apple-text'>Exceptional Service:</b>
            <p className=' text-apple-textMuted'>From personalized styling advice to seamless returns, our dedicated team is here to elevate your shopping experience.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About

import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Link onClick={() => scrollTo(0, 0)} className='group block' to={`/product/${id}`}>
                <div className='relative overflow-hidden rounded-2xl bg-gray-50 aspect-[4/5] mb-4'>
                    <img 
                        className='w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105' 
                        src={image[0]} 
                        alt={name} 
                    />
                    {/* Subtle inner shadow overlay */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
                </div>
                <div className="px-1 flex flex-col gap-1">
                    <h3 className='text-apple-text font-medium text-base truncate group-hover:text-apple-blue transition-colors'>{name}</h3>
                    <p className='text-apple-textMuted text-sm font-medium tracking-wide'>{currency}{price}</p>
                </div>
            </Link>
        </motion.div>
    )
}

export default ProductItem

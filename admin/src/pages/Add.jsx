import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setSizes([])
        setBestseller(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])
  }

  return (
    <div className="max-w-2xl bg-white/70 backdrop-blur-md border border-apple-border/40 p-8 rounded-[2rem] shadow-apple-sm">
      <h2 className="text-xl font-semibold tracking-tight text-apple-text mb-6">Create New Listing</h2>
      
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
        
        {/* Image Upload section */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Product Images</p>
          <div className="flex gap-4">
            {[
              { id: 'image1', val: image1, setter: setImage1 },
              { id: 'image2', val: image2, setter: setImage2 },
              { id: 'image3', val: image3, setter: setImage3 },
              { id: 'image4', val: image4, setter: setImage4 }
            ].map(img => (
              <label key={img.id} htmlFor={img.id} className="cursor-pointer group relative">
                <div className="w-20 h-20 rounded-xl border border-dashed border-apple-border flex items-center justify-center bg-apple-background hover:bg-apple-background/50 transition-all overflow-hidden">
                  {img.val ? (
                    <img className="w-full h-full object-cover" src={URL.createObjectURL(img.val)} alt="" />
                  ) : (
                    <img className="w-6 opacity-30 group-hover:opacity-50 transition-opacity" src={assets.upload_area} alt="" />
                  )}
                </div>
                <input onChange={(e) => img.setter(e.target.files[0])} type="file" id={img.id} hidden />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Product Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-4 py-3 rounded-xl border border-apple-border bg-white text-[14px] outline-none"
            type="text"
            placeholder="e.g. Silk Cotton Blazer"
            required
          />
        </div>

        {/* Product Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Product Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-4 py-3 rounded-xl border border-apple-border bg-white text-[14px] outline-none min-h-[100px] resize-y"
            placeholder="Write detailing materials, cut, fit and look..."
            required
          />
        </div>

        {/* Category, Subcategory, Price grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-4 py-3 rounded-xl border border-apple-border bg-white text-[14px]"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Subcategory</label>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full px-4 py-3 rounded-xl border border-apple-border bg-white text-[14px]"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Price (USD)</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-4 py-3 rounded-xl border border-apple-border bg-white text-[14px]"
              type="number"
              placeholder="99"
              required
            />
          </div>
        </div>

        {/* Product Sizes */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider block">Available Sizes</label>
          <div className="flex gap-2.5">
            {["S", "M", "L", "XL", "XXL"].map(size => {
              const isSelected = sizes.includes(size)
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`w-11 h-11 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                    isSelected
                      ? 'bg-threadly-gold/15 text-threadly-gold border-threadly-gold/30 shadow-apple-sm'
                      : 'bg-apple-background text-apple-textMuted border-apple-border hover:bg-apple-background/50'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bestseller toggle */}
        <div className="flex items-center gap-3 py-2">
          <input
            onChange={() => setBestseller(prev => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
            className="w-4 h-4 rounded text-threadly-gold border-apple-border focus:ring-threadly-gold"
          />
          <label className="text-sm font-medium text-apple-text cursor-pointer select-none" htmlFor="bestseller">
            Promote to Bestseller
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-40 bg-[#1D1D1F] hover:bg-black text-white py-3.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-apple-sm hover:shadow-apple-md hover:-translate-y-[1px] disabled:opacity-50 disabled:translate-y-0"
        >
          {isSubmitting ? 'Creating...' : 'Publish Product'}
        </button>

      </form>
    </div>
  )
}

export default Add
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchList = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="bg-white/70 backdrop-blur-md border border-apple-border/40 p-8 rounded-[2rem] shadow-apple-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-apple-text">Product Catalog</h2>
          <p className="text-xs text-apple-textMuted mt-1">Manage and inspect all public storefront items.</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-apple-background border border-apple-border/40 rounded-full text-apple-text">
          {list.length} {list.length === 1 ? 'Product' : 'Products'}
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-6 h-6 border-2 border-threadly-gold/20 border-t-threadly-gold rounded-full animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-apple-border rounded-xl">
          <p className="text-sm text-apple-textMuted">No products found in catalog.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-apple-border/40 text-xs font-semibold text-apple-textMuted uppercase tracking-wider">
                <th className="py-4 px-2">Image</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-border/20">
              {list.map((item, index) => (
                <tr key={item._id || index} className="group hover:bg-apple-background/30 transition-colors">
                  <td className="py-4 px-2">
                    <div className="w-12 h-12 rounded-lg border border-apple-border/40 bg-apple-background overflow-hidden flex items-center justify-center">
                      <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" src={item.image[0]} alt="" />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-apple-text">{item.name}</td>
                  <td className="py-4 px-4 text-sm text-apple-textMuted">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-apple-background text-[11px] font-medium border border-apple-border/30">
                      {item.category} • {item.subCategory}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-apple-text">{currency}{item.price}</td>
                  <td className="py-4 px-2 text-center">
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors inline-flex items-center justify-center"
                      title="Remove product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default List
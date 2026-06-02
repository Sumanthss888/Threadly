import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-apple-border/40 hidden md:block">
      <div className="flex flex-col gap-2 p-6">
        
        {/* Add Items Link */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide text-apple-textMuted transition-all duration-200 hover:bg-apple-background hover:text-apple-text ${
              isActive ? 'bg-threadly-gold/5 text-threadly-gold border border-threadly-gold/20 shadow-apple-sm' : 'border border-transparent'
            }`
          }
          to="/add"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Product</span>
        </NavLink>

        {/* List Items Link */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide text-apple-textMuted transition-all duration-200 hover:bg-apple-background hover:text-apple-text ${
              isActive ? 'bg-threadly-gold/5 text-threadly-gold border border-threadly-gold/20 shadow-apple-sm' : 'border border-transparent'
            }`
          }
          to="/list"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Product Catalog</span>
        </NavLink>

        {/* Orders Link */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide text-apple-textMuted transition-all duration-200 hover:bg-apple-background hover:text-apple-text ${
              isActive ? 'bg-threadly-gold/5 text-threadly-gold border border-threadly-gold/20 shadow-apple-sm' : 'border border-transparent'
            }`
          }
          to="/orders"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Manage Orders</span>
        </NavLink>

      </div>
    </aside>
  )
}

export default Sidebar
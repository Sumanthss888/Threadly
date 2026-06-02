import React from 'react'
import logo from '../assets/logo.png'

const Navbar = ({ setToken }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-apple-border/40 shadow-apple-sm">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Badge */}
        <div className="flex items-center gap-3">
          <img className="h-8 object-contain" src={logo} alt="Threadly Logo" />
          <div className="h-4 w-[1px] bg-apple-border" />
          <span className="text-[11px] font-semibold tracking-wider text-threadly-gold uppercase bg-threadly-gold/5 px-2.5 py-1 rounded-full">
            Admin Panel
          </span>
        </div>

        {/* Right Side: Logout Button */}
        <button
          onClick={() => setToken('')}
          className="bg-[#1D1D1F] hover:bg-black text-white px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all hover:shadow-apple-sm active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
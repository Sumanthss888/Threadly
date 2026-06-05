import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import logo from '../assets/logo.png'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
        toast.success("Welcome back, Administrator")
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

  return (
    <div className="min-h-screen relative flex items-center justify-center w-full bg-[#FAF9F6] overflow-hidden">
      {/* Background soft ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-threadly-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1D1D1F]/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Glass Card */}
        <div className="bg-white/85 backdrop-blur-xl border border-white/40 shadow-apple-lg rounded-[2rem] p-10 flex flex-col items-center">
          
          {/* Logo */}
          <div className="mb-8 mt-2">
            <img src={logo} alt="Threadly Admin" className="h-9 object-contain" />
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-apple-text font-sans">
              Admin Portal
            </h1>
            <p className="text-xs text-apple-textMuted mt-1">
              Secure credentials required for system access.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="w-full space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-wider text-apple-textMuted uppercase">
                Email Address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-3 rounded-xl border border-apple-border bg-white/50 text-[14px] outline-none transition-all focus:border-threadly-gold focus:bg-white"
                type="email"
                placeholder="sumanthss308@gmail.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-wider text-apple-textMuted uppercase">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-3 rounded-xl border border-apple-border bg-white/50 text-[14px] outline-none transition-all focus:border-threadly-gold focus:bg-white"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1D1D1F] hover:bg-black text-white py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300 shadow-apple-sm hover:shadow-apple-md hover:-translate-y-[1px] disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? 'Verifying access...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
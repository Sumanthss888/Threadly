import React, { useContext } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ShopContext } from './context/ShopContext'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
// import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import Profile from './pages/Profile'

const App = () => {
  const location = useLocation();
  const { token } = useContext(ShopContext);
  const isAuthPage = location.pathname === '/login';
  const isLandingPage = location.pathname === '/' && !token;

  return (
    <div className='min-h-screen flex flex-col bg-apple-background text-apple-text font-sans'>
      <ToastContainer />
      {!isAuthPage && !isLandingPage && <Navbar />}
      {!isAuthPage && !isLandingPage && <SearchBar />}
      <main className={`flex-grow w-full ${isAuthPage || isLandingPage ? '' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={token ? <Home /> : <Landing />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Navigate to="/" replace />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAuthPage && !isLandingPage && (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <Footer />
        </div>
      )}
    </div>
  )
}

export default App

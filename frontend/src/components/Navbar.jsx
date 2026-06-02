import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, ShoppingBag, Menu, X, ChevronLeft } from 'lucide-react'

const Tab = ({ children, setPosition, path }) => {
    const ref = useRef(null);
    return (
        <li
            ref={ref}
            onMouseEnter={() => {
                if (!ref.current) return;
                const { width } = ref.current.getBoundingClientRect();
                setPosition({
                    width,
                    opacity: 1,
                    left: ref.current.offsetLeft,
                });
            }}
            className="relative z-10 block"
        >
            <NavLink 
                to={path} 
                className={({isActive}) => `relative block px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${isActive ? 'text-apple-text' : 'text-apple-textMuted hover:text-apple-text'}`}
            >
                {({ isActive }) => (
                    <>
                        {children}
                        {isActive && (
                            <motion.div 
                                layoutId="nav-underline"
                                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-apple-text rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </>
                )}
            </NavLink>
        </li>
    );
};

const Cursor = ({ position }) => {
    return (
        <motion.li
            animate={{
                left: position.left,
                width: position.width,
                opacity: position.opacity,
            }}
            className="absolute z-0 h-full rounded-full bg-black/5 top-0"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
    );
};

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
    const location = useLocation();

    // State for the sliding pill cursor
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0,
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        navigate('/')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    const navLinks = [
        { path: '/', label: 'HOME' },
        { path: '/collection', label: 'COLLECTION' },
        { path: '/about', label: 'ABOUT' },
        { path: '/contact', label: 'CONTACT' },
    ];

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`sticky top-0 z-50 transition-all duration-300 bg-white border-b border-apple-border/20 h-16 sm:h-20 flex items-center px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] ${scrolled ? 'shadow-sm' : ''}`}
        >
            <div className='w-full flex items-center justify-between font-medium'>
                
                {/* Left Side: Logo */}
                <div className='w-1/4 flex justify-start'>
                    <Link to='/' className="relative z-10 flex items-center">
                        <img src={assets.logo} className='h-8 sm:h-10 w-auto mix-blend-multiply transition-opacity hover:opacity-80' alt="Threadly Logo" />
                    </Link>
                </div>

                {/* Center: Nav Links */}
                <div className='w-2/4 flex justify-center'>
                    <ul 
                        className='hidden md:flex relative items-center rounded-full p-1 gap-2'
                        onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
                    >
                        {navLinks.map((link) => (
                            <Tab 
                                key={link.path} 
                                path={link.path} 
                                setPosition={setPosition}
                            >
                                {link.label}
                            </Tab>
                        ))}
                        <Cursor position={position} />
                    </ul>
                </div>

                {/* Right Side: Icons */}
                <div className='w-1/4 flex justify-end items-center gap-5 md:gap-7 relative z-10'>
                    <motion.button 
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setShowSearch(true); navigate('/collection') }} 
                        className="text-apple-textMuted hover:text-apple-text transition-colors"
                    >
                        <Search size={22} strokeWidth={1.25} />
                    </motion.button>
                    
                    <div className='group relative'>
                        <motion.button 
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => token ? null : navigate('/')} 
                            className="text-apple-textMuted hover:text-apple-text transition-colors"
                        >
                            <User size={22} strokeWidth={1.25} />
                        </motion.button>
                        {token && 
                        <div className='group-hover:block hidden absolute right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-40 py-3 px-4 bg-white/90 backdrop-blur-xl border border-white/20 shadow-apple-md rounded-xl text-apple-textMuted text-sm'>
                                <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-apple-text transition-colors'>My Profile</p>
                                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-apple-text transition-colors'>Orders</p>
                                <p onClick={logout} className='cursor-pointer text-red-500 hover:text-red-600 transition-colors'>Logout</p>
                            </div>
                        </div>}
                    </div> 
                    
                    <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                        <Link to='/cart' className='relative block text-apple-textMuted hover:text-apple-text transition-colors'>
                            <ShoppingBag size={22} strokeWidth={1.25} />
                            {getCartCount() > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className='absolute -right-2 -bottom-2 w-4 text-center leading-4 bg-apple-text text-white aspect-square rounded-full text-[9px] font-bold shadow-sm'
                                >
                                    {getCartCount()}
                                </motion.span>
                            )}
                        </Link> 
                    </motion.div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setVisible(true)} 
                        className='sm:hidden text-apple-textMuted hover:text-apple-text transition-colors'
                    >
                         <Menu size={24} strokeWidth={1.25} />
                    </motion.button> 
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {visible && (
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className='fixed top-0 right-0 bottom-0 w-full bg-apple-surface/95 backdrop-blur-2xl z-50 overflow-hidden flex flex-col'
                        >
                            <div className='flex items-center justify-between p-5 border-b border-apple-border/50'>
                                <button onClick={() => setVisible(false)} className='flex items-center gap-2 text-apple-textMuted hover:text-apple-text transition-colors'>
                                    <ChevronLeft size={20} />
                                    <span className="font-medium">Back</span>
                                </button>
                                <button onClick={() => setVisible(false)} className='text-apple-textMuted hover:text-apple-text transition-colors'>
                                    <X size={24} />
                                </button>
                            </div>
                            <div className='flex flex-col text-lg font-medium p-5 gap-4'>
                                {navLinks.map((link) => (
                                    <NavLink 
                                        key={link.path}
                                        onClick={() => setVisible(false)} 
                                        className={({isActive}) => `py-3 border-b border-apple-border/20 transition-colors ${isActive ? 'text-apple-text' : 'text-apple-textMuted'}`}
                                        to={link.path}
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    )
}

export default Navbar

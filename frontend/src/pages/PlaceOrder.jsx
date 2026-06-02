import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const [showRazorpayMock, setShowRazorpayMock] = useState(false)
    const [currentOrder, setCurrentOrder] = useState(null)

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
        const isDummy = !key || key.includes('Paste') || key.includes('dummy') || key.includes('123');

        if (isDummy || !window.Razorpay) {
            console.log("ℹ️ Simulator Mode active for Razorpay.");
            setCurrentOrder(order);
            setShowRazorpayMock(true);
            return;
        }

        const options = {
            key: key,
            amount: order.amount,
            currency: order.currency,
            name: 'Threadly Secure Checkout',
            description: 'Order Payment Session',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response)
                try {
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
                    if (data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(data.message || "Verification failed")
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message || error)
                }
            }
        }
        try {
            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (err) {
            console.log("⚠️ Razorpay SDK open failed. Falling back to simulator...", err.message);
            setCurrentOrder(order);
            setShowRazorpayMock(true);
        }
    }

    const handleMockPaymentSuccess = async () => {
        if (!currentOrder) return;
        try {
            const mockResponse = {
                razorpay_payment_id: "pay_mock_" + Date.now(),
                razorpay_order_id: currentOrder.id,
                razorpay_signature: "sig_mock_" + Date.now()
            };
            const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', mockResponse, { headers: { token } });
            if (data.success) {
                toast.success("Simulated Razorpay Payment Successful!");
                setCartItems({});
                setShowRazorpayMock(false);
                navigate('/orders');
            } else {
                toast.error(data.message || "Verification failed");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Simulation verification failed");
        }
    }

    const handleMockPaymentCancel = () => {
        toast.info("Simulated Razorpay Payment Cancelled");
        setShowRazorpayMock(false);
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {
                // API Calls for COD
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                case 'stripe':
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data
                        window.location.replace(session_url)
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;

                case 'razorpay':
                    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order)
                    } else {
                        toast.error(responseRazorpay.data.message)
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div className="relative">
            <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
                {/* ------------- Left Side ---------------- */}
                <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                    <div className='text-xl sm:text-2xl my-3'>
                        <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                    </div>
                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                        <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                    </div>
                    <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                    <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                        <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                    </div>
                    <div className='flex gap-3'>
                        <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                        <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                    </div>
                    <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
                </div>

                {/* ------------- Right Side ------------------ */}
                <div className='mt-8'>
                    <div className='mt-8 min-w-80'>
                        <CartTotal />
                    </div>

                    <div className='mt-12'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                        {/* --------------- Payment Method Selection ------------- */}
                        <div className='flex gap-3 flex-col lg:flex-row'>
                            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                                <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                            </div>
                            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                                <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                            </div>
                            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                                <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                            </div>
                        </div>

                        <div className='w-full text-end mt-8'>
                            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Razorpay Simulation Modal */}
            {showRazorpayMock && currentOrder && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm">
                    <div className="bg-white max-w-sm w-full mx-4 rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="bg-[#0b192c] p-6 text-center text-white flex flex-col items-center">
                            <img className="h-5 mb-3 brightness-0 invert" src={assets.razorpay_logo} alt="Razorpay" />
                            <span className="text-[10px] uppercase tracking-wider font-semibold bg-blue-500/20 text-blue-300 px-3.5 py-1 rounded-full">
                                Test Gateway Simulator
                            </span>
                        </div>

                        {/* Details Panel */}
                        <div className="p-8 text-center space-y-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Amount to Pay</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {currentOrder.currency === 'INR' ? '₹' : '$'}{(currentOrder.amount / 100).toFixed(2)}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left space-y-1.5 text-xs text-gray-500">
                                <div className="flex justify-between">
                                    <span>Transaction ID:</span>
                                    <span className="font-mono text-gray-800 select-all">{currentOrder.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Receipt ID:</span>
                                    <span className="font-mono text-gray-800 select-all">{currentOrder.receipt}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleMockPaymentSuccess}
                                    className="w-full bg-[#111] hover:bg-black text-white py-3.5 rounded-2xl font-medium text-sm transition-all hover:shadow-lg"
                                >
                                    Simulate Success Payment
                                </button>
                                <button
                                    onClick={handleMockPaymentCancel}
                                    className="w-full text-gray-400 hover:text-gray-600 py-2.5 rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all"
                                >
                                    Cancel & Fail Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlaceOrder

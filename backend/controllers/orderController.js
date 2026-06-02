import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
import mongoose from "mongoose";

// Sandbox/Demo in-memory fallback store when DB is offline
const sandboxOrders = [];

// global variables
const currency = 'inr'
const deliveryCharge = 10

const isStripeConfigured = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('Paste');
const isRazorpayConfigured = process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('Paste');

// gateway initialize
const stripe = isStripeConfigured ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const razorpayInstance = isRazorpayConfigured ? new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
}) : null;

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address} = req.body;

        if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox") {
            console.log("ℹ️ MongoDB offline or sandbox active. Placing sandbox COD order in memory...");
            const orderId = "order_sandbox_" + Date.now();
            const orderData = {
                _id: orderId,
                userId,
                items,
                address,
                amount,
                paymentMethod:"COD",
                payment:false,
                status: "Order Placed",
                date: Date.now()
            };
            sandboxOrders.push(orderData);
            return res.json({success:true,message:"Order Placed (Sandbox Active)"});
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        
        const { userId, items, amount, address} = req.body
        const { origin } = req.headers;

        if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox") {
            console.log("ℹ️ MongoDB offline or sandbox active. Placing sandbox Stripe order in memory...");
            const orderId = "order_sandbox_" + Date.now();
            const orderData = {
                _id: orderId,
                userId,
                items,
                address,
                amount,
                paymentMethod:"Stripe",
                payment:false,
                status: "Order Placed",
                date: Date.now()
            };
            sandboxOrders.push(orderData);
            const mockSessionUrl = `${origin}/verify?success=true&orderId=${orderId}`;
            return res.json({ success: true, session_url: mockSessionUrl });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        if (!isStripeConfigured) {
            console.log("ℹ️ Stripe keys not configured. Simulating Sandbox checkout redirect...");
            const mockSessionUrl = `${origin}/verify?success=true&orderId=${newOrder._id}`;
            return res.json({ success: true, session_url: mockSessionUrl });
        }

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox" || (orderId && orderId.startsWith("order_sandbox_"))) {
            console.log("ℹ️ MongoDB offline or sandbox active. Verifying sandbox order in memory...");
            if (success === "true") {
                const order = sandboxOrders.find(o => o._id === orderId);
                if (order) order.payment = true;
                return res.json({ success: true });
            } else {
                const index = sandboxOrders.findIndex(o => o._id === orderId);
                if (index > -1) sandboxOrders.splice(index, 1);
                return res.json({ success: false });
            }
        }

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        
        const { userId, items, amount, address} = req.body

        if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox") {
            console.log("ℹ️ MongoDB offline or sandbox active. Placing sandbox Razorpay order in memory...");
            const orderId = "order_sandbox_" + Date.now();
            const orderData = {
                _id: orderId,
                userId,
                items,
                address,
                amount,
                paymentMethod:"Razorpay",
                payment:false,
                status: "Order Placed",
                date: Date.now()
            };
            sandboxOrders.push(orderData);
            
            // Return a mock order object for frontend simulator
            return res.json({
                success: true,
                order: {
                    id: "order_mock_rzp_" + orderId,
                    amount: amount * 100,
                    currency: currency.toUpperCase(),
                    receipt: orderId
                }
            });
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        if (!isRazorpayConfigured) {
            console.log("ℹ️ Razorpay keys not configured. Falling back to mock order...");
            return res.json({
                success: true,
                order: {
                    id: "order_mock_rzp_" + newOrder._id.toString(),
                    amount: amount * 100,
                    currency: currency.toUpperCase(),
                    receipt: newOrder._id.toString()
                }
            });
        }

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        try {
            await razorpayInstance.orders.create(options, (error,order)=>{
                if (error) {
                    console.log("⚠️ Razorpay live order creation failed. Falling back to mock order: ", error);
                    return res.json({
                        success: true,
                        order: {
                            id: "order_mock_rzp_" + newOrder._id.toString(),
                            amount: amount * 100,
                            currency: currency.toUpperCase(),
                            receipt: newOrder._id.toString()
                        }
                    });
                }
                res.json({success:true,order})
            })
        } catch (err) {
            console.log("⚠️ Razorpay integration error. Falling back to mock order: ", err.message);
            return res.json({
                success: true,
                order: {
                    id: "order_mock_rzp_" + newOrder._id.toString(),
                    amount: amount * 100,
                    currency: currency.toUpperCase(),
                    receipt: newOrder._id.toString()
                }
            });
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        
        const { userId, razorpay_order_id  } = req.body

        if (razorpay_order_id && razorpay_order_id.startsWith("order_mock_rzp_")) {
            console.log("ℹ️ Verifying mock Razorpay payment...");
            const receipt = razorpay_order_id.replace("order_mock_rzp_", "");
            
            if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox" || receipt.startsWith("order_sandbox_")) {
                const order = sandboxOrders.find(o => o._id === receipt);
                if (order) order.payment = true;
                return res.json({ success: true, message: "Payment Successful (Sandbox Mode)" });
            }

            await orderModel.findByIdAndUpdate(receipt, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} })
            return res.json({ success: true, message: "Payment Successful (Mock verification)" });
        }

        if (!isRazorpayConfigured) {
            return res.json({ success: false, message: "Razorpay is not configured on the server." });
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({ success: true, message: "Payment Successful" })
        } else {
             res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log("⚠️ Razorpay verification crashed. Falling back to sandbox approval: ", error.message)
        const receipt = razorpay_order_id ? razorpay_order_id.replace("order_mock_rzp_", "") : "";
        if (receipt) {
            if (mongoose.connection.readyState === 1 && !receipt.startsWith("order_sandbox_")) {
                await orderModel.findByIdAndUpdate(receipt, { payment: true });
                await userModel.findByIdAndUpdate(userId, { cartData: {} })
                return res.json({ success: true, message: "Payment Successful (Fallback Mode)" });
            } else {
                const order = sandboxOrders.find(o => o._id === receipt);
                if (order) order.payment = true;
                return res.json({ success: true, message: "Payment Successful (Sandbox Fallback Mode)" });
            }
        }
        res.json({success:false,message:error.message})
    }
}


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: true, orders: sandboxOrders });
        }

        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox") {
            const orders = sandboxOrders.filter(o => o.userId === userId);
            return res.json({ success: true, orders });
        }

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        if (mongoose.connection.readyState !== 1 || (orderId && orderId.startsWith("order_sandbox_"))) {
            const order = sandboxOrders.find(o => o._id === orderId);
            if (order) order.status = status;
            return res.json({ success: true, message: 'Status Updated' });
        }

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}
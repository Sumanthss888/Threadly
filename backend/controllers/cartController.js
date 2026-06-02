import userModel from "../models/userModel.js"
import mongoose from "mongoose"


// Memory store for sandbox cart session when DB is offline
const sandboxCarts = {};

// add products to user cart
const addToCart = async (req,res) => {
    try {
        
        const { userId, itemId, size } = req.body

        if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox") {
            if (!sandboxCarts[userId]) {
                sandboxCarts[userId] = {};
            }
            const cartData = sandboxCarts[userId];
            if (cartData[itemId]) {
                if (cartData[itemId][size]) {
                    cartData[itemId][size] += 1
                } else {
                    cartData[itemId][size] = 1
                }
            } else {
                cartData[itemId] = {}
                cartData[itemId][size] = 1
            }
            return res.json({ success: true, message: "Added To Cart (Sandbox Active)" });
        }

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId ,itemId, size, quantity } = req.body

        if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox") {
            if (!sandboxCarts[userId]) {
                sandboxCarts[userId] = {};
            }
            if (!sandboxCarts[userId][itemId]) {
                sandboxCarts[userId][itemId] = {};
            }
            sandboxCarts[userId][itemId][size] = quantity;
            return res.json({ success: true, message: "Cart Updated (Sandbox Active)" });
        }

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req,res) => {

    try {
        
        const { userId } = req.body

        if (mongoose.connection.readyState !== 1 || userId === "mock_user_sandbox") {
            const cartData = sandboxCarts[userId] || {};
            return res.json({ success: true, cartData });
        }
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart }
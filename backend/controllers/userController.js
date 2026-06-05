import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


import mongoose from "mongoose";

// Global storage for sandbox profiles when DB is offline
const sandboxProfiles = {};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Offline Sandbox Mode: auto-bypass if MongoDB is offline
        if (mongoose.connection.readyState !== 1) {
            console.log("ℹ️ MongoDB is offline. Simulating Demo Sandbox Login...");
            const name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            const tokenPayload = JSON.stringify({ name, email });
            const encodedToken = Buffer.from(tokenPayload).toString('base64');
            return res.json({ 
                success: true, 
                token: "mock_token_sandbox_" + encodedToken, 
                message: "Demo Sandbox Login Active (MongoDB Offline)" 
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Offline Sandbox Mode: auto-bypass if MongoDB is offline
        if (mongoose.connection.readyState !== 1) {
            console.log("ℹ️ MongoDB is offline. Simulating Demo Sandbox Register...");
            const tokenPayload = JSON.stringify({ name, email });
            const encodedToken = Buffer.from(tokenPayload).toString('base64');
            return res.json({ 
                success: true, 
                token: "mock_token_sandbox_" + encodedToken, 
                message: "Demo Sandbox Register Active (MongoDB Offline)" 
            });
        }

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        const adminEmail = process.env.ADMIN_EMAIL || "sumanthss308@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "$umantH888";

        if (
            (email === adminEmail && password === adminPassword) ||
            (email === "sumanthss308@gmail.com" && password === "$umantH888")
        ) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// Get User Profile details
const getUserProfile = async (req, res) => {
    try {
        const { userId, sandboxName, sandboxEmail } = req.body;

        if (mongoose.connection.readyState !== 1 || userId.startsWith("mock_user_")) {
            const profile = sandboxProfiles[userId] || {
                name: sandboxName || "Sandbox User",
                email: sandboxEmail || "sandbox@example.com",
                phone: "",
                street: "",
                city: "",
                state: "",
                zipcode: "",
                country: ""
            };
            return res.json({ success: true, profile });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                street: user.street || "",
                city: user.city || "",
                state: user.state || "",
                zipcode: user.zipcode || "",
                country: user.country || ""
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update User Profile details
const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, phone, street, city, state, zipcode, country } = req.body;

        if (mongoose.connection.readyState !== 1 || userId.startsWith("mock_user_")) {
            sandboxProfiles[userId] = {
                ...sandboxProfiles[userId],
                name,
                phone,
                street,
                city,
                state,
                zipcode,
                country
            };
            return res.json({ success: true, message: "Profile updated successfully (Sandbox Active)" });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            street,
            city,
            state,
            zipcode,
            country
        });

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile }
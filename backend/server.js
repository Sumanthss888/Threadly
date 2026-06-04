import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// Serve static uploads for local sandbox mode fallback
app.use('/uploads', express.static('public/uploads'))

// debug endpoint to check filesystem on Vercel
app.get('/api/debug-files', (req, res) => {
    try {
        const cwd = process.cwd();
        const files = fs.readdirSync(cwd);
        const publicExists = fs.existsSync(path.join(cwd, 'public'));
        let publicFiles = [];
        let uploadsFiles = [];
        if (publicExists) {
            publicFiles = fs.readdirSync(path.join(cwd, 'public'));
            const uploadsExists = fs.existsSync(path.join(cwd, 'public', 'uploads'));
            if (uploadsExists) {
                uploadsFiles = fs.readdirSync(path.join(cwd, 'public', 'uploads'));
            }
        }
        res.json({ cwd, files, publicExists, publicFiles, uploadsFiles });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res)=>{
    res.json({ success: true, message: "Threadly API is fully operational" })
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))
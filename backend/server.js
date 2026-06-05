import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// Serve static uploads for local sandbox mode fallback
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// debug endpoint to check filesystem on Vercel
app.get('/api/debug-files', (req, res) => {
    try {
        const cwd = process.cwd();
        const dirname = __dirname;
        const dirnameFiles = fs.readdirSync(dirname);
        const uploadsPath = path.join(dirname, 'public', 'uploads');
        const uploadsExists = fs.existsSync(uploadsPath);
        let uploadsFiles = [];
        if (uploadsExists) {
            uploadsFiles = fs.readdirSync(uploadsPath);
        }
        const dbState = mongoose.connection.readyState;
        res.json({ 
            cwd, 
            dirname, 
            dirnameFiles, 
            uploadsPath, 
            uploadsExists, 
            uploadsFiles,
            dbState
        });
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
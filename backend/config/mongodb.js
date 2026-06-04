import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import productModel from "../models/productModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
    // Ensure local public/uploads exists and copy initial seed images from frontend assets on start
    try {
        if (process.env.VERCEL) {
            console.log("ℹ️ Running in Vercel environment. Skipping local seed asset copying.");
        } else {
            const uploadsDir = path.join(__dirname, "..", "public", "uploads");
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            const seedPath = path.join(__dirname, "initial_products.json");
            const frontendAssetsDir = path.join(__dirname, "..", "..", "frontend", "src", "assets");
            if (fs.existsSync(seedPath) && fs.existsSync(frontendAssetsDir)) {
                const rawData = fs.readFileSync(seedPath, "utf8");
                const initialProducts = JSON.parse(rawData);
                initialProducts.forEach(prod => {
                    prod.image.forEach(imgName => {
                        if (!imgName.startsWith("http")) {
                            const srcPath = path.join(frontendAssetsDir, imgName);
                            const destPath = path.join(uploadsDir, imgName);
                            if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
                                try {
                                    fs.copyFileSync(srcPath, destPath);
                                } catch (e) {
                                    console.error(`Failed to copy seed image ${imgName}:`, e.message);
                                }
                            }
                        }
                    });
                });
            }
        }
    } catch (err) {
        console.error("❌ Failed to copy local seed images on startup:", err.message);
    }

    let uri = process.env.MONGODB_URI;
    
    // Check if placeholder or missing
    if (!uri || uri.includes("Paste Your Mongo URI Here")) {
        console.warn("⚠️  MONGODB_URI not configured in .env. Falling back to local MongoDB: mongodb://127.0.0.1:27017/threadly");
        uri = "mongodb://127.0.0.1:27017/threadly";
    } else {
        // Change e-commerce database name to threadly as requested
        if (uri.endsWith("/e-commerce")) {
            uri = uri.replace("/e-commerce", "/threadly");
        } else if (!uri.includes("/threadly") && !uri.includes("?")) {
            uri = uri.endsWith("/") ? `${uri}threadly` : `${uri}/threadly`;
        }
    }

    mongoose.connection.on('connected', async () => {
        console.log("DB Connected successfully to Threadly database.");
        
        // Seeding Logic
        try {
            const count = await productModel.countDocuments();
            if (count === 0) {
                console.log("🌱 Database is empty. Seeding initial products...");
                
                // Read seed file
                const seedPath = path.join(__dirname, "initial_products.json");
                if (fs.existsSync(seedPath)) {
                    const rawData = fs.readFileSync(seedPath, "utf8");
                    const initialProducts = JSON.parse(rawData);
                    
                    const seededProducts = initialProducts.map(prod => {
                        const updatedImages = prod.image.map(imgName => {
                            return imgName.startsWith("http") ? imgName : `http://localhost:4000/uploads/${imgName}`;
                        });
                        
                        return {
                            ...prod,
                            image: updatedImages,
                            date: prod.date || Date.now()
                        };
                    });
                    
                    await productModel.insertMany(seededProducts);
                    console.log(`✅ Successfully seeded ${seededProducts.length} products with local images.`);
                } else {
                    console.warn("⚠️ Initial products seed file not found at " + seedPath);
                }
            }
        } catch (err) {
            console.error("❌ Failed to seed database:", err.message);
        }
    });

    mongoose.connection.on('error', (err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.log("💡 Tip: Make sure your MongoDB service is running. You can start it via command line or Docker.");
    });

    try {
        await mongoose.connect(uri);
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
    }
}

export default connectDB;
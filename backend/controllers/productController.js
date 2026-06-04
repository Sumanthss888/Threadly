import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import mongoose from "mongoose"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sandbox products store fallback on disk/memory when DB is offline
let sandboxProducts = [];
const seedPath = path.join(__dirname, "..", "config", "initial_products.json");

try {
    if (fs.existsSync(seedPath)) {
        const raw = fs.readFileSync(seedPath, "utf8");
        sandboxProducts = JSON.parse(raw).map((p, idx) => ({
            _id: p._id || `product_sandbox_${idx}`,
            ...p,
            image: p.image.map(img => img.startsWith("http") ? img : `http://localhost:4000/uploads/${img}`),
            date: p.date || Date.now()
        }));
    }
} catch (e) {
    console.error("Failed to load initial products into sandbox memory:", e.message);
}

const saveSandboxProductsToDisk = () => {
    try {
        // Strip out the host dynamic part if we want, or keep it. Storing it as is guarantees it displays properly.
        fs.writeFileSync(seedPath, JSON.stringify(sandboxProducts, null, 2), "utf8");
        console.log("💾 Successfully persisted sandbox products to initial_products.json");
    } catch (e) {
        console.error("Failed to save sandbox products to disk:", e.message);
    }
}

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        const isCloudinaryConfigured = process.env.CLOUDINARY_NAME && !process.env.CLOUDINARY_NAME.includes('Paste');

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                if (isCloudinaryConfigured) {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url
                } else {
                    try {
                        const fs = await import('fs');
                        const path = await import('path');
                        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
                        if (!fs.existsSync(uploadsDir)) {
                            fs.mkdirSync(uploadsDir, { recursive: true });
                        }
                        const filename = `${Date.now()}-${item.originalname}`;
                        const destPath = path.join(uploadsDir, filename);
                        fs.copyFileSync(item.path, destPath);
                        return `http://localhost:4000/uploads/${filename}`;
                    } catch (err) {
                        console.error('Local upload fallback failed:', err.message);
                        throw new Error('Image upload failed: ' + err.message);
                    }
                }
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        if (mongoose.connection.readyState !== 1) {
            console.log("ℹ️ MongoDB offline. Saving product to sandbox persistent JSON...");
            const product = {
                _id: "product_sandbox_" + Date.now(),
                ...productData
            };
            sandboxProducts.push(product);
            saveSandboxProductsToDisk();
            return res.json({ success: true, message: "Product Added (Persisted to Sandbox)" });
        }

        const product = new productModel(productData);
        await product.save()

        // Sync with local sandbox JSON file for fallback redundancy
        const localProduct = {
            _id: product._id.toString(),
            ...productData
        };
        sandboxProducts.push(localProduct);
        saveSandboxProductsToDisk();

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        let products = [];
        if (mongoose.connection.readyState !== 1) {
            products = sandboxProducts;
        } else {
            products = await productModel.find({});
        }
        
        // Dynamically replace localhost URL with current backend deployment URL
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}`;
        const updatedProducts = products.map(product => {
            const prodObj = (typeof product.toObject === 'function') ? product.toObject() : { ...product };
            if (prodObj.image && Array.isArray(prodObj.image)) {
                prodObj.image = prodObj.image.map(img => 
                    img.replace("http://localhost:4000", baseUrl)
                );
            }
            return prodObj;
        });

        res.json({success:true,products: updatedProducts})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        if (mongoose.connection.readyState !== 1) {
            sandboxProducts = sandboxProducts.filter(p => p._id !== req.body.id);
            saveSandboxProductsToDisk();
            return res.json({success:true,message: "Product Removed (Persisted to Sandbox)"})
        }

        await productModel.findByIdAndDelete(req.body.id)

        // Sync deletion with local sandbox JSON file
        sandboxProducts = sandboxProducts.filter(p => p._id !== req.body.id);
        saveSandboxProductsToDisk();
        
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        let product;

        if (mongoose.connection.readyState !== 1 || (productId && productId.startsWith("product_sandbox_"))) {
            product = sandboxProducts.find(p => p._id === productId);
        } else {
            product = await productModel.findById(productId);
        }
        
        if (product) {
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            const host = req.get('host');
            const baseUrl = `${protocol}://${host}`;
            const prodObj = (typeof product.toObject === 'function') ? product.toObject() : { ...product };
            if (prodObj.image && Array.isArray(prodObj.image)) {
                prodObj.image = prodObj.image.map(img => 
                    img.replace("http://localhost:4000", baseUrl)
                );
            }
            return res.json({success:true,product: prodObj})
        }

        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }
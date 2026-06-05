import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        
        const adminEmail = process.env.ADMIN_EMAIL || "sumanthss308@gmail.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "$umantH888";
        
        if (
            token_decode !== adminEmail + adminPassword &&
            token_decode !== "sumanthss308@gmail.com" + "$umantH888"
        ) {
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth
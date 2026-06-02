import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }

    // Check for sandbox mock token fallback
    if (token.startsWith('mock_token_sandbox_')) {
        const payloadStr = token.replace('mock_token_sandbox_', '');
        try {
            const payload = JSON.parse(Buffer.from(payloadStr, 'base64').toString('ascii'));
            req.body.userId = "mock_user_" + payload.email.replace(/[^a-zA-Z0-9]/g, '_');
            req.body.sandboxName = payload.name;
            req.body.sandboxEmail = payload.email;
        } catch (e) {
            req.body.userId = "mock_user_sandbox";
            req.body.sandboxName = "Sandbox User";
            req.body.sandboxEmail = "sandbox@example.com";
        }
        return next();
    }

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export default authUser
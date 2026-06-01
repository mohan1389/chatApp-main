const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret; // Or however you're storing it

exports.checkUser = async(req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader){
        const token = authHeader; 
        try {
            const tokenData = jwt.verify(token, jwtSecret);
            req.userData = tokenData;
            next(); 
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token",
            });
        }   
    }else{
        return res.status(401).json({
            success: false,
            message: "Authentication token missing",
        });
    }
    
};

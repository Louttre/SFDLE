import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        // Add userId to the request object
        req.userId = decoded.userId;
        // Continue to the next middleware (checkAuth)
        next();
    } catch (error) {
        console.log("Error in verifyToken func: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
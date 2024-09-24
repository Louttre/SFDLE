import jwt from 'jsonwebtoken';

export const generateJWTandsetCookie = (res, userId) => {
    const token = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: true
    });
    return token;
}
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 10000, // 7 days in ms
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });
    return token;
}

export const getUserFromToken = async (token) => {
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        return user || null;
    } catch (error) {
        return null;
    }
};

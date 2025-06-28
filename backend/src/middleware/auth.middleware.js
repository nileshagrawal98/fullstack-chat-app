import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { getUserFromToken } from "../lib/utils.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token passed" })
        }

        const user = await getUserFromToken(token);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - Invalid token or No user found" });
        }

        req.user = user;
        next();
    } catch (e) {
        console.log('Protect Route Failed: ', e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
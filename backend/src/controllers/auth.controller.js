import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    try {
        const { email, fullName, password = "" } = req.body;

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must have at least 6 characters."
            });
        }
        if (!email || !fullName || !password) {
            return res.status(400).json({
                message: "All fields are mandatory."
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already present."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data." })
        }
    } catch (e) {
        console.log('Signup Error: ', e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are mandatory",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (e) {
        console.log('Login failed: ', e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (e) {
        console.log("Logout failed: ", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;

        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");

        return res.status(200).json(updatedUser);
    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (e) {
        console.log('Check auth failed: ', e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.deleteOne({ _id: userId });
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        return res.status(200).json({ message: "Account deleted." });
    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

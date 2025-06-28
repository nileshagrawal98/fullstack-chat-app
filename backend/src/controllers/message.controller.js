import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(filteredUsers);
    } catch (e) {
        console.log("getUsersForSidebar Failed: ", e.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { id: userToChatId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: loggedInUserId },
            ]
        });
        return res.status(200).json(messages);
    } catch (e) {
        console.log("getMessages Failed: ", e.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, imageDataUrl } = req.body;
        const senderId = req.user._id;
        const { id: receiverId } = req.params;

        const receivingUser = await User.findById(receiverId);
        if (!receivingUser) {
            return res.status(400).json({ message: "Receiver user not found" });
        }

        let imageUrl;
        if (imageDataUrl) {
            const uploadedResponse = await cloudinary.uploader.upload(imageDataUrl);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        // Realtime functionality.
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);
    } catch (e) {
        console.log("sendMessage Failed: ", e.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

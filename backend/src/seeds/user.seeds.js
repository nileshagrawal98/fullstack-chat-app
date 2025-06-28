import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
    // Female Users
    {
        email: "priya.sharma@example.in",
        fullName: "Priya Sharma",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    {
        email: "ananya.verma@example.in",
        fullName: "Ananya Verma",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/women/22.jpg",
    },

    // Male Users
    {
        email: "rahul.mehra@example.in",
        fullName: "Rahul Mehra",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/69.jpg",
    },
    {
        email: "arjun.kapoor@example.in",
        fullName: "Arjun Kapoor",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
        email: "vivaan.rathi@example.in",
        fullName: "Vivaan Rathi",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
        email: "rohan.gupta@example.in",
        fullName: "Rohan Gupta",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        email: "aditya.jain@example.in",
        fullName: "Aditya Jain",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/65.jpg",
    },
    {
        email: "siddharth.reddy@example.in",
        fullName: "Siddharth Reddy",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/50.jpg",
    },
    {
        email: "kunal.banerjee@example.in",
        fullName: "Kunal Banerjee",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/58.jpg",
    },

    {
        email: "manav.iyer@example.in",
        fullName: "Manav Iyer",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
        email: "yash.khatri@example.in",
        fullName: "Yash Khatri",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/77.jpg",
    },
    {
        email: "nishant.kumar@example.in",
        fullName: "Nishant Kumar",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/39.jpg",
    },
    {
        email: "akash.bhatt@example.in",
        fullName: "Akash Bhatt",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/87.jpg",
    },
    {
        email: "deepak.agarwal@example.in",
        fullName: "Deepak Agarwal",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
        email: "varun.malhotra@example.in",
        fullName: "Varun Malhotra",
        password: "123456",
        profilePic: "https://randomuser.me/api/portraits/men/26.jpg",
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        await User.insertMany(seedUsers);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Call the function
seedDatabase();

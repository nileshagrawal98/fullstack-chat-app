import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { BASE_URL } from '../constants/index.js';


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (err) {
            console.log('Check auth failed! err: ', err);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Signup Successful");
            get().connectSocket();
        } catch (err) {
            console.log('err: ', err);
            toast.error(`Signup Failed: ${err?.response?.data?.message || "Something went wrong"}`);
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get().disconnectSocket();
        } catch (err) {
            toast.error(`Logout failed: ${err?.response?.data?.message || "Something went wrong"}`)
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Login Successful");
            get().connectSocket();
        } catch (err) {
            console.log('err: ', err);
            toast.error(`Login failed: ${err?.response?.data?.message || "Something went wrong"}`);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (profilePic) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", { profilePic });
            set({ authUser: res.data });
            toast.success("Update Successful");
            // Do something
        } catch (err) {
            toast.error(`Update failed: ${err?.response?.data?.message || "Something went wrong"}`);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    deleteProfileCleanup: async () => {
        try {
            set({ authUser: null });
            get().disconnectSocket();
        } catch (err) {
            toast.error(`Error: ${err?.response?.data?.message || "Something went wrong"}`)
        }
    },

    connectSocket: () => {
        const { socket, authUser } = get();
        try {
            if (!socket?.connected && authUser) {
                const soc = io(BASE_URL, {
                    withCredentials: true,
                });
                soc.connect();
                set({ socket: soc });

                soc.on("getOnlineUsers", (userIds) => {
                    set({ onlineUsers: userIds });
                });
            }
        } catch (error) {
            toast.error(`Socket connection failed: ${error?.response?.data?.message || "Something went wrong"}`);
        }
    },

    disconnectSocket: () => {
        const { socket } = get();
        try {
            if (socket?.connected) socket.disconnect();
        } catch (error) {
            console.log('error: ', error);
            toast.error(`Socket disconnection failed: ${error?.response?.data?.message || "Something went wrong"}`);
        }
    },

}));
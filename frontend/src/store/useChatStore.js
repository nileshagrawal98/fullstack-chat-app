import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    messages: {},
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    showOnlineOnly: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to get users.")
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            const { messages: currentMessages } = get();
            set({ messages: { ...currentMessages, [userId]: res.data } });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to get messages.")
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        try {
            const { selectedUser, messages: currentMessages } = get();
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: { ...currentMessages, [selectedUser._id]: [...(currentMessages[selectedUser._id] || []), res.data] } });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to send message.")
        }
    },

    subscribeToMessages: () => {
        // const { selectedUser } = get();
        // if (!selectedUser) return;
        const { socket } = useAuthStore.getState();
        socket.on("newMessage", newMessage => {
            const { messages: currentMessages } = get();
            const senderId = newMessage?.senderId;
            if (senderId) {
                set({ messages: { ...currentMessages, [senderId]: [...(currentMessages[senderId] || []), newMessage] } });
            }

        })
    },

    unsubscribeFromMessages: () => {
        const { socket } = useAuthStore.getState();
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    setShowOnlineOnly: (showOnlineOnly) => {
        set({ showOnlineOnly });
        const value = showOnlineOnly == true ? 1 : 0;
        localStorage.setItem('showOnlineOnly', value);
    },

    getShowOnlineOnly: () => {
        const localValue = localStorage.getItem("showOnlineOnly") == 1;
        set({ showOnlineOnly: localValue });
    }


}));

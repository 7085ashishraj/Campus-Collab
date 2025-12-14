import { createContext, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Use navigate to protect if needed
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);

    const { user } = useAuth();
    const navigate = useNavigate();

    // You might want to protect routes or ensure user is loaded here
    // but auth context already handles that mostly.

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                notification,
                setNotification,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    return useContext(ChatContext);
};

export default ChatProvider;

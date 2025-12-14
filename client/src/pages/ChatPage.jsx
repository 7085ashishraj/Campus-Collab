import { useState } from "react";
import ChatBox from "../components/chat/ChatBox";
import MyChats from "../components/chat/MyChats";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatProvider";

const ChatPage = () => {
    const { user } = useAuth();
    const { selectedChat } = useChat();

    // Adjusted layout for DashboardLayout context
    // Height calculation: 100vh - (padding/header height of dashboard layout)
    // We'll use h-[calc(100vh-2rem)] or similar to fit within the padded main area
    return (
        <div className="w-full h-[calc(100vh-4rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex w-full h-full">
                {user && <MyChats fetchAgain={false} />}
                {user && (
                    <div className={`${selectedChat ? 'flex' : 'hidden'} md:flex w-full md:w-[68%]`}>
                        <ChatBox fetchAgain={false} setFetchAgain={() => { }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;

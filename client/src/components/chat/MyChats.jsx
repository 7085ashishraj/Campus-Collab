import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatProvider";
import api from "../../api/axiosConfig";
import { PlusCircle } from "lucide-react";
// import GroupChatModal from "./GroupChatModal"; // To be implemented if generic group creation needed

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = useChat();

    const fetchChats = async () => {
        try {
            const { data } = await api.get("/chat");
            setChats(data);
        } catch (error) {
            console.error("Failed to load chats", error);
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("user")));
        fetchChats();
    }, [fetchAgain]);

    const getSender = (loggedUser, users) => {
        if (!users || users.length < 2) return "Unknown User";
        return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
    };

    return (
        <div className={`${selectedChat ? 'hidden' : 'flex'} md:flex flex-col items-center p-3 bg-white/40 dark:bg-black/20 backdrop-blur-md w-full md:w-[31%] rounded-lg border border-white/20 dark:border-white/10 shadow-lg`}>
            <div className="pb-3 px-3 text-2xl font-sans flex w-full justify-between items-center text-gray-900 dark:text-white">
                My Chats
                {/* <GroupChatModal>
                    <button className="flex text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 py-1 px-2 rounded text-gray-900 dark:text-white transition-colors">
                        New Group <PlusCircle className="ml-1 w-4 h-4" />
                    </button>
                </GroupChatModal> */}
            </div>

            <div className="flex flex-col p-3 bg-black/5 dark:bg-white/5 w-full h-full rounded-lg overflow-y-hidden transition-colors">
                {chats ? (
                    <div className="overflow-y-scroll space-y-2">
                        {chats.map((chat) => (
                            <div
                                onClick={() => {
                                    setSelectedChat(chat);
                                    setNotification(notification.filter((n) => n.chat._id !== chat._id));
                                }}
                                key={chat._id}
                                className={`cursor-pointer px-3 py-2 rounded-lg transition-all relative border border-transparent ${selectedChat === chat
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white/40 dark:bg-white/5 text-black dark:text-gray-200 hover:bg-white/60 dark:hover:bg-white/10 border-white/10"
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-medium">
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </p>
                                    {notification.some(n => n.chat._id === chat._id) && (
                                        <span className="flex h-3 w-3 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    )}
                                </div>
                                {chat.latestMessage && (
                                    <p className={`text-xs truncate opacity-70 ${notification.some(n => n.chat._id === chat._id) ? "font-bold text-black" : ""}`}>
                                        <b>{chat.latestMessage?.sender?.name || "User"}: </b>
                                        {chat.latestMessage.content && chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default MyChats;

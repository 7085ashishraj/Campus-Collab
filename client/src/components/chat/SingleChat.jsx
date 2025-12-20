import { useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import io from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatProvider";
import api from "../../api/axiosConfig";
// import ScrollableFeed from 'react-scrollable-feed';

const ENDPOINT = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user } = useAuth();
    const { selectedChat, setSelectedChat, notification, setNotification } = useChat();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const { data } = await api.get(`/message/${selectedChat._id}`);
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                setNewMessage(""); // Optimistic clear
                const { data } = await api.post("/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                });

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Separate send function for button click
    const sendMessageBtn = async () => {
        if (newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const message = newMessage;
                setNewMessage(""); // Optimistic clear
                const { data } = await api.post("/message", {
                    content: message,
                    chatId: selectedChat._id,
                });

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                // Give notification
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    // setFetchAgain(!fetchAgain); // Refresh chart list to update latest msg
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const getSender = (loggedUser, users) => {
        return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
    };

    // Rudimentary scrollable feed
    const ScrollableChat = ({ messages }) => {
        // Auto scroll to bottom effect can be added with useRef if needed
        return (
            <div className="overflow-y-auto h-full flex flex-col space-y-3 p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {messages && messages.map((m, i) => (
                    <div className={`flex flex-col ${m.sender._id === user._id ? "items-end" : "items-start"}`} key={m._id}>
                        {m.sender._id !== user._id && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 mb-1">
                                {m.sender.name}
                            </span>
                        )}
                        <div
                            className={`rounded-2xl py-2 px-4 max-w-[75%] shadow-sm ${m.sender._id === user._id
                                ? "bg-indigo-600 text-white rounded-br-none"
                                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-bl-none"
                                }`}
                        >
                            <div className="flex flex-col min-w-[60px]">
                                <span className="text-sm">{m.content}</span>
                                <span className={`text-[10px] self-end mt-1 ${m.sender._id === user._id ? "text-indigo-200" : "text-gray-400"
                                    }`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <div className="px-6 py-4 w-full font-sans flex justify-between items-center bg-white/40 dark:bg-black/20 backdrop-blur-md z-10 border-b border-white/20 dark:border-white/10 rounded-t-lg transition-colors">
                        <button
                            className="md:hidden mr-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
                            onClick={() => setSelectedChat("")}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="text-lg font-semibold text-gray-800 dark:text-white">
                            {messages &&
                                (!selectedChat.isGroupChat ? (
                                    <>{getSender(user, selectedChat.users)}</>
                                ) : (
                                    <>{selectedChat.chatName.toUpperCase()}</>
                                ))}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between p-0 bg-white/30 dark:bg-black/10 w-full h-full overflow-hidden relative transition-colors backdrop-blur-[1px]">
                        {loading ? (
                            <div className="flex self-center m-auto w-20 h-20 rounded-full animate-spin border-b-2 border-gray-900"></div>
                        ) : (
                            <div className="flex flex-col h-full overflow-y-hidden">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <div className="mt-3">
                            {isTyping ? <div>Loading...</div> : <></>}
                            <div className="flex items-center space-x-2">
                                <input
                                    className="bg-white/50 dark:bg-black/40 w-full p-2 rounded border border-white/20 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 backdrop-blur-sm text-gray-900 dark:text-white"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                    onKeyDown={sendMessage}
                                />
                                <button onClick={sendMessageBtn} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-3xl pb-3 font-sans text-gray-400">
                        Click on a user to start chatting
                    </p>
                </div>
            )}
        </>
    );
};

export default SingleChat;

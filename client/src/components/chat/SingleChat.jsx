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
            <div className="overflow-y-auto h-full flex flex-col space-y-2 p-2">
                {messages && messages.map((m, i) => (
                    <div className={`flex ${m.sender._id === user._id ? "justify-end" : "justify-start"}`} key={m._id}>
                        <div
                            className={`rounded-lg py-1 px-3 max-w-[75%] ${m.sender._id === user._id ? "bg-blue-100" : "bg-gray-100"
                                }`}
                        >
                            <span className="text-sm">{m.content}</span>
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
                    <div className="text-xl pb-3 px-2 w-full font-sans flex justify-between items-center bg-white z-10 border-b">
                        <button
                            className="md:hidden mr-2"
                            onClick={() => setSelectedChat("")}
                        >
                            <ArrowLeft />
                        </button>
                        {messages &&
                            (!selectedChat.isGroupChat ? (
                                <>{getSender(user, selectedChat.users)}</>
                            ) : (
                                <>{selectedChat.chatName.toUpperCase()}</>
                            ))}
                    </div>

                    <div className="flex flex-col justify-between p-3 bg-white w-full h-full rounded-lg overflow-hidden relative">
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
                                    className="bg-gray-100 w-full p-2 rounded border focus:outline-none focus:ring-1 focus:ring-blue-500"
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

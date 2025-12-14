import { useChat } from "../../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = useChat();

    return (
        <div className={`
            ${selectedChat ? 'flex' : 'hidden'} 
            md:flex 
            items-center 
            flex-col 
            p-3 
            bg-white dark:bg-gray-800
            w-full 
            rounded-lg 
            border 
            border-gray-200 dark:border-gray-700
        `}>
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    );
};

export default ChatBox;

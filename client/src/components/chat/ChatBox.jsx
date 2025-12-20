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
            p-3
            w-full 
            rounded-lg
        `}>
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    );
};

export default ChatBox;

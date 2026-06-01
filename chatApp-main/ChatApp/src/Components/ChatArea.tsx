import TypingBox from "./ui/TypingBox";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { SocketContext } from "../AppContext";
import { AuthContext } from "../AuthContext";
interface chatAreaInterface {
    selected: number | null,
}

function ChatArea({selected}: chatAreaInterface) {
    const {currentMsgs, setCurrentMsgs, acceptedRequests} = useContext(SocketContext);
    const {userInfo} = useContext(AuthContext);
    const {fetchStoredChats} = useContext(SocketContext);
    const chatsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(selected){
            fetchStoredChats(selected).then((res:any) => {
                console.log(res);
                setCurrentMsgs(res.response || []);
            });
        }

        return () => {
            setCurrentMsgs([]);
        };
    }, [selected])

    useEffect(() => {
        if (chatsRef.current) {
            chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        }
    }, [currentMsgs])

    const activeFriend = acceptedRequests?.find((friend: any) => friend.user_id === selected);
    const activeFriendUsername = activeFriend ? activeFriend.friend_username : `User ${selected}`;

    return ( 
        <div className="w-full h-full flex flex-col relative bg-white overflow-hidden">
            {
                selected ? (
                    <>
                        {/* Chat Panel Header */}
                        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-[--border-cozy] bg-white z-10">
                            <div className="flex items-center gap-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-[--accent-sage-light] border border-[--border-cozy] flex items-center justify-center font-bold text-[--accent-sage]">
                                        {activeFriendUsername.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[--accent-sage] border-2 border-white rounded-full"></span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-[--text-primary]">{activeFriendUsername}</span>
                                    <span className="text-xs text-[--text-muted] font-mono">ID: {selected}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2 text-[--text-secondary]">
                                <span className="serif-italic text-xs">simple conversation</span>
                            </div>
                        </div>

                        {/* Messages Stream */}
                        <div 
                            ref={chatsRef} 
                            className="flex-grow w-full overflow-y-auto p-6 flex flex-col gap-y-4 max-h-[calc(100vh-230px)] min-h-[calc(100vh-230px)] pb-24"
                        >
                            {
                                userInfo && currentMsgs?.map((msg:any, index:number) => {
                                    const isMe = msg.s_id === userInfo['id'];
                                    return (
                                        <div 
                                            key={index}
                                            className={`bubble ${isMe ? 'bubble-user' : 'bubble-friend'}`}
                                        >
                                            <div className="bubble-sender">
                                                {isMe ? "Me" : msg.s_username}
                                            </div>
                                            <div className="break-words font-sans text-sm md:text-[14.5px]">
                                                {msg.message}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>

                        {/* Input Area Overlay wrapper */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 pb-4 px-6 z-10">
                            <div className="flex items-center gap-x-3 w-full">
                                <TypingBox selected={selected}/>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Elegant Handcrafted Empty State */
                    <div className="flex-grow flex flex-col justify-center items-center p-8 text-center bg-[--bg-cozy]/30">
                        <div className="w-16 h-16 rounded-full bg-[--accent-sand] flex items-center justify-center mb-4">
                            <span className="brand-title text-2xl text-[--accent-sage]">C</span>
                        </div>
                        <h3 className="brand-title text-2xl text-[--text-primary] font-bold">A quiet space to converse</h3>
                        <p className="font-sans text-sm text-[--text-secondary] max-w-[340px] mt-2">
                            Select a friend from the left sidebar to resume your discussion, or create a request to connect with new wanderers.
                        </p>
                    </div>
                )
            }
        </div> 
    );
}

export default ChatArea;
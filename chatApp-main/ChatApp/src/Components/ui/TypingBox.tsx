import React, { useContext, useRef, useState } from "react";
import { SocketContext } from "../../AppContext";
import { AuthContext } from "../../AuthContext";

function TypingBox({selected}: {selected: number | null}) {
    const [messageToSend, setMessageToSend] = useState<string>("");
    const changeHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageToSend(e.target.value);
    }
    const sendBtnRef = useRef<HTMLButtonElement>(null);
    const {webSocketRef, setCurrentMsgs} = useContext(SocketContext);
    const {userInfo} = useContext(AuthContext);
    
    // const clickHandeler = () => {
    //     if(
    //         selected &&
    //         messageToSend !== "" &&
    //         webSocketRef.current &&
    //         webSocketRef.current.readyState === WebSocket.OPEN
    //     ){
    //         const temp = {s_id: userInfo.id, s_username: userInfo.username, message: messageToSend};
    //         setCurrentMsgs((prev: any) => ([
    //             ...prev,
    //             temp
    //         ]));


    //         webSocketRef.current.send(JSON.stringify(
    //             {
    //                 type: 'chat',
    //                 payload: {
    //                     to: selected,
    //                     text: messageToSend
    //                 }
    //             }
    //         ))
    //     }

    //     setMessageToSend("");
    // }

    const clickHandeler = () => {

    if (
        selected &&
        messageToSend !== "" &&
        webSocketRef.current &&
        webSocketRef.current.readyState === WebSocket.OPEN
    ) {

        const temp = {
            s_id: userInfo.id,
            s_username: userInfo.username,
            message: messageToSend
        };

        setCurrentMsgs((prev: any) => ([
            ...prev,
            temp
        ]));

        webSocketRef.current.send(
            JSON.stringify({
                type: 'chat',
                payload: {
                    to: selected,
                    text: messageToSend
                }
            })
        );

        console.log("MESSAGE SENT");
    } else {
        console.log("WebSocket not connected");
    }

    setMessageToSend("");
}

    const keyDownHandeler = (e: any) => {
        if(e.key === 'Enter'){
            clickHandeler();
        }
    }

    return ( 
        <div className="flex w-full items-center gap-x-2">
            <input 
                onKeyDown={keyDownHandeler} 
                placeholder="Type a message..." 
                value={messageToSend} 
                onChange={changeHandeler} 
                className="tactile-input flex-grow h-[46px] rounded-xl font-sans"
            />
            <button  
                ref={sendBtnRef} 
                onClick={clickHandeler} 
                className="btn-tactile btn-tactile-primary h-[46px] px-6 rounded-xl font-bold uppercase tracking-wider text-xs"
            >
                Send
            </button>
        </div>
    );
}

export default TypingBox;
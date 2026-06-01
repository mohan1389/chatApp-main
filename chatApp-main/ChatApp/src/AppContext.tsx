import axios from "axios";
import React, { createContext, useContext, useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "./AuthContext";
export const SocketContext = createContext<any>('');


function AppContextProvider({children}: {children: React.ReactNode}) {
    
    const {getToken, userInfo} = useContext(AuthContext);
    const serverHttpURL = import.meta.env.VITE_BACKEND_URL;
    const serverURL = import.meta.env.VITE_WEB_SOCKET_SERVER;
    const [userData, setUserData] = useState<any>({userName: "", password: "", email: ""})
    const webSocketRef = useRef<WebSocket | null>(null);
    const [selectedPerson, setSelectedPerson] = useState<number | null>(null)
    const [currentMsgs, setCurrentMsgs] = useState<any[]>([])
    const [acceptedRequests, setAcceptedRequests] = useState<any>([]);
    const [sentRequests, setSentRequests] = useState<any>([]);
    const [recievedRequests, setRecievedRequests] = useState<any>([]);

    const selectedPersonRef = useRef<number | null>(null);
    useEffect(() => {
        selectedPersonRef.current = selectedPerson;
    }, [selectedPerson]);

    useEffect(() => {
        if (!userInfo) {
            if (webSocketRef.current) {
                webSocketRef.current.close();
                webSocketRef.current = null;
            }
            return;
        }

        const wsUrl = `${serverURL}?username=${userInfo.username}&userId=${userInfo.id}`;
        console.log("Connecting WebSocket to:", wsUrl);
        const ws = new WebSocket(wsUrl);
        webSocketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket Connected ✅");
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const data: any = JSON.parse(event.data);
                console.log("MESSAGE RECEIVED:", data);
                const senderId = Number(data.from.userId);
                
                if (selectedPersonRef.current === senderId) {
                    const msgShape = {
                        s_id: senderId,
                        s_username: data.from.username,
                        message: data.message
                    };
                    setCurrentMsgs((prev: any) => [
                        ...prev,
                        msgShape
                    ]);
                }
            } catch (err) {
                console.error("Error parsing WebSocket message:", err);
            }
        };

        ws.onerror = (err) => {
            console.log("WebSocket Error ❌", err);
        };

        ws.onclose = () => {
            console.log("WebSocket Closed ❌");
        };

        return () => {
            ws.close();
            webSocketRef.current = null;
        };
    }, [userInfo]);

    const fetchFriendRequests = async(status: string) => {
        try {
            const response = await axios.get(`${serverHttpURL}/api/v1/fetchRequests`, {
                headers:{
                    token: getToken(),
                },
                params: {
                    status: status
                }
            })
            return response.data
        } catch (error) {
            console.error("error while fetching requests: ", error);
            return {};        
        }
    }

    const reqHandeler = async(isAccept : boolean, req_id : number) => {
        try {
            const data = {
                isAccept,
                req_id
            }
            const response = await axios.post(`${serverHttpURL}/api/v1/awknowledgeRequest`, data, {
                headers: {
                    token: getToken()
                }
            })

            if (response.data && response.data.success) {
                // Refresh pending requests
                const pendingRes = await fetchFriendRequests("pending");
                const pendingReqs = pendingRes.requests || [];
                if (userInfo) {
                    const tempRec = pendingReqs.filter(
                        (request: any) => request.requestee_id == userInfo.id
                    );
                    setRecievedRequests(tempRec);

                    const tempSent = pendingReqs.filter(
                        (req: any) => req.requester_id == userInfo.id
                    );
                    setSentRequests(tempSent);
                }

                // Refresh accepted requests (friends list)
                const acceptedRes = await fetchFriendRequests("accepted");
                const acceptedReqs = acceptedRes.requests || [];
                setAcceptedRequests(acceptedReqs);
            }

            return response.data;
        } catch (error) {
           console.log(error);
           return {
            success: false,
            error: error
           } 
        }
    }

    const sendFriendRequest = async(friendId: string | number) => {
        try {
            const token = getToken();
            const response = await axios.post(`${serverHttpURL}/api/v1/sendRequest`,{friendId} ,{
                headers: {
                    token
                },
            })

            if (response.data && response.data.success) {
                // Refresh pending requests
                const pendingRes = await fetchFriendRequests("pending");
                const pendingReqs = pendingRes.requests || [];
                if (userInfo) {
                    const tempRec = pendingReqs.filter(
                        (request: any) => request.requestee_id == userInfo.id
                    );
                    setRecievedRequests(tempRec);

                    const tempSent = pendingReqs.filter(
                        (req: any) => req.requester_id == userInfo.id
                    );
                    setSentRequests(tempSent);
                }
            }

            return response.data;
        } catch (error) {
           console.log(error);
           return {
            success: false,
            error: error
           } 
        }
    }

    const fetchStoredChats = async(recieverId: number) => {
        try {
            const response = await axios.get(`${serverHttpURL}/api/v1/room/fetchmessages`, {
                headers: {
                    token: getToken()
                },
                params: {
                    rec_id: recieverId
                }
            })
            return response.data;
        } catch (error) {
           console.log(error);
           return {
            success: false,
            error: error
           } 
        }
    }

    return ( 
       <SocketContext.Provider value={{selectedPerson, reqHandeler, sendFriendRequest, fetchStoredChats, setSelectedPerson, webSocketRef, recievedRequests, setRecievedRequests, userData, acceptedRequests, setAcceptedRequests, sentRequests, setSentRequests, fetchFriendRequests, setUserData, currentMsgs, setCurrentMsgs, serverURL}}>
           {children}
       </SocketContext.Provider> 
     );
}

export default AppContextProvider;
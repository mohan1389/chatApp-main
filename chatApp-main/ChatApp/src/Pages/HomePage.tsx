import { useContext, useEffect, useState } from "react";
import ChatArea from "../Components/ChatArea";
import searchImg from '../assets/search-sort-svgrepo-com.svg'
import plusImg from '../assets/plus-square-svgrepo-com.svg'
import { SocketContext } from "../AppContext";
import { AuthContext } from "../AuthContext";
import defImg from '../assets/profile-default-svgrepo-com.svg'
import ReqModel from "../Components/ReqModel";
import { useNavigate } from "react-router";


function HomePage({toggleModel}: any) {
    const [, setSearchWord] = useState<string>("");
    const {selectedPerson, setSelectedPerson, userData,fetchFriendRequests, sentRequests, setSentRequests, recievedRequests, setRecievedRequests, acceptedRequests, setAcceptedRequests} = useContext(SocketContext)
    const {fetchUser, setUserInfo, getToken, userInfo} = useContext(AuthContext);
    const [selectSentReqModel, setSelectSentModel] = useState<boolean>(true);
    const [openReqModel, setOpenReqModel] = useState<boolean>(false);
    const searchInputHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if(!token){
            navigate('/');
        }
    }, [])

    const selectModalHandeler = (e: any) => {
        if(e.target.id == "sentReq"){
            setSelectSentModel(true);
            setOpenReqModel(true);
        }else{
            setSelectSentModel(false);
            setOpenReqModel(true);
        }
    }

    useEffect(() => {
        fetchUser(userData.userName).then((res:any) => {setUserInfo(res.user)});
        // fetchFriendRequests("accepted").then((res:any) => {
        //     setAcceptedRequests(res.requests);
        //     setSelectedPerson(res.requests[0]['user_id']);
        // });

        fetchFriendRequests("accepted").then((res:any) => {
        setAcceptedRequests(res.requests || []);
            if (res.requests && res.requests.length > 0) {
                setSelectedPerson(res.requests[0].user_id);
            }
        });
    }, [])

    useEffect(() => {
        if(userInfo){
            // fetchFriendRequests("pending").then((res:any) => {
            //     let temp = res.requests.filter((request:any) => request.requestee_id == userInfo.id);
            //     setRecievedRequests(temp);
            //     temp = res.requests.filter((req:any) => req.requester_id == userInfo.id);
            //     setSentRequests(temp);
            // });

            fetchFriendRequests("pending").then((res:any) => {

                const requests = res.requests || [];

                let temp = requests.filter(
                    (request:any) => request.requestee_id == userInfo.id
                );

                setRecievedRequests(temp);

                temp = requests.filter(
                    (req:any) => req.requester_id == userInfo.id
                );

                setSentRequests(temp);
            });
            
        }
    }, [userInfo])

    return ( 
        <div className="flex w-full flex-grow px-4 md:px-6 py-4 md:py-6 gap-x-4 md:gap-x-6 min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] overflow-hidden animate-fadeIn">
            {
                openReqModel && <ReqModel setOpenReqModel = {setOpenReqModel} selectSentReqModel = {selectSentReqModel}/>
            }
            
            {/* Left Sidebar: Friends & Requests */}
            <div className="editorial-card w-4/12 md:w-3/12 flex flex-col gap-y-4 p-4 bg-[--accent-sand-light]">
                {/* Search & Actions Bar */}
                <div className="flex gap-x-2 w-full h-[40px] items-center">
                    <div className="relative flex-grow h-full">
                        <input 
                            type="text" 
                            className="tactile-input h-full pr-10 py-1 text-sm rounded-xl" 
                            placeholder="Search friends..." 
                            id="search" 
                            onChange={searchInputHandeler}
                        />
                        <button className="absolute right-2 top-[50%] translate-y-[-50%] flex items-center justify-center p-1 rounded-lg hover:bg-[--accent-sand-dark] transition-all">
                            <img className="size-[20px] opacity-60" src={searchImg} alt="search"/>
                        </button>
                    </div>
                    
                    <button 
                        onClick={toggleModel}
                        className="btn-tactile btn-tactile-secondary h-full aspect-square p-0 flex justify-center items-center rounded-xl"
                        title="Add Friend"
                    >
                        <img className="size-[18px] opacity-75" src={plusImg} alt="add"/>
                    </button>
                </div>
                
                {/* Friends List Scroll Area */}
                <div className="flex flex-col gap-y-2 flex-grow overflow-y-auto pr-1">
                    {
                        acceptedRequests && acceptedRequests.length > 0 ? (
                            acceptedRequests.map((friend: any) => (
                                <div 
                                    key={friend.request_id} 
                                    onClick={() => setSelectedPerson(friend['user_id'])} 
                                    className={`friend-card flex items-center gap-x-3 p-2.5 ${selectedPerson == friend['user_id'] ? 'active' : ''}`}
                                >
                                    <div className="relative">
                                        <img src={defImg} className="size-[42px] rounded-full border border-[--border-cozy] bg-white filter sepia-[0.3] brightness-[0.95] saturate-[0.8] hover:saturate-100 transition-all"/>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[--accent-sage] border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="friend-name font-bold text-sm text-[--text-primary] truncate">{friend.friend_username}</span>
                                        <span className="text-xs text-[--text-muted] font-mono truncate">ID: {friend.user_id}</span>
                                    </div>  
                                </div>
                            ))
                        ) : (
                            <div className="flex-grow flex flex-col justify-center items-center p-6 text-center text-[--text-muted]">
                                <span className="serif-italic text-sm">No conversations yet.</span>
                                <span className="text-xs mt-1">Click the plus button to add a friend!</span>
                            </div>
                        )
                    }    
                </div>
                
                {/* Requests Tabs */}
                <div className="flex flex-col gap-y-2 border-t border-[--border-cozy] pt-3">
                    <button 
                        id="sentReq" 
                        onClick={selectModalHandeler} 
                        className="w-full btn-tactile btn-tactile-secondary justify-between text-xs py-2.5 px-4 font-semibold rounded-xl"
                    >
                        <span className="pointer-events-none">Sent Requests</span>
                        {sentRequests.length > 0 && (
                            <span className="badge-count pointer-events-none">{sentRequests.length}</span>
                        )}
                    </button>
                    
                    <button 
                        id="recReq" 
                        onClick={selectModalHandeler} 
                        className="w-full btn-tactile btn-tactile-secondary justify-between text-xs py-2.5 px-4 font-semibold rounded-xl"
                    >
                        <span className="pointer-events-none">Received Requests</span>
                        {recievedRequests.length > 0 && (
                            <span className="badge-count pointer-events-none">{recievedRequests.length}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Main Chat Frame */}
            <div className="editorial-card w-8/12 md:w-9/12 overflow-hidden flex flex-col bg-white">
                <ChatArea selected={selectedPerson}/>
            </div>
        </div>
     );
}

export default HomePage;
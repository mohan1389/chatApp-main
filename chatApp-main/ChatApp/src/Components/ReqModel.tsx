import { useContext } from "react";
import plusImg from '../assets/plus-square-svgrepo-com.svg'
import { SocketContext } from "../AppContext";
import ReqCard from "./ui/ReqCard";

function ReqModel({setOpenReqModel, selectSentReqModel}:{setOpenReqModel: any, selectSentReqModel: boolean}) {
    const {sentRequests, recievedRequests} = useContext(SocketContext)
    console.log('model type: ', selectSentReqModel);
    const closeModelHandeler = () =>{
        setOpenReqModel((prev:Boolean) => !prev)
    }
    return ( 
        <div className="fixed inset-0 ambient-overlay flex justify-center items-center z-50 p-4">
            <div className="editorial-card w-full max-w-[600px] max-h-[60vh] flex flex-col p-6 animate-fadeIn relative">
                {/* Header */}
                <div className="flex justify-between items-center w-full border-b border-[--border-cozy] pb-3.5 mb-4">
                    <span className="brand-title text-xl text-[--accent-sage] font-bold">
                        {selectSentReqModel ? "Sent Friend Requests" : "Received Friend Requests"}
                    </span>
                    <button 
                        onClick={closeModelHandeler}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[--accent-clay-light] transition-all"
                        title="Close"
                    >
                        <img src={plusImg} className='rotate-45 size-[18px] filter sepia hue-rotate-[320deg] saturate-200' alt="close"/>
                    </button>
                </div>

                {/* Content Stream (Scrollable) */}
                <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-y-3.5 justify-start items-center py-2 min-h-[30vh]">
                    {
                        selectSentReqModel ? (
                            sentRequests.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    {sentRequests.map((req:any, index: number) => (
                                        <ReqCard key={index} req={req} setOpenReqModel={setOpenReqModel}/>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center m-auto text-center p-6">
                                    <span className="serif-italic text-sm text-[--text-secondary]">No sent requests pending</span>
                                    <span className="text-xs text-[--text-muted] mt-1">Add friends via the sidebar search menu!</span>
                                </div>
                            )
                        ) : (
                            recievedRequests.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    {recievedRequests.map((req:any, index: number) => (
                                        <ReqCard key={index} req={req} setOpenReqModel={setOpenReqModel}/>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center m-auto text-center p-6">
                                    <span className="serif-italic text-sm text-[--text-secondary]">No received requests pending</span>
                                    <span className="text-xs text-[--text-muted] mt-1">When friends add you, they will appear here.</span>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </div> 
    );
}

export default ReqModel;
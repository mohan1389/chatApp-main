import { useContext } from 'react';
import defImg from '../../assets/profile-default-svgrepo-com.svg'
import { AuthContext } from '../../AuthContext';
import { SocketContext } from '../../AppContext';

function ReqCard({req, setOpenReqModel}:any) {
    const {userInfo} = useContext(AuthContext);
    const {reqHandeler} = useContext(SocketContext);
    const acceptHandeler = () => {
        reqHandeler(true, req.request_id);
        setOpenReqModel((prev:Boolean) => !prev)

    }
    console.log('req: ', req)
    return ( 
        <div className='editorial-card flex items-center justify-between p-3.5 bg-white border border-[--border-cozy] w-full min-w-[240px] gap-x-3'>
            <div className="flex items-center gap-x-3 min-w-0">
                <img src={defImg} className='size-[44px] rounded-full border border-[--border-cozy] bg-white filter sepia-[0.3] brightness-[0.95] saturate-[0.8]' alt="profile"/>
                <div className='flex flex-col min-w-0'>
                    <span className='font-bold text-sm text-[--text-primary] truncate'>{req.friend_username}</span>
                    <span className='text-xs text-[--text-muted] font-mono truncate'>ID: {req.user_id}</span>
                </div>
            </div>
            
            <div className='flex flex-col items-end gap-y-2 shrink-0'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-[--accent-clay] bg-[--accent-clay-light] px-2 py-0.5 rounded-full'>
                    Pending
                </span>
                {
                    req.requester_id != userInfo.id ? (
                        <button 
                            onClick={acceptHandeler} 
                            className='btn-tactile btn-tactile-primary py-1 px-3.5 text-xs font-bold rounded-lg tracking-wider uppercase'
                        >
                            Accept
                        </button>
                    ) : null
                }
            </div>
        </div> 
    );
}

export default ReqCard;
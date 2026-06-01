import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router";

function NavBar() {
    const naviage = useNavigate();
    const {userInfo} = useContext(AuthContext);
    const {signInPage, setSignInPage, signOut} = useContext(AuthContext);

    const changePage = () => {
        setSignInPage((prev: boolean) => !prev)
    }

    const signOutHandeler = () => {
        signOut();
        naviage('/')
    }

    return ( 
        <div className="w-full sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-[--border-cozy] px-6 py-3.5 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-x-2">
                <span className="brand-title text-2xl text-[--accent-sage] font-bold">ChatLine</span>
                <span className="serif-italic text-xs text-[--text-secondary] mt-1.5 hidden sm:inline">a cozy space</span>
            </div> 
            
            {
                userInfo ? (
                    <div className="flex gap-x-4 md:gap-x-6 justify-center items-center font-sans text-xs md:text-sm">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-[--accent-sand-light] border border-[--border-cozy] rounded-full px-4 py-1.5 text-[--text-primary]">
                            <span>
                                <span className="text-[--text-secondary] font-medium mr-1">user:</span> 
                                <span className="font-bold text-[--accent-sage]">{userInfo.username}</span>
                            </span> 
                            <span className="hidden md:inline text-[--text-muted]">|</span>
                            <span>
                                <span className="text-[--text-secondary] font-medium mr-1">id:</span> 
                                <span className="font-mono text-xs bg-white border border-[--border-cozy] px-1.5 py-0.5 rounded">{userInfo.id}</span>
                            </span>
                            <span className="hidden lg:inline text-[--text-muted]">|</span>
                            <span className="hidden lg:inline">
                                <span className="text-[--text-secondary] font-medium mr-1">email:</span> 
                                <span className="font-medium text-[--text-primary]">{userInfo.email}</span>
                            </span>
                        </div>
                        
                        <button 
                            onClick={signOutHandeler} 
                            className="btn-tactile btn-tactile-text text-xs md:text-sm font-semibold hover:bg-[--accent-clay-light] hover:text-[--accent-clay] rounded-full py-1.5 px-4"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-x-5 justify-center items-center font-sans text-sm">
                        <button 
                            onClick={changePage} 
                            className="btn-tactile btn-tactile-primary text-xs md:text-sm rounded-full py-1.5 px-5 font-semibold"
                        >
                            {signInPage ? "Create Account" : "Sign In"}
                        </button>
                    </div>
                )
            }
        </div> 
    );
}

export default NavBar;
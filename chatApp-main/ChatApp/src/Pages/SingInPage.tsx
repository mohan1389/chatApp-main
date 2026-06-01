import { useContext, useEffect} from "react";
import { SocketContext } from "../AppContext";
import { useNavigate } from "react-router";
import { AuthContext } from "../AuthContext";

function SignInPage({changeHandeler}: any) {
    const navigate = useNavigate(); 
    const {userData} = useContext(SocketContext)
    const {signUp, signIn, signInPage, getToken} = useContext(AuthContext);

    useEffect(() => {
        const token = getToken();
        if(token){
            navigate('/chat');
        }
    }, [])

    const submitHandeler = async() => {
        console.log(userData)
        if(signInPage == true){
            const res = await signIn(userData.userName, userData.email, userData.password);
            console.log(res);
            if(res?.success){
                navigate('/chat')
            }
            else{
                console.log(res?.message);
            }
        }else{
            const res = await signUp(userData.userName, userData.email, userData.password);
            if(res?.success){
                navigate('/chat')
            }
            else{
                window.alert(res?.message + "! Sign in via signIn page");
            }
        }
    }

    return ( 
        <div className="w-full flex-grow flex justify-center items-center px-4 py-12 md:py-20 animate-fadeIn">
            <div className="editorial-card w-full max-w-[450px] p-8 md:p-10 flex justify-center gap-y-6 items-center flex-col">
                <div className="text-center flex flex-col gap-y-2">
                    <h1 className="brand-title text-4xl text-[--accent-sage] font-bold">
                        {signInPage ? "Welcome Back" : "Begin Your Journey"}
                    </h1>
                    <p className="font-sans text-xs md:text-sm text-[--text-secondary]">
                        {signInPage 
                            ? "Sign in to return to your cozy corner of the web." 
                            : "Create an account to experience simple, clean conversation."
                        }
                    </p>
                </div>
                
                <div className="flex gap-y-4 flex-col w-full">
                    <div className="flex flex-col gap-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[--text-secondary]" htmlFor="userName">
                            Username
                        </label>
                        <input
                            onChange={changeHandeler}
                            className="tactile-input"
                            id="userName"
                            type="text"
                            placeholder="e.g. wanderer"
                        />                
                    </div>
                    
                    <div className="flex flex-col gap-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[--text-secondary]" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            onChange={changeHandeler}
                            className="tactile-input"
                            id="email"
                            type="email"
                            placeholder="e.g. wanderer@cozy.net"
                        />                
                    </div>
                    
                    <div className="flex flex-col gap-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[--text-secondary]" htmlFor="password">
                            Password
                        </label>
                        <input
                            onChange={changeHandeler}
                            className="tactile-input"
                            id="password"
                            type="password"
                            placeholder="••••••••••••"
                        />                
                    </div>
                </div>
                
                <button 
                    onClick={submitHandeler} 
                    className="btn-tactile btn-tactile-primary w-full py-3 mt-2 text-sm uppercase tracking-wider font-bold"
                >
                    {signInPage ? "Sign In" : "Register Account"}
                </button>
            </div>
        </div> 
    );
}

export default SignInPage;
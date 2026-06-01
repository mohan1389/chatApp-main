import { useContext, useState, ChangeEvent } from 'react'
import './App.css'
import HomePage from './Pages/HomePage'
import { Route, Routes } from 'react-router'
import SignInPage from './Pages/SingInPage'
import plusImg from './assets/plus-square-svgrepo-com.svg'
import NavBar from './Components/NavBar'
import sendImg from './assets/send-svgrepo-com.svg'
import { SocketContext } from './AppContext'
function App() {
  const {setUserData, sendFriendRequest} = useContext(SocketContext);  
  const changeHandeler = (e : ChangeEvent<HTMLInputElement>) => {
          const {value, id} = e.target;
          setUserData((prev: any) => {
              return {
                  ...prev,
                  [id]: value
              }
          })
  }
  const [openModel, setOpenModel] = useState<boolean>(false);
  const toggleModel = () => {
    setOpenModel(prev => !prev);
  }
  const [friendInput, setFriendInput] = useState<string>("");
  const inputHandeler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFriendInput(e.target.value);
  }
  const sendHandeler = async () => {
    if (friendInput.trim()) {
      const res = await sendFriendRequest(friendInput.trim());
      if (res && res.message) {
        alert(res.message);
      }
      setFriendInput("");
      setOpenModel(prev => !prev);
    }
  }
  return (
    <div className='app-shell w-full relative min-h-screen flex flex-col'>
      <NavBar/>
      {
        openModel ? (
        <div className="fixed inset-0 ambient-overlay z-50 flex justify-center items-center p-4">
          <div className="editorial-card w-full max-w-[400px] flex flex-col gap-y-5 p-6 animate-fadeIn">
            <div className='flex justify-between items-center w-full'>
              <span className='brand-title text-xl text-[--accent-sage] font-bold'>Send Friend Request</span>
              <button 
                onClick={toggleModel} 
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[--accent-clay-light] transition-all"
              >
                <img src={plusImg} className='rotate-45 size-[20px] filter sepia hue-rotate-[320deg] saturate-200' alt="close"/>
              </button>
            </div>
            
            <div className='flex gap-x-2.5 items-center w-full'>
              <input 
                onChange={inputHandeler} 
                value={friendInput} 
                type="text" 
                placeholder="Enter username or ID" 
                className="tactile-input flex-grow"
              />
              <button 
                onClick={sendHandeler} 
                className="btn-tactile btn-tactile-primary py-2.5 px-4 h-[44px] flex items-center justify-center"
              >
                <img src={sendImg} className='size-[20px] invert brightness-200' alt="send"/>
              </button>
            </div>
          </div>
        </div>
        ) : null 
      }
      
      <div className="w-full flex-grow flex flex-col">
        <Routes>
          <Route index element={<SignInPage changeHandeler={changeHandeler}/>}/>
          <Route path='/chat' element={<HomePage toggleModel={toggleModel} />}/>
        </Routes>
      </div>
    </div>
  )
}


export default App;
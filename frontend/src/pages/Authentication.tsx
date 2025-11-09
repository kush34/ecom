import Login from "@/components/Login";
import Register from "@/components/Register";
import { useState } from "react"

const Authentication = () => {
    const [flag,setFlag] = useState(true);
  return (
    <div>
        
        <div className="main w-full h-screen flex">
            <div className="display w-1/2 flex flex-col justify-center items-center h-screen">
                <div className="info flex flex-col items-center">
                    <span className="text-6xl font-bold">
                     Get Started
                    </span>
                    <span className="text-zinc-500">get your favourite apparel with lighting speed</span>
                </div>
                <div className="changeflag">
                    <button onClick={()=>setFlag(prev=>!prev)}>{
                        flag ? 
                        <div className="m-5 text-blue-400 cursor-pointer">
                            new? register here
                        </div>
                        :
                        <div className="m-5 text-blue-400 cursor-pointer">
                            already registered? click me
                        </div>
                    }</button>
                </div>
            </div>
            <div className="action-comp w-1/2 h-screen">
                {flag ?
                    <Login/>
                    :    
                    <Register/>
                }
            </div>
        </div>
    </div>
  )
}

export default Authentication
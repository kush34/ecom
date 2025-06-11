import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="text-xl xl:text-4xl font-bold">
            Page Not Found : (
        </div>
         <button onClick={()=>navigate("/")} className="cursor-pointer text-white bg-black px-5 rounded py-3">
             Home page
         </button>
    </div>
  )
}

export default NotFound
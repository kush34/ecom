import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState<String>();
  const [password, setPassword] = useState<String>();
  const navigate = useNavigate();
  const submitFunction = async () => {
    try {
      if (!email?.trim() || !password?.trim()) return;

      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      toast("Login Successful");
      navigate("/");
    } catch (error: any) {
      if (error.response) {

        // Server responded with non-2xx status
        console.log("Error response:", error.response);
        const message = error.response.data?.error || "Login failed";
        toast.error(message);
      } else if (error.request) {

        // No response from server
        console.log("No response:", error.request);
        toast.error("Server not responding");
      } else {

        // Something else went wrong
        console.log("Axios config error:", error.message);
        toast.error("Unexpected error");
      }
    }
  };

  return (
    <div className="flex justify-center flex-col gap-5 items-center h-full w-full">
      <div className="flex flex-col justify-center items-center">
        <div className="text-4xl">
          Login
        </div>
        <p className="text-sm text-zinc-400">fill out your credentials to login</p>
      </div>
      <div className="form flex gap-5 flex-col ">
        <div className="email">
          <input onChange={(e) => setEmail(e.target.value)} type="text" className="bg-zinc-200 px-5 py-2 outline-none" placeholder="enter your email" name="" id="email" />
        </div>
        <div className="password">
          <input onChange={(e) => setPassword(e.target.value)} type="password" className="bg-zinc-200 px-5 py-2 outline-none" placeholder="choose your password" name="" id="pass" />
        </div>
        <div className="submit flex justify-center ">
          <button onClick={() => submitFunction()} className="cursor-pointer  ease-in duraiton-100 font-medium bg-zinc-600 text-white rounded px-5 py-2 hover:bg-zinc-700">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default Login
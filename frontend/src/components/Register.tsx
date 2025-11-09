import axios from "axios";
import { useState } from "react"
import { toast } from "sonner";

const Register = () => {
  const [email, setEmail] = useState<String>();
  const [password, setPassword] = useState<String>();
  const [rpassword, setRPassword] = useState<String>();
  const submitFunction = async () => {
    try {
      if (!email || !password || email === "" || password == "" || rpassword == "" || !rpassword || rpassword !== password) return;
      // console.log(email + " " + password + " "+ rpassword)
      const response = await axios.post(`${import.meta.env.VITE_Backend_URL}/user/register`, { email, password });
      if (response.status === 200) {
        toast.success("Your account is registered. Pls login.")
      }
      console.log(response);
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
  }
  return (
    <div className="flex justify-center flex-col gap-5 items-center h-full w-full">
      <div className="flex flex-col justify-center items-center">
        <div className="text-4xl">
          Register
        </div>
        <p className="text-sm text-zinc-400">fill out the form to Register your self</p>
      </div>
      <div className="form flex gap-5 flex-col ">
        <div className="email">
          <input onChange={(e) => setEmail(e.target.value)} type="text" className="bg-zinc-200 px-5 py-2 outline-none" placeholder="enter your email" name="" id="email" />
        </div>
        <div className="password">
          <input onChange={(e) => setPassword(e.target.value)} type="password" className="bg-zinc-200 px-5 py-2 outline-none" placeholder="choose your password" name="" id="pass" />
        </div>
        <div className="password">
          <input onChange={(e) => setRPassword(e.target.value)} type="password" className="bg-zinc-200 px-5 py-2 outline-none" placeholder="re-enter your password" name="" id="rpass" />
        </div>
        <div className="submit flex justify-center ">
          <button onClick={() => submitFunction()} className="cursor-pointer  ease-in duraiton-100 font-medium bg-zinc-600 text-white rounded px-5 py-2 hover:bg-zinc-700">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default Register
import {useNavigate, useParams} from "react-router-dom";
const PaymentSuccess = () => {
    const {id} = useParams();
    const navigate  = useNavigate();
  return (
    <div className="bg-zinc-900 h-screen w-full text-white flex justify-center items-center">
        Payment Success: <span className="text-green-600 font-light mx-5">{id}</span>
        <button className="bg-white text-black px-5 py-2 cursor-pointer" onClick={()=>navigate("/")}>Continue Shopping</button>
    </div>
  )
}

export default PaymentSuccess
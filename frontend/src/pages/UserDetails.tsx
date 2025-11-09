import { UserContext } from "@/store/UserContext"
import { useContext } from "react"

const UserDetails = () => {
  const userCtx = useContext(UserContext);
  const user = userCtx?.user;
  return (
    <div className="text-3xl p-5">
        Account:{user?.email}
    </div>
  )
}

export default UserDetails
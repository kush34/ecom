import { UserContext } from '@/store/UserContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminPage = () => {
  const userCtx = useContext(UserContext);
  const user = userCtx ? userCtx.user : null;
  const userLoading = userCtx?.loading;
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoading) return;
    console.log(user)
    if (!userLoading && (!user || user?.role !== 'admin')) {
      toast.error("You do not have access to this page.")
      navigate("/")
    }
  }, [user, userLoading, navigate])

  if (userLoading) return <div>loading Details</div>

  if (!user || user?.role !== 'admin') return null;

  return (
    <div>
      <div className="top p-5">
        <span className='text-2xl font-bold'>Admin Dashboard</span>
      </div>
    </div>
  )
}

export default AdminPage
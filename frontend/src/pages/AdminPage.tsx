import '@fontsource/space-mono/700.css';
import { UserContext } from '@/store/UserContext'
import { axiosInstace } from '@/utils/axiosService'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Dashboard from '@/components/admin-page/dashboard';

interface AdminOrder {
  id: string;
}

const AdminPage = () => {
  const userCtx = useContext(UserContext)
  const user = userCtx?.user
  const userLoading = userCtx?.loading
  const navigate = useNavigate()
  const [orders, setOrders] = useState<AdminOrder[]>([])

  const getAdminOrders = async () => {
    try {
      const request = await axiosInstace("/user/admin/getOrders")
      const request1 = await axiosInstace("/admin/dashboard")
      console.log(request1)
      if (request.status === 200) {
        setOrders(request.data)
      }
    } catch (error) {
      console.log(error)
      toast.error("Could not fetch orders")
    }
  }

  useEffect(() => {
    if (userLoading) return
    if (!userLoading && (!user || user?.role !== 'admin')) {
      toast.error("You do not have access to this page.")
      navigate("/")
    }
  }, [user, userLoading, navigate])

  useEffect(() => {
    getAdminOrders()
  }, [])

  if (userLoading) return <div>loading Details</div>
  if (!user || user?.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1">{orders.length} total orders</p>
        </div>
        <Dashboard />
      </div>
    </div>
  )
}

export default AdminPage
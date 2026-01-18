import '@fontsource/space-mono/700.css';
import { UserContext } from '@/store/UserContext'
import { axiosInstace } from '@/utils/axiosService'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Dashboard from '@/components/admin-page/dashboard';
import Layout from '@/components/layouts/admin-page-layout';
import Orders from '@/components/admin-page/Orders';
import type { AdminOrder } from '@/components/admin-colums/admin-columns';
import Inventory from '@/components/admin-page/inventory';



const AdminPage = () => {
  const userCtx = useContext(UserContext)
  const user = userCtx?.user
  const userLoading = userCtx?.loading
  const navigate = useNavigate()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const location = useLocation();
  const getAdminOrders = async () => {
    try {
      const request = await axiosInstace("/user/admin/getOrders")
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
  if (!user || user?.role !== 'admin') return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 mx-auto">
        <div className="w-full">
          {location.pathname == '/admin' && < Dashboard />}
          {location.pathname == '/admin/orders' && < Orders data={orders} />}
          {location.pathname == '/admin/inventory' && < Inventory />}
        </div>
      </div>
    </Layout>
  )
}

export default AdminPage
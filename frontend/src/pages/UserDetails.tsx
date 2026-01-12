import { Card, CardContent } from "@/components/ui/card"
import { UserContext, type address } from "@/store/UserContext"
import { useContext, useEffect, useState } from "react"
import { axiosInstace } from "@/utils/axiosService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { UserInfoCard } from "@/components/user-details/UserInfoCard"
import { AddressSection } from "@/components/user-details/AddressSection"
import { OrdersSection } from "@/components/user-details/OrderSection"
import type { Order } from "@/components/user-details/types"

const UserDetails = () => {
  const userCtx = useContext(UserContext)
  const user = userCtx?.user
  const userLoading = userCtx?.loading
  const navigate = useNavigate()

  const [selectedAddresses, setSelectedAddresses] = useState<address[]>([])
  const [orders, setOrders] = useState<Order[]>()

  const handleDelete = () => console.log("Delete:", selectedAddresses)
  const handleUpdate = () => console.log("Update:", selectedAddresses[0])

  const getOrders = async () => {
    try {
      const request = await axiosInstace("/user/getOrders")
      if (request.status === 200) {
        setOrders(request.data)
      }
    } catch (error) {
      toast.error("Could not fetch your Orders")
      console.log(error)
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
    getOrders()
  }, [])

  if (userLoading) return <div>loading Details</div>
  if (!user || user?.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <UserInfoCard userId={user._id} email={user.email} />
          <CardContent className="p-6">
            {user.addresses && (
              <AddressSection
                addresses={user.addresses}
                selectedAddresses={selectedAddresses}
                onSelectionChange={setSelectedAddresses}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>

        {orders && orders.length > 0 && <OrdersSection orders={orders} />}
      </div>
    </div>
  )
}

export default UserDetails
import { getColumns, type AdminOrder } from "@/components/admin-colums/admin-columns"
import { DataTable } from "@/components/admin-page/data-table"
import { Package, Trash, Truck } from "lucide-react"
import { useState } from "react"
import OrderModal from "./order-display"
import { Button } from "../ui/button"

const Orders = ({ data }: { data: AdminOrder[] }) => {
    const [selectedOrders, setSelectedOrders] = useState<AdminOrder[]>([])
    const [viewOrder, setViewOrder] = useState<AdminOrder | null>(null)

    const bulkDelete = () => {
        if (!selectedOrders.length) return alert("No orders selected")
        console.log("DELETE:", selectedOrders.map(o => o._id))
        // call API here
    }

    const bulkUpdateStatus = (status: string) => {
        if (!selectedOrders.length) return alert("No orders selected")
        console.log("UPDATE:", selectedOrders.map(o => o._id), status)
        // call API here
    }

    return (
        <div className="min-h-screen">
            <div className="flex items-center justify-between py-5">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <Package /> Orders
                </h2>

                <div className="flex gap-2">
                    <Button variant={'secondary'} onClick={() => bulkUpdateStatus("shipped")} className=" flex gap-2 items-center btn">
                        <Truck /> Shipped
                    </Button>
                    <Button variant={"outline"} onClick={bulkDelete} className="btn btn-danger">
                        <Trash /> Delete
                    </Button>
                </div>
            </div>

            <DataTable
                columns={getColumns(setViewOrder)}
                data={data}
                onSelectionChange={setSelectedOrders}
            />
            {viewOrder && (
                <OrderModal
                    order={viewOrder}
                    onClose={() => setViewOrder(null)}
                />
            )}

        </div>
    )
}


export default Orders

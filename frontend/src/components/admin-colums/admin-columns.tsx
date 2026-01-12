import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

type Product = {
  product_id: {
    _id: string
    productName: string
    price: number
  }
  quantity: number
  unit_price: number
}

export type AdminOrder = {
  _id: string
  user_id: string
  products: Product[]
  total_price: number
  status: string
  address: {
    city: string
    pincode: number
    contact: string
  }
  createdAt: string
}

export const columns: ColumnDef<AdminOrder>[] = [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("_id")}</div>
    ),
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("user_id")}</div>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as Product[]
      return (
        <div className="space-y-1">
          {products.map((p, i) => (
            <div key={i} className="text-xs">
              {p.product_id.productName} × {p.quantity}
            </div>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "total_price",
    header: "Total",
    cell: ({ row }) => (
      <div className="font-semibold">₹{row.getValue("total_price")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={status === "paid" ? "default" : "secondary"}
          className={status === "paid" ? "bg-green-100 text-green-700" : ""}
        >
          {status.toUpperCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const addr = row.getValue("address") as AdminOrder["address"]
      return (
        <div className="text-xs">
          <div>{addr.city} - {addr.pincode}</div>
          <div className="text-gray-500">{addr.contact}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-xs">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </div>
    ),
  },
]
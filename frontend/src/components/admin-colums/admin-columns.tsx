import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

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
  user_id: {
    _id: string,
    email: string,
    role: string
  }
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

export const getColumns = (onView: (order: AdminOrder) => void): ColumnDef<AdminOrder>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: "Order ID",
  },
  {
    accessorKey: "user_id.email",
    header: "User Mail",
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        onClick={() => onView(row.original)}
        className="text-blue-600 hover:underline"
      >
        View
      </button>
    ),
  },
]
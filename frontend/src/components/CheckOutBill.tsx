import type { CartItem } from "@/store/CartContext"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<CartItem>[] = [
  {
    accessorKey: "productName",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Qty",
  },  
  {
    accessorKey: "price",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number(row.getValue("price"))
      return `₹${amount.toFixed(2)}`
    },
  },
]

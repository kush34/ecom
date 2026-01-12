import type { address } from "@/store/UserContext"

export type tProduct = {
  product_id: {
    _id:string
    productName:string
    description:string
  }
  unit_price: number
  quantity: number
}

export interface Order {
  _id: string
  products: tProduct[]
  total_price: number
  user_id: string
  address: address
  createdAt: Date
  status: "pending" | "paid" | "cancelled" | "failed"
}
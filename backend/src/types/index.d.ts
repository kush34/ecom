export type address = {
    city: string
    pincode: string
    contact: string
    address: string
}
export type Cart = {
    _id: string
    price?: number
    quantity: number
}
export interface User {
    email: string
    role: 'user' | 'admin'
    password: String
    address: address[]
    cart: Cart[]
}

export interface tProduct {
    productName: string
    images: String[]
    description: string
    price: number
    rating: number
}

export interface Order {
  products:Cart[]
  total_price:number
  user_id:string
  address:address
  status: "pending" | "paid" | "cancelled" | "failed"
}

export interface Payment {
    razorpay_order_id:string
    razorpay_payment_id:string
    razorpay_signature:string
}



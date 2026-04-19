import { axiosInstace } from "@/utils/axiosService"
import { Layers } from "lucide-react"
import { useEffect, useState } from "react"
import Product from "../Product"
import type { ProductType } from "@/store/CartContext"
import ProductSkeleton from "../ProductSkeleton"
import AddProductModal from "../AddProdcutModel"

const Inventory = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(false)
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axiosInstace.get("/product/getProducts")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchProducts() }, [])
  return (
    <div>
      <div className="title flex justify-between items-center p-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers /> Inventory
        </h2>

        <AddProductModal onSuccess={fetchProducts} />
      </div>
      <div>
        {
          loading ?
            <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-center flex-wrap gap-5 p-3">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
            :
            <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-center flex-wrap gap-5 p-3">
              {
                products.map((pro: ProductType) => {
                  return (
                    <Product key={pro?._id} {...pro} />
                  )
                })
              }
            </div>
        }
      </div>
    </div>
  )
}

export default Inventory

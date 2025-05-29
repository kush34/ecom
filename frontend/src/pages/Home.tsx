import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar"
import SearchBar from "@/components/SearchBar"
import ImageSlider from "@/components/ImageSlider"
import Product from "@/components/Product"
import { useEffect, useState } from "react"
const Home = () => {
  const [products,setProducts] = useState([]);
  const [loading ,setLoading] = useState(false);
  const getProducts = async ()=>{
    setLoading(true);
    const response = await fetch("http://localhost:3000/product/getProducts");
    const json = await response.json();
    console.log(json);
    setProducts(json);
    setLoading(false);
  }
  useEffect(()=>{
    getProducts();
  },[])
  return (
    <div className="w-full h-screen">
       <Toaster />
      <Navbar/>
      <SearchBar/>
      <ImageSlider/>
      <div className="w-full">
        <div className="section-title text-5xl font-bold mx-10 my-5 text-[#1d242d] flex justify-center">In Store</div>
        {
          loading ? 
          <div className="flex justify-center items-center text-xl">loading ...</div>
          :
          <div className="w-full flex justify-center flex-wrap p-3">
            {
              products.map((pro)=>{
                return(
                  <Product key={pro?._id} {...pro} />
                )
              })
            }
          </div>
        }
      </div>
      <div className="h-1/2 mt-5">
        <Footer/>
      </div>
    </div>
  )
}

export default Home
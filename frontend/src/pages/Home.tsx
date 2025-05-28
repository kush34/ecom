import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import SearchBar from "@/components/SearchBar"
import ImageSlider from "@/components/ImageSlider"
import Product from "@/components/Product"
const Home = () => {
    //Navbar
    //image slider
    //category 
    //flash sale
    // Today for you section
    // footer section
    

  return (
    <div className="w-full h-screen">
      <Navbar/>
      <SearchBar/>
      <ImageSlider/>
      <div className="w-full">
        <div className="section-title text-5xl font-bold mx-10 my-5 text-[#1d242d] flex justify-center">In Store</div>
        <div className="w-full flex justify-center flex-wrap p-3">
          <Product/>
          <Product/>
          <Product/>
        </div>
      </div>
      <div className="h-1/2 mt-5">
        <Footer/>
      </div>
    </div>
  )
}

export default Home
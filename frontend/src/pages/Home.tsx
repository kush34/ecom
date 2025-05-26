import Footer from "@/components/footer"
import Navbar from "@/components/Navbar"
import SearchBar from "@/components/SearchBar"

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
      <div className="h-1/2 mt-5">
        <Footer/>
      </div>
    </div>
  )
}

export default Home
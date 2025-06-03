import { useEffect, useState } from "react"

const ImageSlider = () => {
    const [images,_setImages] = useState(["img1.jpg", "img2.jpg","img3.jpg","img4.jpg"]);
    const [count,setCount] = useState(0);

    const updateImages = ()=>{
        setCount(prev => (prev+1)%4);
    }
    useEffect(()=>{

        setInterval(updateImages,3000);
    },[])
  return (
<div className="w-full mt-5 relative">
  <div className="w-full">
    <img className="w-full h-[80vh] object-cover" src={`${images[count]}`} alt="" />
    <div className="absolute backdrop-opacity-70 top-0 left-0 
    w-full h-full z-10 flex flex-col justify-center items-center text-white text-6xl font-bold bg-black/30">
      <div>#Big Fashion Sale</div>
      <span className="mt-5 text-4xl font-bold">Limited time offer<br/> Upto 50% OFF!</span>
    </div>
  </div>
</div>

  )
}

export default ImageSlider
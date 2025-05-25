import { Smartphone } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="text-grey-600 flex justify-between py-2 text-zinc-500 border-b w-full border-b-zinc-500 bg-zinc-100">
        <div className="mx-5 flex items-center gap-1 cursor-pointer">
          <Smartphone size={16}/>
          Download BeliBeli App
        </div>
        <div className="navlinks flex mx-5 font-medium">
          <ul className="flex gap-3 mx-3">
            <li className='cursor-pointer'>Mitra BeliBeli</li>
            <li className='cursor-pointer'>About BeliBeli</li>
            <li className='cursor-pointer'>BeliBeli Care</li>
            <li className='cursor-pointer'>Promo</li>
          </ul>
          <ul className="flex gap-5 text-zinc-700 font-medium">
            <li className='cursor-pointer'>Sign Up</li>
            <li className='cursor-pointer'>Login</li>
          </ul>
        </div>
    </div>
  )
}

export default Navbar
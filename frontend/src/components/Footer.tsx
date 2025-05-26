import { Facebook } from 'lucide-react';
import { Instagram } from 'lucide-react';
import { Twitter } from 'lucide-react';
import { Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="flex bg-[#1d242d] justify-around text-white py-24">
        <div className="brandId flex items-between flex-col">
            <div className="font-medium flex flex-col gap-2">
                <div className="title text-4xl">BeliBeli.com</div>
                <div className="tagline text-xl">"Let's Shop Beyound Boundaries"</div>
            </div>
            <div className="social-links m-5 text-[#767e87]">
                <ul className="flex gap-5">
                    <li><Facebook /></li>
                    <li><Twitter /></li>
                    <li><Youtube /></li>
                    <li><Instagram /></li>
                </ul>
            </div>
        </div>
        <div className="belibeli">
            <div className="font-medium text-[#767e87] text-2xl my-5">
                BeliBeli 
            </div>
            <ul className="flex flex-col gap-2">
                <li>About BeliBleli</li>
                <li>Career</li>
                <li>Mitra Blog</li>
                <li>B2B Digital</li>
            </ul>
        </div>
        <div className="buy">
            <div className="font-medium text-[#767e87] text-2xl my-5">
                Buy
            </div>
            <ul className='flex flex-col gap-2'>
                <li>Bill & Top Up</li>
                <li>BeliBeli COD</li>
                <li>Mitra Blog</li>
                <li>Promo</li>
            </ul>
        </div>
        <div className="sell">
            <div className="font-medium text-[#767e87] text-2xl my-5">
                Sell 
            </div>

            <ul className='flex flex-col gap-2'>
                <li>Seller Education Center</li>
                <li>Brand Index</li>
                <li>Register Offical Store</li>
            </ul>
        </div>
        <div className="guideNhelp">
            <div className="font-medium text-[#767e87] text-2xl my-5">
                Guide 
            </div>
            <ul className='flex flex-col gap-2'>
                <li>BeliBeli Care</li>
                <li>Term and Condition</li>
                <li>Privacy</li>
                <li>Mitra</li>
            </ul>
        </div>
    </footer>
  )
}

export default Footer
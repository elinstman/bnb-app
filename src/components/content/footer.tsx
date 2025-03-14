"use client"
import Link from 'next/link';
import { usePathname } from "next/navigation"


export default function Footer() {

    const pathname = usePathname() 

    
    return (
        <>
        <span className="block w-full h-0.5 bg-white mt-8"></span>
        <footer className="bg-[#EFEDE3] shadow-md p-8">
            <div className="container mx-auto flex flex-col md:flex-row items-start justify-between gap-8 shadow-t-lg">
                <div className="flex flex-col justify-center md:w-1/2 space-y-4">
                    <h3 className=" text-4xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">StayCation</h3>
                    <p> Stay updated with the latest staycation listings! Discover top local getaways, exclusive offers, and insider tips to make your next staycation an unforgettable adventure. Perfect escapes await right where you are! </p>
                    <div className="flex">
                        <div className="relative w-full pt-4"> 
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className="p-2 pr-32 w-full border border-gray-300 rounded-md focus:border-gray-500 focus:ring-0 transition duration-300"
                    />
                     <button 
                type="button" 
                className="absolute top-1/2 right-0 transform -translate-y-1/2 mt-2 mr-2 px-4 py-2 text-black font-semibold transition-transform duration-300 text-sm hover:text-base"
            >
                Stay Updated
            </button>
            </div>
                </div>
                </div>
               
                <div className='flex flex-col space-y-2'>  
                <p className="font-semibold">Hosting</p>                  
                <nav className="flex flex-col space-y-2">                    
                <Link href={'#'}>How to list your home</Link>
                <Link href={'#'}>Host Resources</Link>
                <Link href={'#'}>Responsible hosting</Link>
                <Link href={'#'}>Community-chat</Link>
                </nav>
                </div>
                
                <div className='flex flex-col space-y-2'>  
                <p className="font-semibold">Support</p>                  
                <nav className="flex flex-col space-y-2">                    
                   <Link className={`${pathname === "/" ? "active" : ""}`} href={'#'}>Guides</Link>
                   <Link href={'#'}>Q&A</Link>
                   <Link href={'#'}>Cancellation options</Link>
                   <Link href={'#'}>Contact Us</Link>
                </nav>
                </div>

                <div className='flex flex-col space-y-2'>  
                <p className="font-semibold">About</p>                  
                <nav className="flex flex-col space-y-2">                    
                <Link href={'#'}>The Staycation-Story</Link>
                <Link href={'#'}>Leagally</Link>
                <Link href={'#'}>Socials</Link>
                </nav>
                </div>
               
               
            </div>
        </footer>
         </>
        
    );
}

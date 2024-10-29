"use client"

import Link from "next/link"


export default function Header() {
    return (
        <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex items-center justify-start space-x-6">
            {/* Logo */}
            <div className="flex relative items-center space-x-6">
                <span className="ml-2 text-xl hidden sm:inline font-bold">StayCation</span>
            
            {/* Navigation Links */}
            <nav className="flex space-x-4">
               <Link href="#" className="text-gray-600 hover:text-gray-900">Explore</Link>
               <Link href="#" className="text-gray-600 hover:text-gray-900">Book</Link>
               <Link href="#" className="text-gray-600 hover:text-gray-900">My Account</Link>
            </nav>
           
            </div>

            <div className="relative">
    
    </div>

             {/* Input Field */}
            <div className="flex relative items-center">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="p-2 rounded-md bg-white border-transparent focus:border-gray-300 focus:ring-0 hover:border-gray-300 transition duration-300"
                    
                />
            </div>
           

        </div>


    </header>
    )
}
"use client"

import Modal from "@/components/modal";
import LoginForm from "@/components/auth/loginform"
import RegisterForm from "@/components/auth/registerform";
import { useUser } from "@/context/user";
import { Button } from "../ui/button"
import Link from "next/link"
import { useState } from "react";


export default function Header() {
    const user = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openRegisterModal = () => setIsRegisterModalOpen(true);
    const closeRegisterModal = () => setIsRegisterModalOpen(false);

    const handleLogout = () => {
        user.actions.logout();
      };

    return (
        <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex items-center justify-start space-x-6">
            {/* Logo */}
            <div className="flex relative items-center space-x-6">
                <Link href={"/"} className="ml-2 text-xl hidden sm:inline font-bold">StayCation</Link>
            
            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
               <Link href="#" className="text-gray-600 hover:text-gray-900">Explore</Link>
               <Link href="#" className="text-gray-600 hover:text-gray-900">Book</Link>
               {!user.token && (
                            <button onClick={openRegisterModal} className="text-gray-600 hover:text-gray-900">
                                Register
                            </button>
                        )}
               {user.token ? (
            <Button onClick={handleLogout}>
              Sign out
            </Button>
          ) : (
            <button onClick={openModal} className="text-gray-600 hover:text-gray-900">
              Sign in
            </button>
          )}
            </nav>
           
            </div>

            <div className="relative">
    
    </div>

            {user.token && (
              <Link href="/rent-your-home" className="flex relative items-center">
              Rent out your home
             </Link>
            )}
            
           

        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LoginForm onLoginSuccess={closeModal} />
      </Modal>

      <Modal isOpen={isRegisterModalOpen} onClose={closeRegisterModal}>
        <RegisterForm onRegisterSuccess={closeRegisterModal} />
      </Modal>
    </header>
    )
}
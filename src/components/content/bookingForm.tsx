"use client"

import { useState, useEffect } from "react";
import { useBookings } from "@/context/bookings";
import { useProperties } from "@/context/property";
import { CldImage } from 'next-cloudinary';
import Modal from "../modal"
import BookingCalendar from "@/components/content/bookingCalender"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function BookingForm() {
    const {properties}  = useProperties();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const { userId, loading, fetchUserId } = useBookings();

    const openModal = (propertyId: string) => {
        setSelectedPropertyId(propertyId); // Sätt den valda propertyn
        console.log("vald property:", propertyId);
        setIsModalOpen(true);
        fetchUserId();
        console.log("inloggad user Id: ", userId);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    } 
    
    useEffect(() => {
        // Hämta userId när modalen öppnas och det inte finns något userId
        if (isModalOpen && !userId && !loading) {
            fetchUserId(); // Hämta userId från API
            console.log("Hämtar userId...");
        }
    }, [isModalOpen, userId, loading, fetchUserId]);


    return (
        <section className="container mx-auto p-8 gap-6">
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
             <div className="flex justify-center px-4 sm:px-8">
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-full gap-4 p-4 sm:p-6 lg:p-8">
                {properties && properties.length > 0 ? (
            properties.map((property) => (

          <button onClick={() => openModal(property.id)}  key={property.id} >
            <div className="flex flex-col p-2 rounded-md w-full transition-transform duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-gray-100"> 
            <div className="relative mb-4 w-full aspect-w-3 aspect-h-4">

            <CldImage
            src="house-cabin-snow"
            alt={property.name}
            width="500"
            height="500"
            crop={{
            type: 'auto',
            source: true
             }}
             className="object-cover rounded-xl"
            />

            </div>
            <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{property.name}</h2>
            <p className="text-lg text-gray-900">{property.location}</p>
            <p className="text-lg text-gray-900">Price per night: {property.pricePerNight}kr</p>
            <p className="text-lg text-gray-900">Available: {property.available ? 'Yes' : 'No'}</p>
            </div>
            
          </div>
          </button>
        ))
      ) : (
        <p>No properties found.</p>
      )}
      </div>
     
               

            </div>

          <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedPropertyId ? (
                    <BookingCalendar choosenProperty={selectedPropertyId} userId={userId} closeModal={closeModal} />
                ) : (
                    <p>Loading...</p>
                )}
            </Modal> 
        </section>

    )
}
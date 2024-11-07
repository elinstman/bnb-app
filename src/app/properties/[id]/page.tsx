"use client"
import Header from "@/components/content/header";
import Footer from "@/components/content/footer";
import { useProperties } from "@/context/property";
import { useUser } from "@/context/user";
import { CldImage } from 'next-cloudinary';
import { Property } from "@/app/types/property";
import { useState, useEffect } from "react";
import Modal from "@/components/modal";
import EditProperty from "@/components/content/editProperty";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type PropertyDetailsProps = {
    params: { id: string }; 
};

export default function PropertyDetails({ params }: PropertyDetailsProps) {
    const { properties, actions  } = useProperties();
    const user = useUser();
    const [property, setProperty] = useState<Property | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showBookings, setShowBookings] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    useEffect(() => {
        if (params.id && properties) {
            const foundProperty = properties.find((prop: Property) => prop.id === params.id);
            setProperty(foundProperty);
        }
    }, [params.id, properties]);

    const handleSave = (updatedProperty: Property) => {
        if (actions?.updateProperty) {
            actions.updateProperty(updatedProperty); 
            setProperty(updatedProperty); // Updates local state
            closeModal();
        }

        toast.success("The property has been successfully updated!");
    };

    if (!property) {
        return <div>Loading property details...</div>;
    }
   
    const handleDelete = async () => {
        if (actions?.deleteProperty) {
          const url = window.location.pathname;
          const propertyId = url.split("/").pop(); 
          
          console.log("Property ID från webbadressen: ", propertyId);
      
          if (propertyId) {
            try {
              await actions.deleteProperty(propertyId);
              console.log(`Property with ID ${propertyId} deleted successfully.`);

              toast.success(`The property "${property?.name}" has been successfully deleted.`);
              
              window.location.replace("/");
            } catch (error) {
              console.error("Error while deleting property: ", error);
            }
          } else {
            console.error("Property ID could not be extracted from the URL");
          }
        }
    };

    const hasBookings = property?.bookings && property.bookings.length > 0;

    function calculateNights(checkInDate: string, checkOutDate: string): number {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
    
        // Calculate the difference in days, adding 1 to include the first night
        const timeDifference = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Adding 1 to count the first night
    
        return Math.max(0, nights); // Ensure non-negative number
    }

    return (
        <div>
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
             <Header />
        <div className="container mx-auto p-8">
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
            <h1 className="text-4xl font-bold">{property.name}</h1>
            <p>{property.description}</p>
            <p>{property.location}</p>
            <p>Price per night: {property.pricePerNight}kr</p>
            <p>Available: {property.available ? "Yes" : "No"}</p>
            {user.token && (
                <div className="flex gap-2 mt-2"> 
                <div className="gap-2 mt-2 "> 
                <Button 
                 onClick={openModal}
                 >Edit</Button> 
                </div>
                     

                    {user.token && (
                    <div className="gap-2 mt-2">
                        {/* If there are bookings, show a warning instead of the delete button */}
                        {hasBookings ? (
                            <p className="text-red-500 font-semibold">Cannot be deleted due to active bookings.</p>
                        ) : (
                            <Button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">Delete</Button>
                        )} 
                    </div>
                )}
                 </div>
            )}
             {/* "Visa bokningar"-knapp */}
             {hasBookings && (
                    <div className="mt-4">
                        <button className="hover:text-xl" onClick={() => setShowBookings((prev) => !prev)}>
                            {showBookings ? "Hide bookings" : "Show bookings"}
                        </button>
                    </div>
                )}
                
                {/* Visa bokningar om showBookings är true */}
                {showBookings && hasBookings && (
                    <div className="mt-4">
                        <h2 className="text-2xl font-semibold">Bookings:</h2>
                        <ul className="space-y-4">
                            {property.bookings.map((booking) => (
                                <li key={booking.id} className="p-4 border-b">
                                    <p><strong>Check-in:</strong>  {format(new Date(booking.checkInDate), 'dd MMM yyyy')}</p>
                                    <p><strong>Check-out:</strong> {format(new Date(booking.checkOutDate), 'dd MMM yyyy')}</p>
                                    <p className="text-black"><strong>Total price</strong> {booking.totalPrice}kr for {calculateNights(booking.checkInDate, booking.checkOutDate)} nights.</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
          
           
        </div>
        <Footer />
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <EditProperty property={property} onSave={handleSave} onClose={closeModal} />
        </Modal>
        </div>
    );
        
        
};



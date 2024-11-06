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

type PropertyDetailsProps = {
    params: { id: string }; 
};

export default function PropertyDetails({ params }: PropertyDetailsProps) {
    const { properties, actions  } = useProperties();
    const user = useUser();
    const [property, setProperty] = useState<Property | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
          // Extrahera ID från URL
          const url = window.location.pathname;
          const propertyId = url.split("/").pop(); // Hämtar sista delen av URL:en
          
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
                     <Button 
                 onClick={openModal}
                 >Edit</Button>  
                 <Button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">Delete</Button>              
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



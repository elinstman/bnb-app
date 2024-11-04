"use client"

import { useProperties } from "@/context/property";
import Image from "next/image";
import { CldImage } from 'next-cloudinary';

export default function Properties() {
    const { properties, loading, error } = useProperties();

    console.log("Properties Data:", properties);

    return (
        <section  className="container mx-auto p-8">
            <div className="flex flex-col items-start w-full space-y-4 sm:items-start sm:w-1/2">
            <div> 
            <h2 className="text-4xl font-bold mb-8"> Propertis </h2>
            <p className="text-lg flex-wrap text-black">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt vero laudantium, nam cumque quos maxime! Ipsa laboriosam quas esse! Voluptatem modi consectetur nam quia excepturi sapiente laboriosam molestiae, eaque tempore! </p>
            </div>
            <div className="flex flex-wrap justify-center space-x-2 mt-8">  
            </div>           
            </div>
            <div className="flex justify-center px-4 sm:px-8">
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-full gap-4 p-4 sm:p-6 lg:p-8">
                {properties && properties.length > 0 ? (
            properties.map((property) => (
          <div key={property.id} className="flex flex-col border p-2 rounded-md shadow-md w-full transition-transform duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-gray-100">
            <div className="relative mb-4 w-full aspect-w-3 aspect-h-4">

            <CldImage
            src="cld-sample-5" // Use this sample image or upload your own via the Media Explorer
            alt={property.name}
            width="500" // Transform the image: auto-crop to square aspect_ratio
            height="500"
            crop={{
            type: 'auto',
            source: true
             }}
            />

            {/* <Image
            className="object-cover rounded-md"
            alt={property.name}
            src={`https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`} // URL till bilden
            width={500} // Ange bredd och höjd
            height={300}
            layout="responsive" // Layoutalternativ för responsiv design
            quality={75} // Kvalitetsinställning (valfritt)
            /> */}
            </div>
            <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{property.name}</h2>
            <p className="text-lg text-gray-900">{property.description}</p>
            <p className="text-lg text-gray-900">Location: {property.location}</p>
            <p className="text-lg text-gray-900">Price per night: ${property.pricePerNight}</p>
            <p className="text-lg text-gray-900">Available: {property.available ? 'Yes' : 'No'}</p>
            </div>
            
          </div>
        ))
      ) : (
        <p>No properties found.</p>
      )}
                </div>

            </div>
        </section>
    )
}
"use client"

import { useProperties } from "@/context/property";
import { CldImage } from 'next-cloudinary';
import Link from "next/link";

export default function Properties() {
    const { properties, loading, error } = useProperties();

    console.log("Properties Data:", properties);

    return (
        <section  className="container mx-auto p-8">
            <div className="flex flex-col items-start w-full space-y-4 sm:items-start sm:w-1/2">
            <div> 
            <h2 className="text-4xl font-bold mb-8"> Find your perfect staycation! </h2>
            <p className="text-lg flex-wrap text-black">Explore our selection of charming homes that are ready to be booked for your next staycation. Each property offers unique features and amenities designed to provide you with a relaxing getaway experience. Whether you seek a cozy cabin in the woods or a modern apartment in the city, we have something for everyone.  </p>
            </div>
            <div className="flex flex-wrap justify-center space-x-2 mt-8">  
            </div>           
            </div>
            <div className="flex justify-center px-4 sm:px-8">
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-full gap-4 p-4 sm:p-6 lg:p-8">
                {properties && properties.length > 0 ? (
            properties.map((property) => (

          <Link key={property.id} href={`/properties/${property.id}`}>
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
            {/* <p className="text-lg text-gray-900">{property.description}</p> */}
            <p className="text-lg text-gray-900">{property.location}</p>
            <p className="text-lg text-gray-900">Price per night: {property.pricePerNight}kr</p>
            <p className="text-lg text-gray-900">Available: {property.available ? 'Yes' : 'No'}</p>
            </div>
            
          </div>
          </Link>
        ))
      ) : (
        <p>No properties found.</p>
      )}
      </div>
     
               

            </div>
        </section>
    )
}
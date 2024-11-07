"use client"

import Header from "@/components/content/header";
import Footer from "@/components/content/footer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user";
import { useProperties } from "@/context/property";
import { CldImage } from 'next-cloudinary';
import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Booking, Property } from "@/app/types/property";
import { useBookings } from "@/context/bookings";


export default function BookingDetails() {
    const user = useUser();
    const { actions } = useUser();
    // const [bookings, setBookings] = useState<Booking[]>([]);
    const { properties, loading: propertiesLoading } = useProperties();
    const [loading, setLoading] = useState(false);
    const [hasFetchedBookings, setHasFetchedBookings] = useState(false);

    const bookings = user.bookings;

    

    useEffect(() => {
        if (user?.token && !hasFetchedBookings) {
            setLoading(true);
            const fetchBookings = async () => {
                try {
                    await actions.fetchBookings(); 
                    // console.log("User bookings after fetch:", user?.bookings);
                    // setBookings(user?.bookings || []); 
                    setHasFetchedBookings(true); 
                } catch (error) {
                    console.error("Error fetching bookings:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBookings();
        }
    }, [user?.token, actions, hasFetchedBookings, user?.bookings]);

    const bookingProperties = bookings.map((booking) => ({
        booking,
        property: properties?.find((property) => property.id === booking.propertyId),
    }));

    function calculateNights(checkInDate: string, checkOutDate: string): number {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
    
        // Calculate the difference in days, adding 1 to include the first night
        const timeDifference = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Adding 1 to count the first night
    
        return Math.max(0, nights); // Ensure non-negative number
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    
      return (
        <div>
        <Header />
        <div className="container space-y-4">
            <div className="flex flex-col items-start w-full space-y-4 sm:items-start sm:w-1/2 ml-8 mt-6 mb-8">
            <h2 className="text-4xl font-bold mb-3"> Your bookings </h2>
            <p className="text-xl flex-wrap text-black">On this page, you can view, modify, and cancel your bookings with ease. Keep track of your upcoming stays, update your booking details, or cancel any reservations directly from your account. Manage all your bookings in one convenient place!</p>
            </div>
            {bookings.length === 0 ? (
                <p>Du har ingen bokad staycation.</p>
            ) : (
                <div className="flex items-center justify-center w-full min-h-screen p-5 md_min-h-[70vh] lg:min-h-[60vh]"> 
                
                {bookingProperties.map(({ booking, property }) => (
                        <div key={booking.id} className="flex flex-col md:flex-row items-center max-w-5xl w-full">
                            <div className="flex-shrink-0 w-full md:w-1/2 md:mr-8">
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
                            {property && (
                                        <div>
                                            <h1 className="text-4xl text-black"> {property.name}</h1>
                                            <p className="text-xl text-black"><strong>Description:</strong> {property.description}</p>
                                            <p className="text-xl text-black"><strong>Location:</strong> {property.location}</p>
                                        </div>
                                    )}
                            <p className="text-xl text-black"><strong>Check in:</strong> {format(new Date(booking.checkInDate), 'dd MMM yyyy')}</p>
                            <p className="text-xl text-black"><strong>Check out:</strong> {format(new Date(booking.checkOutDate), 'dd MMM yyyy')}</p>
                            <p className="text-xl text-black">
                            <strong>Total Nights:</strong> {calculateNights(booking.checkInDate, booking.checkOutDate)} nights
                            </p>
                            <p className="text-xl text-black"><strong>Totalt pris</strong> {booking.totalPrice}kr</p>
                            <div className="flex gap-4"> 
                            <button className="text-gray-600 hover:text-gray-900 hover:text-lg mt-4 ">Edit booking
                                </button>
                            <button className="text-gray-600 hover:text-red-700 hover:text-lg mt-4">Cancel
                                </button>
                            </div>
                           
                            </div>
                            
                        </div>
                    ))}
                
                </div>
            )}
        </div>
        <Footer />
    </div>
      );
    }
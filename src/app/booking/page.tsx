"use client"

import Header from "@/components/content/header";
import Footer from "@/components/content/footer";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user";
import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { Booking } from "@/app/types/property";

// interface Booking {
//     id: string;
//     propertyId: string;
//     startDate: string;
//     endDate: string;
//     guests: number;
//   }


export default function BookingDetails() {
    const user = useUser();
    const { actions } = useUser();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasFetchedBookings, setHasFetchedBookings] = useState(false);

    

    useEffect(() => {
        if (user?.token && !hasFetchedBookings) {
            setLoading(true);
            const fetchBookings = async () => {
                try {
                    await actions.fetchBookings(); 
                    console.log("User bookings after fetch:", user?.bookings);
                    setBookings(user?.bookings || []); 
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

   
    if (loading) {
        return <div>Loading...</div>;
    }

    
      return (
        <div>
        <Header />
        <div className="container space-y-4">
            {bookings.length === 0 ? (
                <p>Du har ingen bokad staycation.</p>
            ) : (
                <div className="flex items-center justify-center w-full min-h-screen p-5 md_min-h-[70vh] lg:min-h-[60vh]"> 
                
                    {bookings.map((booking) => (
                        <div key={booking.id} className="flex flex-col md:flex-row items-center max-w-5xl w-full">
                            <div className="flex-shrink-0 w-full md:w-1/2 md:mr-8">
                             {/* Lägg till bild här */}
                            </div>

                            <div> 
                            <h2 className="text-4xl text-black">{booking.propertyId}</h2>
                            <p className="text-sm text-black"><strong>Start Date:</strong> {format(new Date(booking.checkInDate), 'dd MMM yyyy')}</p>
                            <p className="text-sm text-black"><strong>End Date:</strong> {format(new Date(booking.checkOutDate), 'dd MMM yyyy')}</p>
                            <p className="text-sm text-black"><strong>Totalt pris</strong> {booking.totalPrice}kr</p>
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
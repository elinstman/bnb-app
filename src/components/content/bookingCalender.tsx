"use client"

import { useState } from "react";
import { useProperties } from "@/context/property";
import { useBookings } from "@/context/bookings";
import { Calendar } from "../ui/calendar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface BookingCalendarProps {
    choosenProperty: string;  
    userId: string | null;
    closeModal: () => void;
}

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}


export default function BookingCalender({ choosenProperty, userId, closeModal  }: BookingCalendarProps) {
    const { properties } = useProperties();
    const { actions, loading } = useBookings();
    const selectedProperty = properties?.find(property => property.id === choosenProperty);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);


    const [selectedRange, setSelectedRange] = useState<DateRange>({
        from: undefined,
        to: undefined
    });


    if (!selectedProperty) {
        return <p>Property not found.</p>;
    }

    const handleDateChange = (date: DateRange | undefined) => {
        setSelectedRange(date || { from: undefined, to: undefined });
    };

    const handleBooking = () => {
        if (selectedRange.from && selectedRange.to && userId) {
            const checkInDate = selectedRange.from.toISOString();
            const checkOutDate = selectedRange.to.toISOString();

            actions.createBooking(
                choosenProperty,
                checkInDate,
                checkOutDate,
                userId
            );

            const propertyId = choosenProperty; 
        
            console.log("Bokning skickas:", {
                checkInDate,
                checkOutDate,
                propertyId, 
                userId,
            });

            setBookingConfirmed(true);
            setTimeout(() => closeModal(), 2000);

           

            // toast.success("Your booking is complete!")
            //    closeModal();  
        }
       
    };

    const handleCloseForm = () => {
        closeModal();  // Close the modal when the user clicks the close button
    };
   
 


    return (
        <div className="flex flex-col gap-2 justify-center">
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

            {/* Conditionally render based on booking confirmation */}
            {bookingConfirmed ? (
                <div className="flex flex-col gap-2 justify-center">
                    <h2 className="text-xl text-bold">Your booking is saved!</h2>
                    <div className="flex justify-center">
                        <button onClick={handleCloseForm} className="mt-4 btn-primary">
                            This form is closing soon
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl text-bold">Do you want to book {selectedProperty.name}?</h2>
                    <p>Price per night: {selectedProperty.pricePerNight}kr</p>
                    <div className="flex justify-center">
                        <Calendar
                            mode="range"
                            selected={{ from: selectedRange.from, to: selectedRange.to }}
                            onSelect={handleDateChange}
                            className="rounded-md border"
                        />
                    </div>
                    {selectedRange.from && selectedRange.to ? (
                        <div className="mt-4">
                            <p>
                                Check-in: {selectedRange.from.toLocaleDateString()} <br />
                                Check-out: {selectedRange.to.toLocaleDateString()}
                            </p>

                            {/* Button to confirm the booking */}
                            <button onClick={handleBooking} className="mt-4 btn-primary">
                                Confirm Booking
                            </button>
                        </div>
                    ) : (
                        <p>Please select a check-in and check-out date.</p>
                    )}
                </div>
            )}
        </div>
    )
}
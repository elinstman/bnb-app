import { createContext, PropsWithChildren, useContext, useState, useEffect } from 'react';
import { useUser } from './user';
import { Booking } from "@/app/types/property";

//

type BookingContextState = {
    bookings: Booking[] | null;
    loading: boolean;
    error: string | null;
    actions: {
    //   createBooking: (
    //     propertyId: string,
    //     checkInDate: string,
    //     checkOutDate: string,
    //     totalPrice: number
    //   ) => Promise<void>;
    //   updateBooking: (updatedBooking: Booking) => Promise<void>;
      deleteBooking: (bookingId: string) => Promise<void>;
    };
  };

  const defaultState: BookingContextState = {
    bookings: null,
    loading: false,
    error: null,
    actions: {
    //   createBooking: () => Promise.resolve(),
    //   updateBooking: () => Promise.resolve(),
      deleteBooking: () => Promise.resolve(),
    },
  };

  const BookingsContext = createContext<BookingContextState>(defaultState);

  export const BookingsProvider = ({ children }: PropsWithChildren) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const user = useUser();

    const deleteBooking: typeof defaultState.actions.deleteBooking = async (bookingId) => {
        try {
            setLoading(true);
            if (!user) throw new Error("User is not authenticated.");
    
            console.log("Deleting booking with ID:", bookingId);
    
            // Anropa deleteProperty från backend
            const response = await fetch("http://localhost:3000/api/bookings", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ id: bookingId }), // Skicka id i request body
            });
    
            const responseBody = await response.json();
            console.log("Delete response:", responseBody);
    
            if (!response.ok) {
                throw new Error(responseBody.error || "Failed to delete booking");
            }
    
            setBookings((prevBookings) =>
                prevBookings ? prevBookings.filter((booking) => booking.id !== bookingId) : []
            );
    
            console.log(`Property with ID ${bookingId} deleted successfully.`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
      return (
        <BookingsContext.Provider 
        value={{ 
            bookings, 
            loading, 
            error, 
            actions: {
                deleteBooking,
              },
             }}>
          {children}
        </BookingsContext.Provider>
      );
    };
    
    export const useBookings = (): BookingContextState => {
      const context = useContext(BookingsContext);
      if (!context) {
        throw new Error('useBookings must be used within a BookingsProvider');
      }
      return context;
    };
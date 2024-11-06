// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useUser } from './user';

// interface Booking {
//     id: string;
//     propertyId: string;
//     startDate: string;
//     endDate: string;
//     guests: number;
//   }

//   interface BookingsContextType {
//     bookings: Booking[];
//     setBookings: (bookings: Booking[]) => void;
//     fetchBookings: () => Promise<void>;
//     loading: boolean;
//   }

//   const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

//   export const BookingsProvider = ({ children }: { children: React.ReactNode }) => {
//     const [bookings, setBookings] = useState<Booking[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const { user } = useUser();

//     const fetchBookings = async () => {
//         if (!user?.token) {
//           console.log("No token found, cannot fetch bookings.");
//           setLoading(false);
//           return;
//         }
      
//         try {
//           // Lägg till token i Authorization header
//           const response = await fetch("/api/bookings", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${user.token}`,  // Skicka med token här
//             },
//           });
      
//           const data = await response.json();
      
//           if (response.ok) {
//             setBookings(data.bookings);
//           } else {
//             console.error("Failed to fetch bookings:", data.error);
//           }
//         } catch (error) {
//           console.error("Error fetching bookings:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
    
//       useEffect(() => {
//         if (user?.id) {
//           fetchBookings();
//         }
//       }, [user?.id]);
    
//       return (
//         <BookingsContext.Provider value={{ bookings, setBookings, fetchBookings, loading }}>
//           {children}
//         </BookingsContext.Provider>
//       );
//     };
    
//     export const useBookings = (): BookingsContextType => {
//       const context = useContext(BookingsContext);
//       if (!context) {
//         throw new Error('useBookings must be used within a BookingsProvider');
//       }
//       return context;
//     };
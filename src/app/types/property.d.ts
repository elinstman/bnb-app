export type Booking = {
    id: string;
    createdDate: string;
    checkInDate: string; 
    checkOutDate: string; 
    totalPrice: number; 
    createdById: string; 
    propertyId: string; 
};

export type Property = {
    id: string;
    name: string;
    description: string;
    location: string;
    pricePerNight: number; 
    available: boolean;
    bookings: Booking[]; 
};
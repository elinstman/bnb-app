"use client"

import { UserProvider } from "@/context/user";
import { PropertyProvider } from "@/context/property"
import { PropsWithChildren } from "react";
// import { BookingsProvider } from "@/context/bookings";

export default function Providers({ children }: PropsWithChildren) {
    return (
        <UserProvider>
            {/* <BookingsProvider> */}
            <PropertyProvider> 
            {children}
            </PropertyProvider>
            {/* </BookingsProvider> */}
        </UserProvider>
    )
} 
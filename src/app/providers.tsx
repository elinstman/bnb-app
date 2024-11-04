"use client"

import { UserProvider } from "@/context/user";
import { PropertyProvider } from "@/context/property"
import { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
    return (
        <UserProvider>
            <PropertyProvider> 
            {children}
            </PropertyProvider>
        </UserProvider>
    )
} 
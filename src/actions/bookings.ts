"use server"

import { Booking } from "@/app/types/property";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function getUsersBooking(id: string, createdDate: string, checkInDate: string, checkOutDate: string, totalPrice: number, createdById: string, propertyId: string, token: string | null): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/api/bookings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({id, createdDate, checkInDate, checkOutDate, totalPrice, createdById, propertyId, token})
    });

    const responseData = await response.json();
    console.log("Response from API:", responseData); // Logga svaret

    if (!response.ok) {
        throw new Error(`Error fetching Users bookings: ${JSON.stringify(responseData)}`);
    }

    return responseData; // Returnera svaret
}

"use server"

import { Property } from "@/app/types/property";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function updateProperty(id: string, name: string, description: string, location: string, pricePerNight: number, available: boolean, token: string | null): Promise<Property> {

    const response = await fetch(`${BASE_URL}/api/properties`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({id, name, description, location, pricePerNight, available})
    });

    const responseData = await response.json();
    console.log("Response from API:", responseData); // Logga svaret

    if (!response.ok) {
        throw new Error(`Error updating property: ${JSON.stringify(responseData)}`);
    }

    return responseData; // Returnera svaret
}

"use server"

import { Property } from "@/app/types/property";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function createProperty(name: string, description: string, location: string, pricePerNight: number, token: string | null): Promise<Property> {
    const response = await fetch(`${BASE_URL}/api/properties`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({name, description, location, pricePerNight})
    });

    const responseData = await response.json();
    console.log("Response from API:", responseData); // Logga svaret

    if (!response.ok) {
        throw new Error(`Error creating property: ${JSON.stringify(responseData)}`);
    }

    return responseData; // Returnera svaret
}

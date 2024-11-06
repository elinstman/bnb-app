"use server"

import { Property } from "@/app/types/property";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function deleteProperty(id: string, token: string | null): Promise<Property> {
    const response = await fetch(`${BASE_URL}/api/properties/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    const responseData = await response.json();
    console.log("Response from API:", responseData); // Logga svaret

    if (!response.ok) {
        throw new Error(`Error deleting property: ${JSON.stringify(responseData)}`);
    }

    return responseData; // Returnera svaret
}

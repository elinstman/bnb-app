"use server"

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function register(name: string, email: string, password: string): Promise<string> {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json()
      // throw new Error(errorData);
      throw new Error(`Registration failed: ${JSON.stringify(errorData)}`);
    }
  
    const data = await response.json();
    return data.token; // Anta att API:et returnerar en token vid lyckad registrering
  }
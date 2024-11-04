"use client"

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { createProperty as createPropertyAction } from "@/actions/createProperty";
import { promises } from "dns";
import { useUser } from "@/context/user";




type Booking = {
    id: string;
    createdDate: string;
    checkInDate: string; 
    checkOutDate: string; 
    totalPrice: number; 
    createdById: string; 
    propertyId: string; 
  };

type Property = {
    id: string;
    name: string;
    description: string;
    location: string;
    pricePerNight: number; 
    available: boolean;
    bookings: Booking[]; 
  };

type PropertyContextState = {
    properties: Property[] | null;
    loading: boolean;
    error: string | null;
    actions: {
      createProperty: (
        name: string,
        description: string,
        location: string,
        pricePerNight: number
      ) => Promise<void>
    }
  };
  
  const defaultState: PropertyContextState = {
    properties: null,
    loading: false,
    error: null,
    actions: {
      createProperty: () => Promise.resolve(),
    }
  };

const PropertyContext = createContext<Partial<PropertyContextState>>(defaultState);

// provider
export function PropertyProvider({children}: PropsWithChildren) {
    const [properties, setProperties] = useState<PropertyContextState["properties"]>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { token } = useUser();
   
    useEffect(() => {
        const fetchProperties = async () => {
          setLoading(true);
          setError(null);
    
          try {
            const response = await fetch("http://localhost:3000/api/properties");
            if (!response.ok) {
              throw new Error("Failed to fetch properties");
            }
            const data = await response.json();
            setProperties(data);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProperties();
      }, []);

      // skapa property
      const createProperty: typeof defaultState.actions.createProperty = async (name, description, location, pricePerNight) => {
        try {
          setLoading(true);

          if (!token) {
            console.error("Error: No token available for creating property"); // LOG: Error if token is missing
            throw new Error("User is not authenticated.");
          }

          const newProperty = await createPropertyAction(name, description, location, pricePerNight, token);
          setProperties((prev) => (prev ? [...prev, newProperty]: [newProperty]));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    
      return (
        <PropertyContext.Provider value={{ properties, loading, error, actions:{createProperty}}}>
          {children}
        </PropertyContext.Provider>
      );
    }
    
    // Custom hook för att använda PropertyContext
    export const useProperties = () => useContext(PropertyContext);


"use client"

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

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
  };
  
  const defaultState: PropertyContextState = {
    properties: null,
    loading: false,
    error: null,
  };

const PropertyContext = createContext<Partial<PropertyContextState>>(defaultState);

// provider
export function PropertyProvider({children}: PropsWithChildren) {
    const [properties, setProperties] = useState<PropertyContextState["properties"]>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

   
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
    
      return (
        <PropertyContext.Provider value={{ properties, loading, error }}>
          {children}
        </PropertyContext.Provider>
      );
    }
    
    // Custom hook för att använda PropertyContext
    export const useProperties = () => useContext(PropertyContext);


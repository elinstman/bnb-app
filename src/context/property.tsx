"use client"

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { createProperty as createPropertyAction } from "@/actions/createProperty";
import { deleteProperty as deletePropertyAction } from "@/actions/deleteProperty";
import { updateProperty as updatePropertyAction } from "@/actions/updateProperty";
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
      updateProperty: (updatedProperty: Property) => Promise<void>;
      deleteProperty: (propertyId: string) => Promise<void>;
    }
  };
  
  const defaultState: PropertyContextState = {
    properties: null,
    loading: false,
    error: null,
    actions: {
      createProperty: () => Promise.resolve(),
      updateProperty: () => Promise.resolve(),
      deleteProperty: () => Promise.resolve()
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
            console.log("fetched properties data", data)
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

    const updateProperty: typeof defaultState.actions.updateProperty = async (updatedProperty) => {
      try {
        setLoading(true);

        if (!token) {
          console.error("Error: No token available for updating property");
          throw new Error("User is not authenticated.");
        }

        const updated = await updatePropertyAction(
          updatedProperty.id, 
          updatedProperty.name, 
          updatedProperty.description, 
          updatedProperty.location, 
          updatedProperty.pricePerNight, 
          updatedProperty.available, 
          token);
        
        setProperties((prevProperties) =>
          prevProperties ? prevProperties.map((prop) =>
            prop.id === updated.id ? updated : prop
          ) : null
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    const deleteProperty: typeof defaultState.actions.deleteProperty = async (propertyId) => {
      try {
          setLoading(true);
          if (!token) throw new Error("User is not authenticated.");
  
          console.log("Deleting property with ID:", propertyId);
  
          // Anropa deleteProperty från backend
          const response = await fetch("http://localhost:3000/api/properties", {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({ id: propertyId }), // Skicka id i request body
          });
  
          const responseBody = await response.json();
          console.log("Delete response:", responseBody);
  
          if (!response.ok) {
              throw new Error(responseBody.error || "Failed to delete property");
          }
  
          // Efter borttagning, ta bort den från contextens properties
          setProperties((prevProperties) =>
              prevProperties ? prevProperties.filter((prop) => prop.id !== propertyId) : null
          );
  
          console.log(`Property with ID ${propertyId} deleted successfully.`);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };


    
      return (
        <PropertyContext.Provider value={{ properties, loading, error, actions:{createProperty, updateProperty, deleteProperty}}}>
          {children}
        </PropertyContext.Provider>
      );
    }
    
    // Custom hook för att använda PropertyContext
    export const useProperties = () => useContext(PropertyContext);


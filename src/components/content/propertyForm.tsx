"use client"

import { FormEvent, useState, useEffect } from "react";
import { useProperties } from "@/context/property";
import { Button } from "../ui/button";
import { Input } from "../ui/input"

export default function PropertyForm() {
    const property = useProperties();
    const [name, setName] = useState("Mysig lägenhet");
    const [description, setDescription] = useState("En mysig lägenhet mitt i city nära bussar.");
    const [location, setLocation] = useState("Stockholm");
    const [pricePerNight, setPricePerNight] = useState<number | "">("");
    const [error, setError] = useState(""); // För att hantera fel


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const parsedPrice = typeof pricePerNight === "string" ? parseFloat(pricePerNight) : pricePerNight;

        if (isNaN(parsedPrice)) {
            setError("Price must be a valid number");
            return;
        }


        console.log("Data sent to API:", {
            name,
            description,
            location,
            pricePerNight,            
        });

        try {
            await property.actions?.createProperty(
                name,
                description,
                location,
                parsedPrice 
            );

            // Rensa formulärfälten efter en lyckad skapelse
            setName("");
            setDescription("");
            setLocation("");
            setPricePerNight("");
        
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (Error) {
            console.log("Error:", Error);
        }
    }, [Error]);


    return (
        <form onSubmit={handleSubmit}>
            <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
             />
             <Input 
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
             />
             <Input 
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
             />
             <Input 
             placeholder="Price per Night"
             type="number"
             value={pricePerNight}
             onChange={(e) => {
                const value = e.target.value;
                setPricePerNight(value === "" ? "" : parseFloat(value));
            }}
             />
             <Button type="submit">Create
         </Button>
             {/* <Button variant="default">Create</Button> */}

        </form>
    )
}
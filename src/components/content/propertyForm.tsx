"use client"

import { FormEvent, useState, useEffect } from "react";
import { useProperties } from "@/context/property";
import { Button } from "../ui/button";
import { Input } from "../ui/input"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function PropertyForm() {
    const property = useProperties();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
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

            toast.success("Property has been successfully created!");

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
        <div className="container mx-auto p-8 gap-6">
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div  className="flex flex-col items-start w-full space-y-4 sm:items-start sm:w-1/2">
            <h2 className="text-4xl font-bold mb-6">Describe your home</h2>
            <p className="text-lg flex-wrap text-black">Here you can describe what type of accommodation you have and where it's located. You also need to add a price per night.</p>
            </div>

        <form onSubmit={handleSubmit} className="mt-6 mb-6">
            <span className="text-sm">Give your home a suitabe name:</span>
            <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
             />
             <span className="text-sm">What makes your home special?</span>
             <Input 
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
             />
             <span className="text-sm">Where is it located?</span>
             <Input 
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
             />
             <span className="text-sm">How much is the cost per night?</span>
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

        <Link href={"/"}>Back to home</Link>
        </div>
    )
}
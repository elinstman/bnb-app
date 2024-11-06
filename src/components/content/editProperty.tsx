"use client";

import { FormEvent, useState } from "react";
import { useProperties } from "@/context/property";
import { Property } from "@/app/types/property";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUser } from "@/context/user";
import Link from "next/link";

interface EditPropertyProps {
    property: Property;
    onSave: (updatedProperty: Property) => void;
    onClose: () => void;
}

export default function EditProperty({ property, onSave, onClose }: EditPropertyProps) {
    const [formData, setFormData] = useState<Property>({ ...property });
    const { actions } = useProperties();
    const user = useUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "pricePerNight" ? parseInt(value) : value,
        }));
    };

    

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const updatedProperty = { ...formData, id: property.id };

        console.log("Updated Property Data:", formData);

        if (actions?.updateProperty) {
            try {
                await actions.updateProperty(updatedProperty); // Uppdatera property via contexten
                onSave(updatedProperty); // Informera parent-komponenten om uppdateringen
                onClose(); // Stäng edit-komponenten
            } catch (error) {
                console.error("Failed to update property:", error);
            }
        }
    };

    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div> 
            <Input
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Description"
            />
            <Input
                placeholder="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full"
            />
            <Input
                placeholder="Price per Night"
                name="pricePerNight"
                type="number"
                value={formData.pricePerNight.toString()}
                onChange={handleChange}
                className="w-full"
            />
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={() =>
                        setFormData((prevData) => ({
                            ...prevData,
                            available: !prevData.available,
                        }))
                    }
                />
                <span>Available</span>
            </label>
            <div className="flex justify-end space-x-2">
                <Button type="button" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 text-white">
                    Save
                </Button>
            </div>
            </div> 
               
            </form>
    );
}

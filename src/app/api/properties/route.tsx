import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Kunde inte hämta egendomarna.' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const { name, description, location, pricePerNight } = await request.json();

  try {
    const property = await prisma.property.create({
      data: {
        name,
        description,
        location,
        pricePerNight: parseFloat(pricePerNight),
        available: true,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Egendomen kunde inte skapas.' }, { status: 400 });
  }
}


export async function PUT(request: Request) {
  const { id, name, description, location, pricePerNight, available } = await request.json();

  try {

    const missingFields = [];
    if (!id) missingFields.push("id");
    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (!location) missingFields.push("location");
    if (pricePerNight === undefined) missingFields.push("pricePerNight");

    // Om några fält saknas, returnera ett 400-fel med specifika fält
    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 });
    }

   
    // Kontrollera om egendomen existerar
    const existingProperty = await prisma.property.findFirst({
      where: { id },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Egendomen kunde inte hittas.' }, { status: 404 });
    }

    // Uppdatera egendomen
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        name: name || existingProperty.name,
        description: description || existingProperty.description,
        location: location || existingProperty.location,
        pricePerNight: pricePerNight !== undefined ? parseFloat(pricePerNight) : existingProperty.pricePerNight,
        available: available !== undefined ? available : existingProperty.available,
      },
    });

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Egendomen kunde inte uppdateras.' }, { status: 400 });
  }
}



// GAMLA DELETE
export async function DELETE(request: Request) {
  try {
    // Läs body från DELETE-begäran
    const { id } = await request.json();

    // Kontrollera om ID finns i begäran
    if (!id) {
      return NextResponse.json({ error: 'Ett ID krävs för att radera en egendom.' }, { status: 400 });
    }

    console.log("Received DELETE request with ID:", id);

    // Kontrollera om property finns
    const existingProperty = await prisma.property.findFirst({
      where: { id: String(id) },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Egendomen kunde inte hittas.' }, { status: 404 });
    }

    // Kontrollera om det finns några bokningar kopplade till denna property
    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: String(id),
      },
    });

    if (bookings.length > 0) {
      return NextResponse.json({ error: 'Det finns bokningar kopplade till denna egendom. Radera bokningarna först.' }, { status: 400 });
    }

    // Om inga bokningar finns, radera egendomen
    await prisma.property.delete({
      where: { id: String(id) }
    });

    return NextResponse.json({ message: 'Egendomen har tagits bort.' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json({ error: 'Egendomen kunde inte tas bort.' }, { status: 500 });
  }
}
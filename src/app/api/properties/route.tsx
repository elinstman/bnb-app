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

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const existingProperty = await prisma.property.findFirst({
      where: { id },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Egendomen kunde inte hittas.' }, { status: 404 });
    }

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Egendomen har tagits bort.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Egendomen kunde inte tas bort.' }, { status: 400 });
  }
}
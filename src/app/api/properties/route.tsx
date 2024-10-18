import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

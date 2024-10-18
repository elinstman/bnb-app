import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { checkInDate, checkOutDate, totalPrice, userId, propertyId } = await request.json();

  try {
    const booking = await prisma.booking.create({
      data: {
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        totalPrice: parseFloat(totalPrice),
        createdBy: { connect: { id: userId } },
        property: { connect: { id: propertyId } },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Bokningen kunde inte skapas.' }, { status: 400 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Couldn't get the bookings" }, { status: 400 });
  }
}

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

export async function PUT(request: Request) {
  const { id, checkInDate, checkOutDate, totalPrice, userId, propertyId } = await request.json();
  try {
    const existingBooking = await prisma.booking.findFirst({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Bokningen hittades inte.' }, { status: 404 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        checkInDate: new Date(checkInDate) || existingBooking.checkInDate,
        checkOutDate: new Date(checkOutDate) || existingBooking.checkOutDate,
        totalPrice: parseFloat(totalPrice) || existingBooking.totalPrice,
        createdBy: { connect: { id: userId } },
        property: { connect: { id: propertyId } },
      },
    });
    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "The booking couldn't be updated"}, {status: 400});
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const existingBooking = await prisma.booking.findFirst({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: 'Bokningen hittades inte.' }, { status: 404});
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({message: "The booking has been deleted."}, {status: 200});
    } catch (error) {
      return NextResponse.json({message: "The booking couldn't be deleted."}, {status: 400});
    }
  }

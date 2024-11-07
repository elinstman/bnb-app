import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { differenceInDays } from 'date-fns';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const getUserIdFromToken = (token: string) => {
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);  // Verifiera och dekoda token
    return decoded.userId;  // Anta att userId finns i token-payloaden
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export async function GET(request: Request) {
  try {
    // Hämta användarens ID från request-headers (eller query-parametrar)
    const token = request.headers.get("Authorization")?.split(" ")[1]; 
    if (!token) {
      return NextResponse.json({ error: "Authorization token is missing." }, { status: 400 });
    }

    const userId = await getUserIdFromToken(token); 

    if (!userId) {
      return NextResponse.json({ error: "User not found or invalid token." }, { status: 400 });
    }

    // Hämtar bokningar för användaren
    const bookings = await prisma.booking.findMany({
      where: {
        createdById: userId, 
      },
    });

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ message: "No bookings found for this user." }, { status: 404 });
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Couldn't get the bookings" }, { status: 400 });
  }
}




export async function POST(request: Request) {
  const { checkInDate, checkOutDate, userId, propertyId } = await request.json();

  try {

    const property = await prisma.property.findFirst({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json({ error: "The property couldn't be found"}, {status: 404});
    }

    const nights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
    if(nights <= 0) {
      return NextResponse.json({ error: "Check out date must be after check in date"}, {status: 400});
    }

    const totalPrice = nights * property.pricePerNight;


    const booking = await prisma.booking.create({
      data: {
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        totalPrice,
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

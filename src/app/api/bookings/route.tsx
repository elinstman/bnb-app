// pages/api/bookings/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { checkInDate, checkOutDate, totalPrice, userId, propertyId } = req.body;

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

      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: 'Bokningen kunde inte skapas.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

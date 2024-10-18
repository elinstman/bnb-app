// pages/api/properties/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, description, location, pricePerNight } = req.body;

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

      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: 'Egendomen kunde inte skapas.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

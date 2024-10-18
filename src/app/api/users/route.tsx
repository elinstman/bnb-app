// pages/api/users/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password, isAdmin } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          isAdmin: isAdmin || false,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Användaren kunde inte skapas.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

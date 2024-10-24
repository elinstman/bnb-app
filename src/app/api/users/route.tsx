import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, email, password, isAdmin } = await request.json();

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        isAdmin: isAdmin || false,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Användaren kunde inte skapas.' }, { status: 400 });
  }
}


import { UserRegistrationData } from "@/app/types/user";
import { hashPassword } from "@/app/utils/bcrypt";
import { userExists } from "@/app/utils/prisma";
import { userRegistrationValidator } from "@/app/utils/validators/userValidator";
import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { signJWT } from "@/app/utils/jwt";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body: UserRegistrationData = await request.json();
        const [hasErrors, errors] = userRegistrationValidator(body);
        if(hasErrors) {
            return NextResponse.json(
                {
                    errors,
                },
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await hashPassword(body.password);

        const exists = await userExists(body.email, prisma);
        if (exists) {
            return NextResponse.json(
                {
                    message: "User with this email already exists",
                },
                {
                    status: 400,                }
            );
        }
        const user: User = await prisma.user.create({
            data: {
                email: body.email.toLowerCase(),
                password: hashedPassword,
                name: body.name,
            },
        });

        const token = await signJWT({
            userId: user.id
        })

        return NextResponse.json({token}, {status: 201});
    } catch (error: any) {
        console.log("Error: failed", error)
        return NextResponse.json(
            {
                message: "A valid 'user registration' object has to be sent",
              },
              {
                status: 400,
              }
        )
    }
}
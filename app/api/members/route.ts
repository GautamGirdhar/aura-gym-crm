import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateExpiryDate } from "@/lib/membership";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const expiryDate = calculateExpiryDate(new Date(body.joinDate), body.plan);

    const member = await prisma.member.create({
      data: {
        name: body.name,
        gender: body.gender,
        phone: body.phone,
        joinDate: new Date(body.joinDate),
        expiryDate,
        plan: body.plan,
        branchId: body.branchId,

        amountPaid: Number(body.amountPaid),

        payments: {
          create: {
            amount: Number(body.amountPaid),
            plan: body.plan,
          },
        },
      },
    });

    return Response.json({
      success: true,
      member,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const field = (error.meta?.target as string[])?.[0];

      let message = "Duplicate value detected.";

      if (field === "phone") {
        message = "A member with this phone number already exists.";
      }

      if (field === "email") {
        message = "A member with this email already exists.";
      }

      return Response.json(
        {
          success: false,
          message,
        },
        {
          status: 400,
        },
      );
    }

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}

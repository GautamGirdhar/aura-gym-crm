import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateExpiryDate } from "@/lib/membership";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const body = await request.json();

    const member = await prisma.member.findUnique({
      where: {
        id,
      },
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found",
        },
        {
          status: 404,
        },
      );
    }

    const today = new Date();

    const baseDate = member.expiryDate > today ? member.expiryDate : today;

    const newExpiryDate = calculateExpiryDate(baseDate, body.plan);

    const updatedMember = await prisma.member.update({
      where: {
        id,
      },
      data: {
        plan: body.plan,
        expiryDate: newExpiryDate,
        amountPaid: Number(body.amount),
      },
    });

    await prisma.payment.create({
      data: {
        amount: Number(body.amount),
        plan: body.plan,
        memberId: member.id,
      },
    });

    return NextResponse.json({
      success: true,
      member: updatedMember,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to renew membership",
      },
      {
        status: 500,
      },
    );
  }
}

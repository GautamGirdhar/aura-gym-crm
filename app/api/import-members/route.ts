import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { Gender, PlanType } from "@prisma/client";

interface ExcelMemberRow {
  name: string;
  phone: string | number;
  gender: Gender;
  plan: PlanType;
  joinDate: string;
  amountPaid: number | string;
  branch: string;
}

interface ImportError {
  phone: string;
  reason: string;
}

export async function POST(request: Request) {
  const errors: ImportError[] = [];

  let imported = 0;
  let skipped = 0;
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<ExcelMemberRow>(sheet);

    for (const row of rows) {
      if (
        !row.name ||
        !row.phone ||
        !row.gender ||
        !row.plan ||
        !row.joinDate ||
        !row.amountPaid ||
        !row.branch
      ) {
        skipped++;

        errors.push({
          phone: String(row.phone ?? "Unknown"),
          reason: "Missing required fields",
        });

        continue;
      }

      const existingMember = await prisma.member.findUnique({
        where: {
          phone: String(row.phone),
        },
      });

      if (existingMember) {
        skipped++;

        errors.push({
          phone: String(row.phone),
          reason: "Phone number already exists",
        });

        continue;
      }

      const validGenders: Gender[] = ["MALE", "FEMALE"];

      if (!validGenders.includes(row.gender)) {
        skipped++;

        errors.push({
          phone: String(row.phone),
          reason: "Invalid gender value",
        });

        continue;
      }

      const validPlans: PlanType[] = [
        "MONTHLY",
        "QUARTERLY",
        "HALF_YEARLY",
        "YEARLY",
      ];

      if (!validPlans.includes(row.plan)) {
        skipped++;

        errors.push({
          phone: String(row.phone),
          reason: "Invalid plan value",
        });

        continue;
      }
      const joinDate = new Date(row.joinDate);

      if (isNaN(joinDate.getTime())) {
        skipped++;

        errors.push({
          phone: String(row.phone),
          reason: "Invalid join date",
        });

        continue;
      }

      const expiryDate = new Date(joinDate);

      switch (row.plan) {
        case "MONTHLY":
          expiryDate.setMonth(expiryDate.getMonth() + 1);
          break;

        case "QUARTERLY":
          expiryDate.setMonth(expiryDate.getMonth() + 3);
          break;

        case "HALF_YEARLY":
          expiryDate.setMonth(expiryDate.getMonth() + 6);
          break;

        case "YEARLY":
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          break;
      }

      const branch = await prisma.branch.findFirst({
        where: {
          name: row.branch,
        },
      });

      if (!branch) {
        skipped++;

        errors.push({
          phone: String(row.phone),
          reason: `Branch "${row.branch}" not found`,
        });

        continue;
      }

      try {
        await prisma.member.create({
          data: {
            name: row.name,
            phone: String(row.phone),
            gender: row.gender,
            plan: row.plan,
            joinDate,
            expiryDate,
            amountPaid: Number(row.amountPaid),

            branchId: branch.id,
          },
        });

        imported++;
      } catch (error) {
        skipped++;

        errors.push({
          phone: String(row.phone),
          reason: "Failed to create member",
        });

        console.error(error);

        continue;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      errors,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}

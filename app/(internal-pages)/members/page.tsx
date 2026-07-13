import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MemberFilters from "@/components/member-filters";
import { Prisma, Gender, PlanType } from "@prisma/client";
import Pagination from "@/components/pagination";

interface MembersPageProps {
  searchParams: Promise<{
    search?: string;
    plan?: string;
    gender?: string;
    branch?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}

function getMemberStatus(expiryDate: Date) {
  const today = new Date();

  // Time part remove karne ke liye
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffInDays = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays < 0) {
    return {
      label: "Expired",
      color: "bg-red-100 text-red-700",
      daysRemaining: diffInDays,
    };
  }

  if (diffInDays <= 7) {
    return {
      label: "Expiring Soon",
      color: "bg-yellow-100 text-yellow-700",
      daysRemaining: diffInDays,
    };
  }

  return {
    label: "Active",
    color: "bg-green-100 text-green-700",
    daysRemaining: diffInDays,
  };
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const plan = params.plan || "";
  const gender = params.gender || "";
  const branch = params.branch || "";
  const status = params.status || "";
  const sort = params.sort || "asc";
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 10;

  const today = new Date();

  const where: Prisma.MemberWhereInput = {};
  const totalMembers = await prisma.member.count({
    where,
  });
  const branches = await prisma.branch.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const totalPages = Math.ceil(totalMembers / ITEMS_PER_PAGE);

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
        },
      },
    ];
  }

  if (plan) {
    where.plan = plan as PlanType;
  }

  if (gender) {
    where.gender = gender as Gender;
  }

  if (branch) {
    where.branchId = branch;
  }

  if (status === "ACTIVE") {
    where.expiryDate = {
      gte: today,
    };
  }

  if (status === "EXPIRED") {
    where.expiryDate = {
      lt: today,
    };
  }

  if (status === "EXPIRING") {
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    where.expiryDate = {
      gte: today,
      lte: next7Days,
    };
  }

  const members = await prisma.member.findMany({
    where,
    include: {
      branch: true,
      payments: {
        take: 1,
        orderBy: {
          paymentDate: "desc",
        },
      },
    },
    orderBy: {
      expiryDate: sort === "asc" ? "asc" : "desc",
    },
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Members</h1>

        <Link
          href="/members/new"
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          Add Member
        </Link>
      </div>
      <MemberFilters branches={branches} />

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Gender</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Plan</th>
              <th className="text-left p-4">Branch</th>
              <th className="text-left p-4">Last Payment</th>
              <th className="text-left p-4">Join Date</th>
              <th className="text-left p-4">Expiry Date</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => {
              const status = getMemberStatus(member.expiryDate);

              return (
                <tr key={member.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">
                    <Link href={`/members/${member.id}`}>{member.name}</Link>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full border text-sm">
                      {member.gender}
                    </span>
                  </td>

                  <td className="p-4">{member.phone}</td>

                  <td className="p-4">{member.plan.replaceAll("_", " ")}</td>

                  <td className="p-4">{member.branch.name}</td>

                  <td className="p-4">
                    {member.payments.length > 0
                      ? `₹${member.payments[0].amount}`
                      : "-"}
                  </td>

                  <td className="p-4">
                    {member.joinDate.toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-4">
                    {member.expiryDate.toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        status.color === "green"
                          ? "bg-green-100 text-green-700"
                          : status.color === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2">
                    <Link
                      href={`/members/${member.id}`}
                      className="px-3 py-1 border rounded"
                    >
                      View
                    </Link>

                    <Link
                      href={`/members/${member.id}/renew`}
                      className="px-3 py-1 bg-black text-white rounded"
                    >
                      Renew
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className="p-10 text-center text-gray-500">No members found</div>
        )}
      </div>

      <div className="border-t px-6 py-4 flex justify-end">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

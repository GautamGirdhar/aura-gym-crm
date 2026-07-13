import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ExpiringMembersPage() {
  const today = new Date();

  const next3Days = new Date();
  next3Days.setDate(today.getDate() + 3);

  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  // Already expired
  const expiredMembers = await prisma.member.findMany({
    where: {
      expiryDate: {
        lt: today,
      },
    },
    orderBy: {
      expiryDate: "asc",
    },
  });

  // Expiring within 3 days
  const expiringIn3Days = await prisma.member.findMany({
    where: {
      expiryDate: {
        gte: today,
        lte: next3Days,
      },
    },
    orderBy: {
      expiryDate: "asc",
    },
  });

  // Expiring within 7 days but not already included in 3 days
  const expiringIn7Days = await prisma.member.findMany({
    where: {
      expiryDate: {
        gt: next3Days,
        lte: next7Days,
      },
    },
    orderBy: {
      expiryDate: "asc",
    },
  });

  const calculateDays = (expiryDate: Date) => {
    return Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  const renderTable = (
    title: string,
    members: typeof expiredMembers,
    type: "expired" | "3days" | "7days",
  ) => (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">
        {title} ({members.length})
      </h2>

      {members.length === 0 ? (
        <p className="text-gray-500">No members found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Phone</th>
                <th className="text-left py-3">Plan</th>
                <th className="text-left py-3">Expiry Date</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => {
                const days = calculateDays(member.expiryDate);

                return (
                  <tr key={member.id} className="border-b">
                    <td className="py-4">
                      <Link
                        href={`/members/${member.id}`}
                        className="font-medium hover:underline"
                      >
                        {member.name}
                      </Link>
                    </td>

                    <td>{member.phone}</td>

                    <td>{member.plan.replaceAll("_", " ")}</td>

                    <td>{member.expiryDate.toLocaleDateString("en-IN")}</td>

                    <td>
                      {type === "expired" ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          Expired {Math.abs(days)} days ago
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                          {days} days left
                        </span>
                      )}
                    </td>

                    <td>
                      <Link
                        href={`/members/${member.id}/renew`}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                      >
                        Renew
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Expiring Members</h1>

        <p className="text-gray-500 mt-2">Track renewals and follow-ups.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-red-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold">Expired</h3>

          <p className="text-4xl font-bold mt-2">{expiredMembers.length}</p>
        </div>

        <div className="bg-yellow-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold">Expiring in 3 Days</h3>

          <p className="text-4xl font-bold mt-2">{expiringIn3Days.length}</p>
        </div>

        <div className="bg-orange-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold">Expiring in 7 Days</h3>

          <p className="text-4xl font-bold mt-2">{expiringIn7Days.length}</p>
        </div>
      </div>

      {renderTable("Expired Members", expiredMembers, "expired")}

      {renderTable("Expiring Within 3 Days", expiringIn3Days, "3days")}

      {renderTable("Expiring Within 7 Days", expiringIn7Days, "7days")}
    </div>
  );
}

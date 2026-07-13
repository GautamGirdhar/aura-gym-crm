import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function MemberDetailsPage({ params }: Props) {
  const { id } = await params;

  const member = await prisma.member.findUnique({
    where: {
      id,
    },
    include: {
      payments: {
        orderBy: {
          paymentDate: "desc",
        },
      },
    },
  });

  if (!member) {
    notFound();
  }

  const today = new Date();

  const daysRemaining = Math.ceil(
    (member.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const status =
    daysRemaining < 0
      ? "Expired"
      : daysRemaining <= 7
        ? "Expiring Soon"
        : "Active";

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">{member.name}</h1>

          <p className="text-gray-500 mt-2">Member ID: {member.id}</p>
        </div>

        <div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold
            ${
              status === "Active"
                ? "bg-green-100 text-green-700"
                : status === "Expiring Soon"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Member Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

          <div className="space-y-3">
            <p>
              <strong>Name:</strong> {member.name}
            </p>

            <p>
              <strong>Gender:</strong> {member.gender}
            </p>

            <p>
              <strong>Phone:</strong> {member.phone}
            </p>
          </div>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Membership Information</h2>

          <div className="space-y-3">
            <p>
              <strong>Plan:</strong> {member.plan.replaceAll("_", " ")}
            </p>

            <p>
              <strong>Join Date:</strong>{" "}
              {member.joinDate.toLocaleDateString("en-IN")}
            </p>

            <p>
              <strong>Expiry Date:</strong>{" "}
              {member.expiryDate.toLocaleDateString("en-IN")}
            </p>

            <p>
              <strong>Days Remaining:</strong>{" "}
              {daysRemaining < 0
                ? `${Math.abs(daysRemaining)} days ago`
                : `${daysRemaining} days`}
            </p>

            <p>
              <strong>Current Fee:</strong> ₹{member.amountPaid}
            </p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Payment History</h2>

          <Link
            href={`/members/${member.id}/renew`}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            Renew Membership
          </Link>
        </div>

        {member.payments.length === 0 ? (
          <p className="text-gray-500">No payment history available.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Plan</th>
                <th className="text-left py-3">Amount</th>
              </tr>
            </thead>

            <tbody>
              {member.payments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="py-4">
                    {payment.paymentDate.toLocaleDateString("en-IN")}
                  </td>

                  <td className="py-4">{payment.plan.replaceAll("_", " ")}</td>

                  <td className="py-4">₹{payment.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

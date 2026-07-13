import { prisma } from "@/lib/prisma";
import DashboardCard from "@/components/dashboard-card";

export default async function DashboardPage() {
  const today = new Date();

  const totalMembers = await prisma.member.count();

  const activeMembers = await prisma.member.count({
    where: {
      expiryDate: {
        gte: today,
      },
    },
  });

  const expiredMembers = await prisma.member.count({
    where: {
      expiryDate: {
        lt: today,
      },
    },
  });

  const next7Days = new Date();

  next7Days.setDate(today.getDate() + 7);

  const expiringSoon = await prisma.member.count({
    where: {
      expiryDate: {
        gte: today,
        lte: next7Days,
      },
    },
  });

  const maleMembers = await prisma.member.count({
    where: {
      gender: "MALE",
    },
  });

  const femaleMembers = await prisma.member.count({
    where: {
      gender: "FEMALE",
    },
  });

  const payments = await prisma.payment.findMany({
    where: {
      paymentDate: {
        gte: new Date(today.getFullYear(), today.getMonth(), 1),
      },
    },
  });

  const monthlyRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Members" value={totalMembers} />

        <DashboardCard title="Active Members" value={activeMembers} />

        <DashboardCard title="Expired Members" value={expiredMembers} />

        <DashboardCard title="Expiring Soon" value={expiringSoon} />

        <DashboardCard title="Male Members" value={maleMembers} />

        <DashboardCard title="Female Members" value={femaleMembers} />

        <DashboardCard title="Monthly Revenue" value={`₹${monthlyRevenue}`} />
      </div>
    </div>
  );
}

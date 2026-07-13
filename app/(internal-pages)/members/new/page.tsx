import { prisma } from "@/lib/prisma";
import AddMemberForm from "@/components/add-member-form";

export default async function AddMemberPage() {
  const branches = await prisma.branch.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return <AddMemberForm branches={branches} />;
}

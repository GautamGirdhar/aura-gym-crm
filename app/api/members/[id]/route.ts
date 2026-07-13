import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: Request, { params }: Props) {
  const { id } = await params;

  try {
    await prisma.member.delete({
      where: {
        id,
      },
    });

    return Response.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to delete member",
      },
      {
        status: 500,
      },
    );
  }
}

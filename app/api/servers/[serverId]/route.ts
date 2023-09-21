import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { imageUrl, name } = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        profileId: profile.id,
        id: params.serverId,
      },
      data: {
        imageUrl,
        name,
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.error("[SERVER_ID]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

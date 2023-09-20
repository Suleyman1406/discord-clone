import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerSidebarHeader from "./server-header";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) {
    return redirect("/");
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type == ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type == ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type == ChannelType.VIDEO
  );
  const members = server.members.filter((member) => member.id != profile.id);

  const role = server.members.find(
    (member) => member.profile.id == profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerSidebarHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectSeparator } from "@/components/ui/select";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import ServerSidebarHeader from "./server-header";
import ServerSearch from "./server-search";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

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
  const members = server.members.filter(
    (member) => member.profileId != profile.id
  );

  const role = server.members.find(
    (member) => member.profile.id == profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerSidebarHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channel",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Voice Channel",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Video Channel",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  icon: iconMap[channel.type],
                  name: channel.name,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  id: member.id,
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                })),
              },
            ]}
          />
          <SelectSeparator className="bg-zinc-500 dark:bg-zinc-700 rounded-md my-2" />
        </div>
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="text channels"
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="voice channels"
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="video channels"
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              label="members"
              sectionType="members"
              server={server}
              role={role}
            />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;

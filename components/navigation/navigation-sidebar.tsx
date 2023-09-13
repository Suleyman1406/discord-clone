import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toogle";
import NavigationAction from "./navigation-action";
import NavigationItem from "./navigation-item";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="h-full">
        {servers.map((server) => (
          <div key={server.id}>
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              label={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto pb-3 flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-[48px] h-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;

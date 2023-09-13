"use client";

import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
interface NavigationItemProps {
  id: string;
  imageUrl: string;
  label: string;
}
const NavigationItem = ({ id, imageUrl, label }: NavigationItemProps) => {
  const { serverId } = useParams();
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(`/servers/${serverId}`);
  }, [serverId, router]);

  return (
    <ActionTooltip label={label} side="right" align="center">
      <button onClick={onClick} className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            serverId !== id && "group-hover:h-[20px]",
            serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            serverId === id && "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;

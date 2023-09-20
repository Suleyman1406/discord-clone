"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import useOrigin from "@/hooks/use-origin";
import { useCallback, useMemo, useState } from "react";
import axios from "axios";

const InviteModal = () => {
  const {
    type,
    isOpen,
    onOpen,
    onClose,
    data: { server },
  } = useModal();
  const [isCopied, setCopied] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const origin = useOrigin();
  const isModalOpen = isOpen && type == "invite";

  const inviteUrl = useMemo(
    () => `${origin}/invite/${server?.inviteCode}`,
    [origin, server]
  );

  const onCopy = useCallback(async () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [inviteUrl]);

  const onRegenerateLink = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("invite", { server: response.data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [server, onOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              onChange={() => 0}
              value={inviteUrl}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            size="sm"
            variant="link"
            disabled={isLoading}
            onClick={onRegenerateLink}
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCcw className="w-4 h-4 ml-2 mt-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;

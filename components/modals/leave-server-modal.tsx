"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

const LeaveServerModal = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const {
    type,
    isOpen,
    onClose,
    data: { server },
  } = useModal();

  const isModalOpen = isOpen && type == "leaveServer";

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      // router.refresh();
      router.push("/");
    } catch (err) {
      console.error("LEAVE_SERVER_REQUEST", err);
    } finally {
      setLoading(false);
    }
  }, [onClose, router, server]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;

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

const DeleteServerModal = () => {
  const [isLoading, setLoading] = useState(false);
  // const router = useRouter();
  const {
    type,
    isOpen,
    onClose,
    data: { server },
  } = useModal();

  const isModalOpen = isOpen && type == "deleteServer";

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);

      onClose();
      // router.push("/");
      // router.refresh();
      window.location.reload();
    } catch (err) {
      console.error("DELETE_SERVER_REQUEST", err);
    } finally {
      setLoading(false);
    }
  }, [onClose, server]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{" "}
            will be permamently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={onConfirm}
              className="bg-rose-500 hover:bg-rose-400"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;

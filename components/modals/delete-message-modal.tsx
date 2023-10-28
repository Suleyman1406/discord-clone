"use client";

import { useCallback, useState } from "react";
import qs from "query-string";
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

const DeleteMessageModal = () => {
  const [isLoading, setLoading] = useState(false);
  const {
    type,
    isOpen,
    onClose,
    data: { query, apiUrl },
  } = useModal();

  const isModalOpen = isOpen && type == "deleteMessage";

  const onConfirm = useCallback(async () => {
    try {
      setLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.delete(url);

      onClose();
    } catch (err) {
      console.error("DELETE_CHANNEL_REQUEST", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, onClose, query]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this?
            <br />
            The message will be permamently deleted.
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

export default DeleteMessageModal;

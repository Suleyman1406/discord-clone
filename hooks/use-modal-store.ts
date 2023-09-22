import { ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "editServer"
  | "invite"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer";

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
}
export interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  onClose: () => void;
  isOpen: boolean;
  onOpen: (
    type: ModalType,
    data?: ModalData,
    channelType?: ChannelType
  ) => void;
}

export const useModal = create<ModalStore>((set) => ({
  data: {},
  type: null,
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));

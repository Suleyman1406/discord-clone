"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal";

const ModalProvider = () => {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
    </>
  );
};

export default ModalProvider;

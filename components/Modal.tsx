import React, { useRef } from "react";
import { GrClose } from "react-icons/gr";
import { useClickOutside } from "../hooks/useClickOutside";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useClickOutside(contentRef, onClose);

  return (
    <div className="z-10 w-full h-full top-0 right-0 bottom-0 left-0 fixed bg-black bg-opacity-50 flex flex-row justify-center items-center">
      <div
        ref={contentRef}
        className="w-11/12 max-w-lg bg-white rounded-md p-8"
      >
        <div className="flex flex-row justify-between items-center mb-2">
          <p className="text-2xl font-semibold">{title}</p>
          <GrClose className="cursor-pointer" onClick={onClose} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

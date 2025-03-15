"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
} from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the context types
interface ModalContextType {
  isOpen: boolean;
  title: string;
  description: string;
  content: ReactNode | null;
  actions: ReactNode | null;
  openModal: ({
    title,
    description,
    content,
    actions,
  }: {
    title: string;
    description: string;
    content: ReactNode;
    actions: ReactNode;
  }) => void;
  closeModal: () => void;
}

// Create the context with a default value
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<ReactNode>(null);
  const [actions, setActions] = useState<ReactNode>(null);

  const openModal = ({
    title,
    description,
    content,
    actions,
  }: {
    title: string;
    description: string;
    content: ReactNode;
    actions: ReactNode;
  }) => {
    setTitle(title);
    setDescription(description);
    setContent(content);
    setActions(actions);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
    setActions(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        title,
        description,
        content,
        actions,
        openModal,
        closeModal,
      }}
    >
      {children}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={closeModal}>
          <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto z-50">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {content}
            {actions && (
              <DialogFooter>
                <div className="modal-actions mt-4">{actions}</div>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </ModalContext.Provider>
  );
};

// Custom hook to access modal context
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

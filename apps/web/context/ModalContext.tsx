"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  useEffect,
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
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

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
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<ReactNode>(null);
  const [actions, setActions] = useState<ReactNode>(null);
  const isMobile = useIsMobile();
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
      {!isMobile ? (
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
      ) : (
        <Drawer open={isOpen} onOpenChange={closeModal}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">{content}</div>
            {actions && (
              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      )}
      {children}
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

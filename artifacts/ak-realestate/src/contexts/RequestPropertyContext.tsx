import { createContext, useContext, useState, ReactNode } from "react";

interface RequestPropertyContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
}

const RequestPropertyContext = createContext<RequestPropertyContextType | undefined>(undefined);

export function RequestPropertyProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <RequestPropertyContext.Provider value={{ isOpen, setIsOpen, openModal, closeModal }}>
      {children}
    </RequestPropertyContext.Provider>
  );
}

export function useRequestProperty() {
  const context = useContext(RequestPropertyContext);
  if (!context) {
    throw new Error("useRequestProperty must be used within a RequestPropertyProvider");
  }
  return context;
}
